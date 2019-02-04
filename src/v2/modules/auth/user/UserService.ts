import { Inject, Service } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import * as emailValidator from 'email-validator';
import * as _ from 'lodash';
import { Document } from 'mongoose';
import { BadRequest, Forbidden, NotFound } from 'ts-httpexceptions';
import { $log } from 'ts-log-debug';
import { slack } from '../../../../core/Slack';
import { UserCreateModel } from './models/UserCreateModel';
import { UserUpdateModel } from './models/UserUpdateModel';
import { User } from './User';
import { IUser } from './UserInterface';

require('dotenv').config();

@Service()
export class UserService {

  public static staticUserModel: MongooseModel<IUser>;

  constructor(
    @Inject(User) private userModel: MongooseModel<IUser>
  ) {
    UserService.staticUserModel = userModel;
  }

  public static findByToken(userTokenHeader: string) {
    return UserService.staticUserModel.findOne({ token: userTokenHeader });
  }

  /**
   * Find the user by the email aqddress
   * @param email
   */
  async findByEmail(email: string): Promise<undefined | IUser & Document> {
    return this.userModel.findOne({ email });
  }

  /**
   * Get user by id
   * @param {string} userId
   */
  public async get(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId });

    if ( _.isNil(user) ) {
      throw new NotFound('Cannot get user.');
    }

    return user.toJSON() as User;
  }

  /**
   * Create User
   * @param userCreateModel
   * @param mapped
   */
  public async create(
    userCreateModel: UserCreateModel,
    mapped = true
  ): Promise<User> {
    if ( !_.isNil(await this.findByEmail(userCreateModel.email)) ) {
      throw new BadRequest('User with this email already exists.');
    }

    if ( !emailValidator.validate(userCreateModel.email) ) {
      throw new BadRequest('Not a valid email!');
    }

    const user = new this.userModel();
    user.firstName = userCreateModel.firstName;
    user.lastName = userCreateModel.lastName;
    user.password = userCreateModel.password;
    user.email = userCreateModel.email;
    user.token = User.generateToken();
    await user.save();

    if ( slack != null ) {
      slack.alert({
        channel: process.env[ 'CHANNEL' ] || '#getfood-api',
        text: `New user alert! (${process.env[ 'ENV' ] || 'production'})`,
        attachments: [
          {
            fallback: `User: ${user.firstName} ${user.lastName} - ${user.email}`,
            fields: [
              { title: 'Name', value: `${user.firstName} ${user.lastName}`, short: false },
              { title: 'Email', value: user.email, short: false }
            ]
          }
        ]
      }, function (err) {
        if ( err ) {
          console.log('API error:', err);
        } else {
          console.log('Message received!');
        }
      });
    } else {
      $log.info('Slack not enabled.');
    }

    if ( !mapped ) {
      return user;
    }

    return {
      ...user.toJSON(),
      token: user.token
    } as User;
  }

  public async authenticate({ email, password }) {
    if ( !emailValidator.validate(email) ) {
      throw new BadRequest('Not a valid email!');
    }

    const user = await this.findByEmail(email);

    if ( _.isNull(user) ) {
      throw new Forbidden('Email and/or Password is incorrect.');
    }

    if ( user.verifyPasswordSync(password) ) {
      user.token = User.generateToken();
      await user.save();

      return {
        ...user.toJSON(),
        token: user.token
      };
    } else {
      throw new Forbidden('Email and/or Password is incorrect.');
    }
  }

  public async update(
    userId: string,
    userUpdateModel: UserUpdateModel,
    mapped = true
  ) {
    const currentUser: IUser & Document = await this.userModel.findOne({ _id: userId });

    if ( _.isNil(currentUser) ) {
      throw new NotFound('Cannot get user.');
    }

    if ( !emailValidator.validate(userUpdateModel.email) ) {
      throw new BadRequest('Not a valid email!');
    }

    currentUser.firstName = userUpdateModel.firstName;
    currentUser.lastName = userUpdateModel.lastName;
    if (
      !_.isNil(userUpdateModel.password) &&
      userUpdateModel.password.trim() !== ''
    ) {
      currentUser.password = userUpdateModel.password;
    }
    currentUser.email = userUpdateModel.email;
    await currentUser.save();

    if ( !mapped ) {
      return currentUser;
    }

    return currentUser.toJSON();
  }

  public async delete(user: User) {
    const currentUser: IUser & Document = await this.userModel.findOne({ _id: user._id });

    if ( _.isNil(currentUser) ) {
      throw new NotFound('Cannot get user.');
    }

    await currentUser.remove();

    return currentUser.toJSON();
  }
}
