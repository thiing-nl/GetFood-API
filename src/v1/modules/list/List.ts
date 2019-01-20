import { Enum, Property, Required } from '@tsed/common';
import { Model, PreHook, Ref } from '@tsed/mongoose';
import * as _ from 'lodash';
import { User } from '../auth/user/User';
import { Family } from '../family/Family';
import { ListItem } from './list-item/ListItem';
import { LIST_COLORS_STRINGS } from './models/ListColors';

@Model()
export class List {

  @Property()
  public _id: string;

  @Property()
  @Required()
  public title: string;

  @Property()
  @Required()
  @Enum(LIST_COLORS_STRINGS)
  public color: string;

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
    if ( _.isNil(list.color) ) {
      list.color = LIST_COLORS_STRINGS[ Math.floor(Math.random() * LIST_COLORS_STRINGS.length) ];
    }

    next();
  }

  public toJSON(): List {
    return {
      _id: this._id,
      title: this.title,
      color: this.color,
      createdDate: this.createdDate,
      createdBy: this.createdBy,
      items: this.items,
      family: this.family
    } as List;
  }
}

export class ListModel extends List {
  constructor() {
    super();
  }
}
