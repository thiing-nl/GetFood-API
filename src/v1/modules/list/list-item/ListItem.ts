import { IgnoreProperty, JsonProperty, Property, Required } from '@tsed/common';
import { Model, PreHook } from '@tsed/mongoose';
import { Example } from '@tsed/swagger';
import * as _ from 'lodash';

export class ListItemCreateUpdate {
  @JsonProperty()
  @Required()
  @Example('Burrito')
  public name: string;

  @JsonProperty()
  @Required()
  @Example(false)
  public checked: boolean;
}


@Model()
export class ListItem {
  @Property()
  public _id: string;

  @Property()
  @Required()
  @Example('Burrito')
  public name: string;

  @Property()
  public parentId: string;

  @Property()
  public checked: boolean;

  @Property()
  public checkedAt: Date;

  @PreHook('save')
  static preSave(
    list: ListItem,
    next
  ) {
    if ( _.isNil(list.checked) ) {
      list.checked = false;
      list.checkedAt = null;
    }

    next();
  }
}
