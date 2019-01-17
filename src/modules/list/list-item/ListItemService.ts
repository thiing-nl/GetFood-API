import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import * as _ from 'lodash';
import { Forbidden } from 'ts-httpexceptions';
import { User } from '../../auth/user/User';
import { Family } from '../../family/Family';
import { FamilyService } from '../../family/FamilyService';
import { List } from '../List';
import { ListService } from '../ListService';
import { ListItem, ListItemCreateUpdate } from './ListItem';


@Service()
export class ListItemService {

  constructor(
    @Inject(List) private listModel: MongooseModel<List>,
    @Inject(ListItem) private listItemModel: MongooseModel<ListItem>,
    private listService: ListService,
    private familyService: FamilyService
  ) {
  }

  public async getItems(
    listId: any,
    user: User
  ): Promise<ListItem[]> {
    await this.familyService.hasFamily(user, true);
    const family = await this.familyService.getActiveFamilyForUser(user);

    const list = await this.listService.find(listId);

    if ( family._id.toString() !== (list.family as Family)._id.toString() ) {
      throw new Forbidden('Cannot get items for list that is not in your active family.');
    }

    return list.items as ListItem[] || [];
  }

  public async create(
    listId: string,
    listItemCreateUpdate: ListItemCreateUpdate,
    user: User
  ): Promise<ListItem> {
    await this.familyService.hasFamily(user, true);
    const family = await this.familyService.getActiveFamilyForUser(user);

    const list = await this.listService.find(listId);

    if ( family._id.toString() !== (list.family as Family)._id.toString() ) {
      throw new Forbidden('Cannot create items for list that is not in your active family.');
    }

    const newListItem = new this.listItemModel();
    newListItem.name = listItemCreateUpdate.name;
    newListItem.checked = listItemCreateUpdate.checked;

    if ( newListItem.checked ) {
      newListItem.checkedAt = new Date();
    } else {
      newListItem.checkedAt = null;
    }

    newListItem.parentId = list._id;
    await newListItem.save();

    list.items.push(newListItem);
    await list.save();

    return newListItem;
  }

  public async update(
    listId: string,
    listItemId: string,
    listItemCreateUpdate: ListItemCreateUpdate,
    user: User
  ) {
    await this.familyService.hasFamily(user, true);
    const family = await this.familyService.getActiveFamilyForUser(user);

    const list = await this.listService.find(listId);

    if ( family._id.toString() !== (list.family as Family)._id.toString() ) {
      throw new Forbidden('Cannot update items for list that is not in your active family.');
    }

    const listItem = await this.listItemModel.findOne({ _id: listItemId });

    if ( listItem.parentId !== list._id.toString() ) {
      throw new Forbidden('You are trying to edit a item that is not in this list.');
    }

    listItem.name = listItemCreateUpdate.name;
    listItem.checked = listItemCreateUpdate.checked;

    if ( listItem.checked ) {
      listItem.checkedAt = new Date();
    } else {
      listItem.checkedAt = null;
    }

    await listItem.save();

    return listItem;
  }

  public async delete(
    listId: string,
    listItemId: string,
    user: User
  ) {
    await this.familyService.hasFamily(user, true);
    const family = await this.familyService.getActiveFamilyForUser(user);

    const list = await this.listService.find(listId);

    if ( family._id.toString() !== (list.family as Family)._id.toString() ) {
      throw new Forbidden('Cannot delete items for list that is not in your active family.');
    }

    const listItem = await this.listItemModel.findOne({ _id: listItemId });

    if ( listItem.parentId !== list._id.toString() ) {
      throw new Forbidden('You are trying to delete a item that is not in this list.');
    }

    await listItem.remove();
    const item: ListItem = _.find(list.items, { _id: listItem._id }) as ListItem | null;
    const index = list.items.indexOf(item);
    list.items.splice(index, 1);
    await list.save();

    return listItem;
  }
}

