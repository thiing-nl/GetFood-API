import { Authenticated, BodyParams, Controller, Delete, Get, PathParams, Post, Put, Req } from '@tsed/common';
import { Docs, Returns, ReturnsArray, Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../auth/AuthMiddleware';
import { List, ListModel } from './List';
import { ListItemController } from './list-item/ListItemController';
import { ListService } from './ListService';
import { LIST_COLORS, ListColor } from './models/ListColors';
import { ListCreateUpdate } from './models/ListCreateUpdate';

@Docs('api-v1')
@Controller('/list', ListItemController)
export class ListController {

  constructor(
    private listService: ListService
  ) {
  }

  @Post('/')
  @Summary('Create a new list')
  @Returns(200, { type: ListModel })
  @Authenticated()
  @Security('token')
  public async create(
    @BodyParams() list: ListCreateUpdate,
    @Req() req: UserRequest
  ): Promise<List> {
    return await this.listService.create(list, req.user);
  }

  @Get('/')
  @Summary('Receives the lists the current user has access to')
  @ReturnsArray(200, { type: ListModel })
  @Authenticated()
  @Security('token')
  public async getLists(
    @Req() req: UserRequest
  ): Promise<List[]> {
    return await this.listService.getAllListsForUser(req.user);
  }

  @Get('/colors')
  @Summary('Receives the available colors for the list')
  @ReturnsArray(200, { type: ListModel })
  @Authenticated()
  @Security('token')
  public async getColors(
    @Req() req: UserRequest
  ): Promise<ListColor[]> {
    return LIST_COLORS;
  }

  @Get('/:listId')
  @Summary('Get a list')
  @Returns(200, { type: ListModel })
  @Authenticated()
  @Security('token')
  public async get(
    @PathParams('listId') listId: string,
    @Req() req: UserRequest
  ): Promise<List> {
    return await this.listService.get(listId, req.user);
  }

  @Put('/:listId')
  @Summary('Update a list')
  @Returns(200, { type: ListModel })
  @Authenticated()
  @Security('token')
  public async update(
    @PathParams('listId') listId: string,
    @BodyParams() list: ListCreateUpdate,
    @Req() req: UserRequest
  ): Promise<List> {
    return await this.listService.update(listId, list, req.user);
  }

  @Delete('/:listId')
  @Summary('Deletes a list')
  @Returns(200, { type: Boolean })
  @Authenticated()
  @Security('token')
  public async delete(
    @PathParams('listId') listId: string,
    @Req() req: UserRequest
  ): Promise<boolean> {
    return await this.listService.delete(listId, req.user);
  }

}
