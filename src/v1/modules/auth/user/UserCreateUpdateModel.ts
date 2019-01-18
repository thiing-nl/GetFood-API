import { JsonProperty, Property, Required } from '@tsed/common';
import { Example } from '@tsed/swagger';


export class UserCreateUpdateModel {
  @Property()
  @Required()
  @Example('John')
  public firstName: string;

  @Property()
  @Required()
  @Example('Doe')
  public lastName: string;

  @Property()
  @Required()
  @Example('Test123!')
  public password: string;

  @Property()
  @Required()
  @Example('john.doe@example.com')
  public email: string;
}
