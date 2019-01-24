import { Authenticated, BodyParams, Controller, Delete, Get, Post, Property, Put, Req, Required } from '@tsed/common';
import { Docs, Example, Returns, Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../AuthMiddleware';
import { UserUpdateModel } from './models/UserUpdateModel';
import { User } from './User';
import { UserCreateModel } from './models/UserCreateModel';
import { UserService } from './UserService';

class UserAuthenticationRequest {
  @Property()
  @Required()
  @Example('john.doe@example.com')
  email: string;

  @Property()
  @Required()
  @Example('Test123!')
  password: string;
}

@Docs('api-v2')
@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService
  ) {
  }

  @Post('/')
  @Returns(200, { type: User })
  @Summary('Registers a new user')
  public async register(
    @BodyParams() user: UserCreateModel
  ): Promise<User> {
    return await this.userService.create(user);
  }

  @Post('/auth')
  @Returns(200, { type: User })
  @Summary('Authenticates a user')
  public async authenticate(
    @BodyParams() userAuthenticationRequest: UserAuthenticationRequest
  ) {
    return await this.userService.authenticate(userAuthenticationRequest);
  }

  @Get('/')
  @Returns(200, { type: User })
  @Summary('Get current user')
  @Authenticated()
  @Security('token')
  public async currentUser(
    @Req() req: UserRequest
  ) {
    return await this.userService.get(req.user._id);
  }

  @Put('/')
  @Returns(200, { type: User })
  @Summary('Update current user')
  @Authenticated()
  @Security('token')
  public async update(
    @BodyParams() userUpdateModel: UserUpdateModel,
    @Req() req: UserRequest
  ) {
    return await this.userService.update(userUpdateModel, req.user);
  }

  @Delete('/')
  @Returns(200, { type: User })
  @Summary('Delete current user')
  @Authenticated()
  @Security('token')
  public async delete(
    @Req() req: UserRequest
  ) {
    return await this.userService.delete(req.user);
  }

}
