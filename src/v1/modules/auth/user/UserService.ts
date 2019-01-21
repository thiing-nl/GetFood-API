import { Inject, Service } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import * as emailValidator from 'email-validator';
import * as _ from 'lodash';
import { Document } from 'mongoose';
import { BadRequest, Forbidden, NotFound } from 'ts-httpexceptions';
import { UserCreateModel } from './models/UserCreateModel';
import { UserUpdateModel } from './models/UserUpdateModel';
import { User } from './User';
import { IUser } from './UserInterface';
import { $log } from 'ts-log-debug';
require('dotenv').config();

let slack = null;
if ( !_.isNil(process.env[ 'SLACK_WEBHOOK_URL' ]) && _.isString(process.env[ 'SLACK_WEBHOOK_URL' ]) ) {
  slack = require('slack-notify')(process.env[ 'SLACK_WEBHOOK_URL' ]);
  $log.info('Enabled slack notifications!');
} else {
  $log.info('Disabled slack notifications!');
}

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
   * Find a user by his ID.
   * @param _id
   * @returns {undefined|User}
   */
  async find(_id: string): Promise<undefined | IUser & Document> {
    return this.userModel.findOne({ _id });
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
   * @param userCreateUpdateModel
   */
  public async create(userCreateUpdateModel: UserCreateModel): Promise<User> {
    if ( !_.isNil(await this.findByEmail(userCreateUpdateModel.email)) ) {
      throw new BadRequest('User with this email already exists.');
    }

    if ( !emailValidator.validate(userCreateUpdateModel.email) ) {
      throw new BadRequest('Not a valid email!');
    }

    const user = new this.userModel();
    user.firstName = userCreateUpdateModel.firstName;
    user.lastName = userCreateUpdateModel.lastName;
    user.password = userCreateUpdateModel.password;
    user.email = userCreateUpdateModel.email;
    user.token = User.generateToken();
    await user.save();

    if ( slack != null ) {
      slack.alert({
        channel: '#getfood-api',
        text: `New user alert! (${ process.env[ 'ENV' ] || 'production'})`,
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
        if (err) {
          console.log('API error:', err);
        } else {
          console.log('Message received!');
        }
      });
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
    userCreateUpdateModel: UserUpdateModel,
    user: User
  ) {
    const currentUser: IUser & Document = await this.userModel.findOne({ _id: user._id });

    if ( _.isNil(currentUser) ) {
      throw new NotFound('Cannot get user.');
    }

    if ( !emailValidator.validate(userCreateUpdateModel.email) ) {
      throw new BadRequest('Not a valid email!');
    }

    currentUser.firstName = userCreateUpdateModel.firstName;
    currentUser.lastName = userCreateUpdateModel.lastName;
    if (
      !_.isNil(userCreateUpdateModel.password) &&
      userCreateUpdateModel.password.trim() !== ''
    ) {
      currentUser.password = userCreateUpdateModel.password;
    }
    currentUser.email = userCreateUpdateModel.email;
    await currentUser.save();

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
