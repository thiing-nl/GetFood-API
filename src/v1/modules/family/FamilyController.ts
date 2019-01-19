import { Authenticated, BodyParams, Controller, Delete, Get, PathParams, Post, Put, Req } from '@tsed/common';
import { Docs, Returns, Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../auth/AuthMiddleware';
import { Family } from './Family';
import { FamilyService } from './FamilyService';
import { FamilyCreateUpdate } from './FamilyCreateUpdate';

@Docs('api-v1')
@Controller('/family')
export class FamilyController {

  constructor(
    private familyService: FamilyService
  ) {
  }

  @Post('/')
  @Summary('Create family')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async create(
    @BodyParams() family: FamilyCreateUpdate,
    @Req() req: UserRequest
  ): Promise<Family> {
    return await this.familyService.create(family, req.user);
  }

  @Get('/')
  @Summary('Receives active family')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async getActiveFamily(
    @Req() req: UserRequest
  ): Promise<Family> {
    return await this.familyService.mapActiveFamilyForUser(req.user);
  }

  @Put('/')
  @Summary('Update active family')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async update(
    @BodyParams() family: FamilyCreateUpdate,
    @Req() req: UserRequest
  ): Promise<Family> {
    return await this.familyService.update(family, req.user);
  }

  @Delete('/')
  @Summary('Leaves active family')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async leaveActiveFamily(
    @Req() req: UserRequest
  ): Promise<Family> {
    return await this.familyService.leave(req.user);
  }

  @Post('/:familyId/join')
  @Summary('Join family')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async joinFamily(
    @PathParams('familyId') familyId: string,
    @Req() req: UserRequest
  ): Promise<Family> {
    return await this.familyService.join(familyId, req.user);
  }

}
