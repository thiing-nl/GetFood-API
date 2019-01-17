import { Inject, Service } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import * as _ from 'lodash';
import { Document } from 'mongoose';
import { BadRequest, Forbidden, NotFound } from 'ts-httpexceptions';
import { User } from './User';
import { UserCreateModel } from './UserCreateModel';
import { IUser } from './UserInterface';

@Service()
export class UserService {

  public static staticUserModel: MongooseModel<IUser>;

  constructor(
    @Inject(User) private userModel: MongooseModel<IUser>
  ) {
    UserService.staticUserModel = userModel;
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

    if (_.isNil(user)) {
      throw new NotFound('Cannot get user.');
    }

    return user.toJSON() as User;
  }

  /**
   * Create User
   * @param createUser
   */
  public async create(createUser: UserCreateModel) {
    if ( !_.isNil(await this.findByEmail(createUser.email)) ) {
      throw new BadRequest('User with this username already exists.');
    }

    const user = new this.userModel();
    user.firstName = createUser.firstName;
    user.lastName = createUser.lastName;
    user.password = createUser.password;
    user.email = createUser.email;
    user.token = User.generateToken();
    await user.save();

    return user.toJSON();
  }

  public async authenticate({ email, password }) {
    const user = await this.findByEmail(email);

    if ( _.isNull(user) ) {
      throw new Forbidden('Username and/or Password is incorrect.');
    }

    if ( user.verifyPasswordSync(password) ) {
      user.token = User.generateToken();
      await user.save();

      return {
        ...user.toJSON(),
        token: user.token
      };
    } else {
      throw new Forbidden('Username and/or Password is incorrect.');
    }
  }

  public static findByToken(userTokenHeader: string) {
    return UserService.staticUserModel.findOne({ token: userTokenHeader });
  }
}
