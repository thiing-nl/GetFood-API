import { Property } from '@tsed/common';
import { Model, PreHook, Ref } from '@tsed/mongoose';
import * as _ from 'lodash';
import { User } from '../auth/user/User';
import { Family } from '../family/Family';
import { ListItem } from './list-item/ListItem';


@Model()
export class List {

  @Property()
  public _id: string;

  @Property()
  public title: string;

  @Property()
  public createdDate: Date;

  @Ref(User)
  public createdBy: Ref<User>;

  @Ref(ListItem)
  public items: Ref<ListItem>[];

  @Ref(Family)
  public family: Ref<Family>;

  @PreHook('save')
  static preSave(
    list: List,
    next
  ) {
    if ( _.isNil(list.createdDate) ) {
      list.createdDate = new Date();
    }

    next();
  }

  public toJSON(): List {
    return {
      _id: this._id,
      title: this.title,
      createdDate: this.createdDate,
      createdBy: this.createdBy,
      items: this.items,
      family: this.family
    } as List;
  }
}
