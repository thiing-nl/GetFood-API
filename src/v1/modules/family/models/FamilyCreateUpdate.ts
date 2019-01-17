import { JsonProperty, Required } from '@tsed/common';
import { Example } from '@tsed/swagger';


export class FamilyCreateUpdate {
  @Required()
  @JsonProperty()
  @Example('John Doe Family')
  public name: string;
}
