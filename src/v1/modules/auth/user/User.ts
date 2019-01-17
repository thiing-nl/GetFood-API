import { IgnoreProperty, Property, Required } from '@tsed/common';
import { Model, MongoosePlugin, PreHook, Ref } from '@tsed/mongoose';
import { Example } from '@tsed/swagger';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { Family } from '../../family/Family';
import * as uniqueValidator from 'mongoose-unique-validator';
import * as passwordPlugin from 'mongoose-bcrypt';

@Model()
@MongoosePlugin(uniqueValidator, undefined)
@MongoosePlugin(passwordPlugin, undefined)
export class User {
  @Property()
  public _id: string;

  @Property()
  @Example('JD')
  public initials: string;

  @Property()
  @Required()
  @Example('John')
  public firstName: string;

  @Property()
  @Required()
  @Example('Doe')
  public lastName: string;

  @Property()
  @Required()
  @Example('Test123!')
  public password: string;

  @Property()
  @Required()
  @Example('john.doe@example.com')
  public email: string;

  @Property()
  public token: string;

  /**
   * Pre Save for User
   * @param {User} user
   * @param next
   */
  @PreHook('save')
  static preSave(
    user: User,
    next
  ): void {
    if ( _.isNil(user.token) || user.token.trim() === '' ) {
      user.token = User.generateToken();
    }

    user.initials = User.generateInitials(user.firstName, user.lastName);

    next();
  }

  /**
   * Generate a new Token
   * @returns {string}
   */
  static generateToken(): string {
    return uuid.v4();
  }

  /**
   * @returns {any}
   */
  public toJSON() {
    return {
      _id: this._id,
      initials: this.initials,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
  }

  /**
   * Generate Initials based on first name and last name
   * @param {string} firstName
   * @param {string} lastName
   * @returns {string}
   */
  private static generateInitials(
    firstName: string,
    lastName: string
  ): string {
    const splitFirstName = firstName.split(' ')
      .map((firstNameItem) => firstNameItem.toUpperCase()[0]);
    const splitLastName = lastName.split(' ')
      .map((lastNameItem) => lastNameItem.toUpperCase()[0]);

    return [
      ...splitFirstName,
      ...splitLastName
    ].join('');
  }
}
