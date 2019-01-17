import { Authenticated, BodyParams, Controller, Delete, Get, PathParams, Post, Put, Req } from '@tsed/common';
import { Docs, Returns, Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../auth/AuthMiddleware';
import { List } from '../list/List';
import { Family } from './Family';
import { FamilyService } from './FamilyService';
import { FamilyCreateUpdate } from './models/FamilyCreateUpdate';

@Docs('api-v1')
@Controller('/family')
export class FamilyController {

  constructor(
    private familyService: FamilyService
  ) {}

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

  @Get('/qrcode')
  @Summary('Get QR Code for active family')
  @Returns(200, { type: String })
  @Authenticated()
  @Security('token')
  public async getQrcode(
    @Req() req: UserRequest
  ): Promise<string> {
    return await this.familyService.generateQrcode(req.user);
  }

  @Get('/:familyId')
  @Summary('Get family')
  @Returns(200, { type: Family })
  @Authenticated()
  @Security('token')
  public async getFamily(
    @PathParams('familyId') familyId: string
  ): Promise<Family> {
    return await this.familyService.get(familyId);
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

}
