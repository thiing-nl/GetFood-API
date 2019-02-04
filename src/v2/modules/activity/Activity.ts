import { Enum, Property } from '@tsed/common';
import { Model, Ref } from '@tsed/mongoose';
import { User } from '../auth/user/User';
import { ACTIVITY_TYPES } from './ActivityTypes';

@Model()
export class Activity {
  @Property()
  public _id: string;

  @Enum(ACTIVITY_TYPES)
  public type: ACTIVITY_TYPES;

  @Property()
  public header: string;

  @Property()
  public message: string;

  @Property()
  public pushMessage: string;

  @Ref(User)
  public createdFor: Ref<User>;
}
