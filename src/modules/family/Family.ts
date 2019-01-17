import { IgnoreProperty, Property, Required } from '@tsed/common';
import { Model, Ref } from '@tsed/mongoose';
import { Example } from '@tsed/swagger';
import { User } from '../auth/user/User';

@Model()
export class Family {

  @Property()
  public _id: string;

  @Property()
  @Required()
  @Example('John Doe Family')
  public name: string;

  @Ref(User)
  public users: Ref<User>[];

  @Ref(User)
  public createdBy: Ref<User>;

  public toJSON(): Family {
    return {
      _id: this._id,
      name: this.name,
      users: this.users,
      createdBy: this.createdBy
    } as Family;
  }

}
