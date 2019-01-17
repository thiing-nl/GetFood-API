import { Authenticated, BodyParams, Controller, Get, Post, Property, Req, Required } from '@tsed/common';
import { Example, Security, Summary } from '@tsed/swagger';
import { UserRequest } from '../AuthMiddleware';
import { User } from './User';
import { UserCreateModel } from './UserCreateModel';
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


@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService
  ) {
  }

  @Post('/')
  @Summary('Registers a new user')
  public async register(
    @BodyParams() user: UserCreateModel
  ) {
    return await this.userService.create(user);
  }

  @Get('/')
  @Summary('Get current user')
  @Authenticated()
  @Security('token')
  public async currentUser(
    @Req() req: UserRequest
  ) {
    return await this.userService.get(req.user._id);
  }

  @Post('/auth')
  @Summary('Authenticates a user')
  public async authenticate(
    @BodyParams() userAuthenticationRequest: UserAuthenticationRequest
  ) {
    return await this.userService.authenticate(userAuthenticationRequest);
  }
}
