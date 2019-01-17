import {
  Authenticated, BodyParams,
  Controller,
  Delete,
  Get,
  MergeParams,
  PathParams,
  Post,
  Put,
  Req,
  UseBefore
} from '@tsed/common';
import { Docs, Returns, Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../../auth/AuthMiddleware';
import { CheckListIdMiddleware } from '../CheckListIdMiddleware';
import { ListItem, ListItemCreateUpdate } from './ListItem';
import { ListItemService } from './ListItemService';

@Docs('api-v1')
@Controller('/:listId/items')
@MergeParams(true)
export class ListItemController {

  constructor(
    private listItemService: ListItemService
  ) {
  }

  @Post('/')
  @Summary('Create Item in List')
  @Returns(200, { type: ListItem })
  @UseBefore(CheckListIdMiddleware)
  @Authenticated()
  @Security('token')
  public async create(
    @PathParams('listId') listId: string,
    @BodyParams() listItem: ListItemCreateUpdate,
    @Req() req: UserRequest
  ): Promise<ListItem> {
    return this.listItemService.create(listId, listItem, req.user);
  }

  @Put('/:listItemId')
  @Summary('Update Item in List')
  @Returns(200, { type: ListItem })
  @UseBefore(CheckListIdMiddleware)
  @Authenticated()
  @Security('token')
  public async update(
    @PathParams('listId') listId: string,
    @PathParams('listItemId') listItemId: string,
    @BodyParams() listItem: ListItemCreateUpdate,
    @Req() req: UserRequest
  ): Promise<ListItem> {
    return this.listItemService.update(listId, listItemId, listItem, req.user);
  }

  @Delete('/:listItemId')
  @Summary('Delete Item in List')
  @Returns(200, { type: ListItem })
  @UseBefore(CheckListIdMiddleware)
  @Authenticated()
  @Security('token')
  public async delete(
    @PathParams('listId') listId: string,
    @PathParams('listItemId') listItemId: string,
    @Req() req: UserRequest
  ): Promise<ListItem> {
    return this.listItemService.delete(listId, listItemId, req.user);
  }

}
