import { Middleware, PathParams, Required } from '@tsed/common';
import { NotFound } from 'ts-httpexceptions';
import { ListService } from './ListService';


@Middleware()
export class CheckListIdMiddleware {
  constructor(private listService: ListService) {
  }

  async use(
    @Required() @PathParams('listId') listId: string
  ) {
    try {
      await this.listService.get(listId);
    } catch (er) {
      throw new NotFound('List not found.');
    }
  }
}
