import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import * as _ from 'lodash';
import { Document } from 'mongoose';
import { Forbidden, NotFound } from 'ts-httpexceptions';
import { User } from '../auth/user/User';
import { Family } from './Family';
import { FamilyCreateUpdate } from './FamilyCreateUpdate';

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
   *
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
   * Has user access to family
   *
   * @param {User} user
   * @param {string} familyId
   */
  public async hasAccessToFamily(
    user: User,
    familyId: string
  ) {
    const family = await this.familyModel
      .findOne({
        _id: familyId
      });

    if ( _.isNil(family) ) {
      throw new NotFound('Family not found.');
    }

    if ( family.users.indexOf(user._id) === -1 ) {
      throw new Forbidden('User not in family.');
    }

    return !_.isNil(family) && family.users.indexOf(user._id) > -1;
  }

  /**
   * Get active family
   *
   * @deprecated use getActiveFamiliesForUser
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
   * Get active families
   *
   * @param {User} user
   * @returns {Promise<Family[]>}
   */
  public async getActiveFamiliesForUser(
    user: User
  ) {
    return this.familyModel
      .find({
        users: user._id
      })
      .populate('users')
      .populate('createdBy')
      .exec();
  }

  /**
   * Get active families (mapped)
   *
   * @param {User} user
   * @returns {Promise<Family[]>}
   */
  public async getActiveMappedFamiliesForUser(
    user: User
  ) {
    const families = await this.familyModel
      .find({
        users: user._id
      });

    return Promise.all(
      families.map(async ({ _id }) => this.get(_id))
    );
  }

  /**
   * Create Family
   *
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

    return this.getMappedFamily(newFamily._id);
  }

  /**
   * Make user join a family
   *
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

    return this.getMappedFamily(family._id);
  }

  /**
   * Get a family by id
   *
   * @param familyId
   */
  public async get(familyId: string): Promise<Family & Document> {
    let family = await this.familyModel
      .findOne({
        _id: familyId
      })
      .populate('users')
      .populate('createdBy')
      .exec();

    // TODO: Check access to family

    if ( _.isNil(family) ) {
      throw new NotFound('Family not found.');
    }

    return family;
  }

  /**
   * Get a mapped family by id
   *
   * @param familyId
   */
  public async getMappedFamily(familyId: string) {
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
   *
   * @param {string} familyId
   * @param {User} user
   */
  public async leave(
    familyId: string,
    user: User
  ) {
    await this.hasAccessToFamily(user, familyId);

    const family = await this.familyModel
      .findOne({
        _id: familyId
      })
      .populate('users');

    if ( _.isNil(family) ) {
      throw new NotFound('Family not found.');
    }

    const foundUser = _.find(family.users, { _id: user._id });
    family.users.splice(family.users.indexOf(foundUser), 1);
    await family.save();

    return this.getMappedFamily(family._id);
  }

  /**
   * Update the family
   *
   * @param familyId
   * @param familyCreateUpdate
   * @param user
   */
  public async update(
    familyId: string,
    familyCreateUpdate: FamilyCreateUpdate,
    user: User
  ) {
    await this.hasAccessToFamily(user, familyId);

    const family = await this.get(familyId);

    if ( (family.createdBy as User)._id.toString() !== user._id.toString() ) {
      throw new Forbidden('Cannot update family that is not created by you.');
    }

    family.name = familyCreateUpdate.name;
    await family.save();

    return this.getMappedFamily(family._id);
  }

  /**
   * Maps the family
   *
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
