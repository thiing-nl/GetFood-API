import { bootstrap, inject, TestContext } from '@tsed/testing';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { NotFound } from 'ts-httpexceptions';
import { Server } from '../../../../src/Server';
import { User } from '../../../../src/v2/modules/auth/user/User';
import { IUser } from '../../../../src/v2/modules/auth/user/UserInterface';
import { UserService } from '../../../../src/v2/modules/auth/user/UserService';
import { assert } from '../../../tools';
import { UserUtil } from './UserUtil';

describe('UserService', () => {
  const createdUsers: (User | mongoose.Document)[] = [];

  before(async () => bootstrap(Server)());
  after(async () => {
    await Promise.all(
      createdUsers.map(async (user: any) => {
        user.remove()
          .then(() => console.log(`${user._id} is removed`));
      })
    );
    TestContext.reset();
    mongoose.connection.close();
  });

  it('should not get user that doesnt exist', inject([ UserService ], (userService: UserService) => {
    userService.get('1a11aa1111111a1a1a1aaaa1')
      .then((user) => assert.fail('User should not exist'))
      .catch(
        err => {
          expect(err).to.be.an.instanceof(NotFound);
          expect(err.message).to.be.a('string');
          expect(err.message).to.be.equal('Cannot get user.');
        });
  }));


  it('should create user', inject([ UserService ], async (userService: UserService) => {
    const userCreateModel = UserUtil.generateCreate();

    const user: IUser = (await userService.create(userCreateModel, false) as any);

    expect(user.firstName).to.be.a('string');
    expect(user.firstName).to.be.equal(userCreateModel.firstName);
    expect(user.lastName).to.be.a('string');
    expect(user.lastName).to.be.equal(userCreateModel.lastName);
    expect(user.email).to.be.a('string');
    expect(user.email).to.be.equal(userCreateModel.email);
    expect(user.verifyPasswordSync(userCreateModel.password)).to.be.a('boolean');
    expect(user.verifyPasswordSync(userCreateModel.password)).to.be.equal(true);
    createdUsers.push(user);
  }));

  it('should update user', inject([ UserService ], async (userService: UserService) => {
    const userCreateModel = UserUtil.generateCreate();
    const userUpdateModel = UserUtil.generateUpdate();
    const createdUser: IUser = (await userService.create(userCreateModel, false) as any);

    createdUsers.push(createdUser);

    const updatedUser: IUser = (await userService.update(createdUser._id, userUpdateModel, false) as any);

    expect(updatedUser.firstName).to.be.a('string');
    expect(updatedUser.firstName).to.be.equal(userUpdateModel.firstName);
    expect(updatedUser.firstName).to.be.not.equal(userCreateModel.firstName);
    expect(updatedUser.lastName).to.be.a('string');
    expect(updatedUser.lastName).to.be.equal(userUpdateModel.lastName);
    expect(updatedUser.lastName).to.be.not.equal(userCreateModel.lastName);
    expect(updatedUser.email).to.be.a('string');
    expect(updatedUser.email).to.be.equal(userUpdateModel.email);
    expect(updatedUser.email).to.be.not.equal(userCreateModel.email);
    expect(updatedUser.verifyPasswordSync(userUpdateModel.password)).to.be.a('boolean');
    expect(updatedUser.verifyPasswordSync(userUpdateModel.password)).to.be.equal(true);
  }));
});
