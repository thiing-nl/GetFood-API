import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import * as _ from 'lodash';
import { Document } from 'mongoose';
import { Forbidden, NotFound } from 'ts-httpexceptions';
import { User } from '../auth/user/User';
import { UserService } from '../auth/user/UserService';
import { Family } from '../family/Family';
import { FamilyService } from '../family/FamilyService';
import { List } from './List';
import { LIST_COLORS_STRINGS } from './models/ListColors';
import { ListCreateModel } from './models/ListCreateModel';
import { ListUpdateModel } from './models/ListUpdateModel';


@Service()
export class ListService {

  constructor(
    @Inject(List) private listModel: MongooseModel<List>,
    @Inject(User) private userModel: MongooseModel<User>,
    private familyService: FamilyService,
    private userService: UserService
  ) {
    this.check();
  }

  /**
   * Creat a new list for a family
   *
   * @param {ListCreateModel} listCreateModel
   * @param {User} user
   */
  public async create(
    listCreateModel: ListCreateModel,
    user: User
  ): Promise<List> {
    const newList = new this.listModel();
    newList.title = listCreateModel.title;
    newList.color = LIST_COLORS_STRINGS[ Math.floor(Math.random() * LIST_COLORS_STRINGS.length) ];

    // Find the family we try to create a list for
    if (
      !_.isNil(listCreateModel.familyId) &&
      listCreateModel.familyId.trim() !== ''
    ) {
      await this.familyService.hasAccessToFamily(user, listCreateModel.familyId);
      newList.family = await this.familyService.get(listCreateModel.familyId);
    }

    // Set the created by user for the list
    newList.createdBy = user;

    await newList.save();

    return this.getMappedList(newList._id);
  }

  /**
   * Find a list by id, this doesn't include permission checking
   *
   * @param listId
   */
  public async find(listId: string) {
    let list = await this.listModel
      .findOne({ _id: listId })
      .populate('items')
      .populate('family')
      .populate('createdBy')
      .exec();

    if ( _.isNil(list) ) {
      throw new NotFound('List not found.');
    }

    return list;
  }

  /**
   * Get a family (and map it to JSON format)
   *
   * @param {string} listId
   * @param {User} user
   */
  public async get(
    listId: string,
    user: User = null
  ) {
    let list = await this.listModel
      .findOne({ _id: listId })
      .populate('items')
      .exec();

    if ( !_.isNil(user) ) {
      await this.familyService.hasAccessToFamily(user, list.family as string);
    }

    if ( _.isNil(list) ) {
      throw new NotFound('List not found.');
    }

    const newList = list.toJSON();

    if (!_.isNil(list.family)) {
      newList.family = await this.familyService.getMappedFamily(list.family as string);
    }

    newList.createdBy = await this.userService.get(list.createdBy as string);

    return newList;
  }

  /**
   * Get all lists for the current user
   * @param familyId
   * @param user
   */
  public async getListsForFamily(familyId: string, user: User): Promise<List[]> {
    await this.familyService.hasAccessToFamily(user, familyId);

    const lists = await this.listModel
      .find({
        $or: [
          {
            family: familyId
          },
          {
            createdBy: user._id
          }
        ]
      })
      .sort('createdDate')
      .exec();

    console.log(lists);

    return Promise.all(lists.map(async (list) => await this.get(list._id)));
  }

  /**
   * Get all lists for the current user
   * @param user
   */
  public async getAllListsForUser(user: User): Promise<List[]> {
    const families = await this.familyService.getActiveFamiliesForUser(user);
    const familyIds = families.map((family) => family._id);

    const lists = await this.listModel
      .find({
        $or: [
          {
            family: familyIds
          },
          {
            createdBy: user._id
          }
        ]
      })
      .sort('createdDate')
      .exec();

    console.log(lists);

    return Promise.all(lists.map(async (list) => await this.get(list._id)));
  }

  public async update(
    listId: string,
    listUpdateModel: ListUpdateModel,
    user: User
  ): Promise<List> {

    const list = await this.listModel
      .findOne({ _id: listId })
      .exec();

    let family;
    if ( !_.isNil(listUpdateModel.familyId) ) {
      if ( !_.isNil(list.family) ) {
        throw new Forbidden('You are not allowed to move a list to another family.');
      }

      await this.familyService.hasAccessToFamily(user, listUpdateModel.familyId);
      family = await this.familyService.get(listUpdateModel.familyId);
    }

    if ( list.createdBy.toString() !== user._id.toString() ) {
      throw new Forbidden('Cannot update list that is not created by you.');
    }

    list.title = listUpdateModel.title;
    if ( !_.isNil(family) ) {
      list.family = family;
    }

    await list.save();

    return this.get(list._id);
  }

  public async delete(
    listId: string,
    user: User
  ): Promise<boolean> {
    await this.familyService.hasFamily(user, true);

    const family = await this.familyService.getActiveFamilyForUser(user);
    const list = await this.listModel.findOne({ _id: listId })
      .exec();

    if ( _.isNil(list) ) {
      throw new NotFound('Cannot get list.');
    }

    console.log(list.family, family._id);

    if ( list.family.toString() !== family._id.toString() ) {
      throw new Forbidden('Cannot delete list that is not in your active family.');
    }

    if ( list.createdBy.toString() !== user._id.toString() ) {
      throw new Forbidden('Cannot delete list that is not created by you.');
    }

    await list.remove();

    return true;
  }

  private async check() {
    const lists: (List & Document)[] = await this.listModel.find({ color: null });

    return Promise.all(lists.map(async (list: List & Document) => {
      list.color = LIST_COLORS_STRINGS[ Math.floor(Math.random() * LIST_COLORS_STRINGS.length) ];
      await list.save();

      return list;
    }));
  }

  private async getMappedList(_id: any) {
    const list = await this.listModel.findOne({ _id });

    if ( _.isNil(list) ) {
      throw new NotFound('List not found.');
    }

    const jsonList: any = list.toJSON();

    if ( !_.isNil(jsonList.createdBy) ) {
      jsonList.createdBy = this.userService.get((jsonList.createdBy as User)._id);
    }

    if ( !_.isNil(jsonList.family) ) {
      jsonList.family = await this.familyService.getMappedFamily((jsonList.family as Family)._id);
    }

    return jsonList;
  }
}
