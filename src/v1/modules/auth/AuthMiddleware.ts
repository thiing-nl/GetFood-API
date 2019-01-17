import { AuthenticatedMiddleware, OverrideMiddleware } from '@tsed/common';
import * as core from 'express-serve-static-core';
import * as _ from 'lodash';
import { Document } from 'mongoose';
import { Unauthorized } from 'ts-httpexceptions';
import { $log } from 'ts-log-debug';
import { IUser } from './user/UserInterface';
import { UserService } from './user/UserService';

export interface UserRequest extends core.Request {
  user: IUser & Document;
}

@OverrideMiddleware(AuthenticatedMiddleware)
export class AuthMiddleware extends AuthenticatedMiddleware {
  public static async parseUserTokenHeader(
    req: UserRequest
  ) {
    $log.info('parse user token header');
    const userTokenHeader = req.headers[ 'x-user-token' ] as string;

    // If the userTokenHeader isn't provided we can't parse it.
    if ( userTokenHeader === undefined ) {
      throw new Unauthorized('User not authorized.');
    }

    // Getting the user from database
    let user = await UserService.findByToken(userTokenHeader);

    // Checking if there's a user with the specified token and validating if they are the same.
    if ( !_.isNil(user) && user.token === userTokenHeader ) {
      req.user = user;
    } else {
      throw new Unauthorized('Unauthorized');
    }

    return req;
  }

  public async use(
    endpoint,
    request,
    next
  ) {
    await AuthMiddleware.parseUserTokenHeader(
      request
    );

    return next();
  }
}
