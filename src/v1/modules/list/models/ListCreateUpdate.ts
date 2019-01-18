import { Required } from '@tsed/common';
import { Example } from '@tsed/swagger';

export class ListCreateUpdate {
  @Required()
  @Example('Family List')
  public title: string;

  @Required()
  @Example('#1abc9c')
  public color: string;
}
