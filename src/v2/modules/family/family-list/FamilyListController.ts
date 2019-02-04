import { Controller, Get, PathParams, Req } from '@tsed/common';
import { UserRequest } from '../../auth/AuthMiddleware';
import { ListService } from '../../list/ListService';

@Controller('/')
export class FamilyListController {

  constructor(
    private listService: ListService
  ) {
  }

  @Get('/:familyId')
  public getListForFamily(
    @PathParams('familyId') familyId: string,
    @Req() req: UserRequest
  ) {
    return this.listService.getListsForFamily(familyId, req.user);
  }
}
