import { IgnoreProperty, Property, Required } from '@tsed/common';
import { Model, PreHook, Ref } from '@tsed/mongoose';
import { Example } from '@tsed/swagger';
import * as _ from 'lodash';
import { User } from '../auth/user/User';
import * as QRCode from 'qrcode';

@Model()
export class Family {

  @Property()
  public _id: string;

  @Property()
  @Required()
  @Example('John Doe Family')
  public name: string;

  @Property()
  public qrCode: string;

  @Ref(User)
  public users: Ref<User>[];

  @Ref(User)
  public createdBy: Ref<User>;

  /**
   * Pre Save for Family
   * @param {Family} family
   * @param next
   */
  @PreHook('save')
  static async preSave(
    family: Family,
    next
  ): Promise<void> {
    if (_.isNil(family.qrCode)) {
      family.qrCode = await Family.generateQRCode(family._id);
    }

    next();
  }

  /**
   * Convert the current object to JSON
   */
  public toJSON(): Family {
    return {
      _id: this._id,
      name: this.name,
      qrCode: this.qrCode,
      users: this.users,
      createdBy: this.createdBy
    } as Family;
  }

  /**
   * Generate QR Code
   * @param _id
   * @returns {string}
   */
  public static async generateQRCode(_id: string): Promise<string> {
    return await QRCode.toDataURL(`getfood:family:${_id}`);
  }

}
