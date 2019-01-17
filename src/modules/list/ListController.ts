import { Authenticated, BodyParams, Controller, Delete, Get, PathParams, Post, Put, Req } from '@tsed/common';
import { Returns, Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../auth/AuthMiddleware';
import { Family } from '../family/Family';
import { FamilyCreateUpdate } from '../family/models/FamilyCreateUpdate';
import { List } from './List';
import { ListItemController } from './list-item/ListItemController';
import { ListService } from './ListService';
import { ListCreateUpdate } from './models/ListCreateUpdate';

@Controller('/list', ListItemController)
export class ListController {

  constructor(
    private listService: ListService
  ) {
  }

  @Post('/')
  @Summary('Create a new list')
  @Returns(200, { type: List })
  @Authenticated()
  @Security('token')
  public async create(
    @BodyParams() list: ListCreateUpdate,
    @Req() req: UserRequest
  ): Promise<List> {
    return await this.listService.create(list, req.user);
  }

  @Get('/:listId')
  @Summary('Get a list')
  @Returns(200, { type: List })
  @Authenticated()
  @Security('token')
  public async get(
    @PathParams('listId') listId: string,
    @Req() req: UserRequest
  ): Promise<List> {
    return await this.listService.get(listId, req.user);
  }

  @Get('/')
  @Summary('Receives the lists the current user has access to')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async getLists(
    @Req() req: UserRequest
  ): Promise<List[]> {
    return await this.listService.getAllListsForUser(req.user);
  }

  @Put('/:listId')
  @Summary('Update a list')
  @Returns(200, { type: List })
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
  @Returns(200, { type: List })
  @Authenticated()
  @Security('token')
  public async delete(
    @PathParams('listId') listId: string,
    @Req() req: UserRequest
  ): Promise<List> {
    return await this.listService.delete(listId, req.user);
  }

}
