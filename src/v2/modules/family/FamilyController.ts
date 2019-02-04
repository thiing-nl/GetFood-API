import { Authenticated, BodyParams, Controller, Delete, Get, PathParams, Post, Put, Req } from '@tsed/common';
import { Docs, Returns, ReturnsArray, Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../auth/AuthMiddleware';
import { Family } from './Family';
import { FamilyListController } from './family-list/FamilyListController';
import { FamilyService } from './FamilyService';
import { FamilyCreateUpdate } from './FamilyCreateUpdate';

@Docs('api-v2')
@Controller('/family', FamilyListController)
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
  @Summary('Receives the families the user is in')
  @ReturnsArray(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async getActiveFamilies(
    @Req() req: UserRequest
  ): Promise<Family[]> {
    return await this.familyService.getActiveMappedFamiliesForUser(req.user);
  }

  @Put('/:familyId')
  @Summary('Update active family')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async update(
    @PathParams('familyId') familyId: string,
    @BodyParams() familyCreateUpdate: FamilyCreateUpdate,
    @Req() req: UserRequest
  ): Promise<Family> {
    return await this.familyService.update(familyId, familyCreateUpdate, req.user);
  }

  @Delete('/:familyId')
  @Summary('Leaves active family')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async leaveActiveFamily(
    @PathParams('familyId') familyId: string,
    @Req() req: UserRequest
  ): Promise<Family> {
    return await this.familyService.leave(familyId, req.user);
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
