import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import * as _ from 'lodash';
import { NotFound, Forbidden } from 'ts-httpexceptions';
import { User } from '../auth/user/User';
import { Family } from './Family';
import { FamilyCreateUpdate } from './FamilyCreateUpdate';

const QRCode = require('qrcode');

@Service()
export class FamilyService {

  /**
   * @param {MongooseModel<User>} userModel
   * @param {MongooseModel<Family>} familyModel
   */
  constructor(
    @Inject(User) private userModel: MongooseModel<User>,
    @Inject(Family) private familyModel: MongooseModel<Family>
  ) {
  }

  /**
   * Has family
   * @param {User} user
   * @param {boolean} throwError
   */
  public async hasFamily(
    user: User,
    throwError: boolean = false
  ) {
    const family = await this.familyModel
      .findOne({
        users: user._id
      });

    if ( throwError && _.isNil(family) ) {
      throw new NotFound('No active family.');
    }

    return !_.isNil(family);
  }

  /**
   * Map Active Family
   * @param {User} user
   * @returns {Promise<Family>}
   */
  public async mapActiveFamilyForUser(
    user: User
  ): Promise<Family> {
    const family = await this.getActiveFamilyForUser(user);

    return this.mapFamily(family);
  }

  /**
   * Get active family
   * @param {User} user
   * @returns {Promise<Family>}
   */
  public async getActiveFamilyForUser(
    user: User
  ) {
    await this.hasFamily(user, true);

    return this.familyModel
      .findOne({
        users: user._id
      })
      .populate('users')
      .populate('createdBy')
      .exec();
  }

  /**
   * Create Family
   * @param {FamilyCreateUpdate} family
   * @param {User} user
   */
  public async create(
    family: FamilyCreateUpdate,
    user: User
  ) {
    if ( await this.hasFamily(user) ) {
      throw new NotFound('Already in family.');
    }

    const newFamily = new this.familyModel();
    newFamily.name = family.name;
    newFamily.createdBy = user;
    newFamily.users.push(user);
    await newFamily.save();

    return this.get(newFamily._id);
  }

  /**
   * Make user join a family
   * @param {string} familyId
   * @param {User} user
   */
  public async join(
    familyId: string,
    user: User
  ) {
    if ( await this.hasFamily(user) ) {
      throw new NotFound('Already in family.');
    }

    let family = await this.familyModel
      .findOne({
        _id: familyId
      })
      .populate('users')
      .populate('createdBy');

    if ( _.isNil(family) ) {
      throw new NotFound('Family not found.');
    }

    family.users.push(user);
    await family.save();

    return this.get(family._id);
  }

  /**
   * Get a family by id
   * @param familyId
   */
  public async get(familyId: string) {
    let family = await this.familyModel
      .findOne({
        _id: familyId
      })
      .populate('users')
      .populate('createdBy')
      .exec();

    if ( _.isNil(family) ) {
      throw new NotFound('Family not found.');
    }

    return this.mapFamily(family);
  }

  /**
   * Leave active family
   * @param {User} user
   */
  public async leave(user: User) {
    if ( !await this.hasFamily(user) ) {
      throw new NotFound('No active family.');
    }

    const family = await this.familyModel
      .findOne({
        users: user._id
      })
      .populate('users');

    if ( _.isNil(family) ) {
      throw new NotFound('Family not found.');
    }

    const foundUser = _.find(family.users, { _id: user._id });
    family.users.splice(family.users.indexOf(foundUser), 1);

    await family.save();

    return this.get(family._id);
  }

  public async update(
    family: FamilyCreateUpdate,
    user: User
  ) {
    await this.hasFamily(user, true);

    const activeFamily = await this.getActiveFamilyForUser(user);

    console.log(activeFamily);

    if ( (activeFamily.createdBy as User)._id.toString() !== user._id.toString() ) {
      throw new Forbidden('Cannot update family that is not created by you.');
    }

    activeFamily.name = family.name;

    await activeFamily.save();

    return this.get(activeFamily._id);
  }

  /**
   * Maps the family
   * @param {Family} family
   */
  private mapFamily(family: Family) {
    const users = family.users.map((user: User) => {
      if ( !_.isNil(user[ 'toJSON' ]) ) {
        return user.toJSON();
      }

      return user;
    });

    let createdBy;
    if ( !_.isNil(family.createdBy) && !_.isNil(family.createdBy[ 'toJSON' ]) ) {
       createdBy = (family.createdBy as User).toJSON();
    }

    family = (family as any).toJSON();
    family.users = users as User[];
    family.createdBy = createdBy as User;

    return family;
  }
}
