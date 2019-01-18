import { Inject, Service } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import * as _ from 'lodash';
import { Document } from 'mongoose';
import { BadRequest, Forbidden, NotFound } from 'ts-httpexceptions';
import { User } from './User';
import { UserCreateUpdateModel } from './UserCreateUpdateModel';
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
  public async create(createUser: UserCreateUpdateModel): Promise<User> {
    if ( !_.isNil(await this.findByEmail(createUser.email)) ) {
      throw new BadRequest('User with this email already exists.');
    }

    const user = new this.userModel();
    user.firstName = createUser.firstName;
    user.lastName = createUser.lastName;
    user.password = createUser.password;
    user.email = createUser.email;
    user.token = User.generateToken();
    await user.save();

    return {
      ...user.toJSON(),
      token: user.token
    } as User;
  }

  public async authenticate({ email, password }) {
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

  public static findByToken(userTokenHeader: string) {
    return UserService.staticUserModel.findOne({ token: userTokenHeader });
  }

  public async update(
    userCreateUpdateModel: UserCreateUpdateModel,
    user: User
  ) {
    const currentUser: IUser & Document = await this.userModel.findOne({ _id: user._id });

    if (_.isNil(currentUser)) {
      throw new NotFound('Cannot get user.');
    }

    currentUser.firstName = userCreateUpdateModel.firstName;
    currentUser.lastName = userCreateUpdateModel.lastName;
    currentUser.password = userCreateUpdateModel.password;
    currentUser.email = userCreateUpdateModel.email;
    await currentUser.save();

    return currentUser.toJSON();
  }

  public async delete(user: User) {
    const currentUser: IUser & Document = await this.userModel.findOne({ _id: user._id });

    if (_.isNil(currentUser)) {
      throw new NotFound('Cannot get user.');
    }

    await currentUser.remove();

    return currentUser.toJSON();
  }
}
