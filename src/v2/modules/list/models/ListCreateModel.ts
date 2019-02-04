import { Required } from '@tsed/common';
import { Example } from '@tsed/swagger';

export class ListCreateModel {
  @Required()
  @Example('List Name')
  public title: string;

  @Example('5c422bfda960b40f476bdf2d')
  public familyId: string;
}
