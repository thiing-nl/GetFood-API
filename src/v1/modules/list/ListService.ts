import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import * as _ from 'lodash';
import { Forbidden, NotFound } from 'ts-httpexceptions';
import { User } from '../auth/user/User';
import { UserService } from '../auth/user/UserService';
import { FamilyService } from '../family/FamilyService';
import { List } from './List';
import { ListCreateUpdate } from './models/ListCreateUpdate';


@Service()
export class ListService {

  constructor(
    @Inject(List) private listModel: MongooseModel<List>,
    @Inject(User) private userModel: MongooseModel<User>,
    private familyService: FamilyService,
    private userService: UserService
  ) {
  }

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

  public async get(
    listId: string,
    user: User = null
  ) {
    let family;
    if ( !_.isNil(user) ) {
      await this.familyService.hasFamily(user, true);

      family = await this.familyService.getActiveFamilyForUser(user);
    }

    let list = await this.listModel
      .findOne({ _id: listId })
      .populate('items')
      .exec();

    if ( _.isNil(list) ) {
      throw new NotFound('List not found.');
    }

    if ( !_.isNil(family) ) {
      if ( list.family.toString() !== family._id.toString() ) {
        throw new Forbidden('Cannot get list that is not in your active family.');
      }
    }

    const newList = list.toJSON();

    newList.family = await this.familyService.get(list.family as string);
    newList.createdBy = await this.userService.get(list.createdBy as string);

    return newList;
  }

  public async create(
    listCreateUpdate: ListCreateUpdate,
    user: User
  ): Promise<List> {
    await this.familyService.hasFamily(user, true);
    const family = await this.familyService.getActiveFamilyForUser(user);

    const newList = new this.listModel();
    newList.title = listCreateUpdate.title;
    newList.color = listCreateUpdate.color;
    newList.family = family;
    newList.createdBy = user;

    await newList.save();

    const jsonList = newList.toJSON();
    jsonList.createdBy = user.toJSON() as User;
    jsonList.family = await this.familyService.get(newList.family._id);

    return jsonList;
  }

  public async getAllListsForUser(user: User): Promise<List[]> {
    await this.familyService.hasFamily(user, true);

    const family = await this.familyService.getActiveFamilyForUser(user);

    const lists = await this.listModel
      .find({ family: family._id });

    return Promise.all(lists.map(async (list) => await this.get(list._id)));
  }

  public async delete(
    listId: string,
    user: User
  ): Promise<List> {
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

    return list;
  }

  public async update(
    listId: string,
    listCreateUpdate: ListCreateUpdate,
    user: User
  ): Promise<List> {
    await this.familyService.hasFamily(user, true);
    const family = await this.familyService.getActiveFamilyForUser(user);

    const list = await this.listModel
      .findOne({ _id: listId })
      .exec();

    if ( list.family.toString() !== family._id.toString() ) {
      throw new Forbidden('Cannot update list that is not in your active family.');
    }

    if ( list.createdBy.toString() !== user._id.toString() ) {
      throw new Forbidden('Cannot update list that is not created by you.');
    }

    list.title = listCreateUpdate.title;
    list.color = listCreateUpdate.color;

    await list.save();

    return this.get(list._id);
  }
}
