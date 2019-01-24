import { inject, TestContext } from '@tsed/testing';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { NotFound } from 'ts-httpexceptions';
import { UserCreateModel } from '../../../src/v2/modules/auth/user/models/UserCreateModel';
import { User } from '../../../src/v2/modules/auth/user/User';
import { IUser } from '../../../src/v2/modules/auth/user/UserInterface';
import { UserService } from '../../../src/v2/modules/auth/user/UserService';
import { assert } from '../../tools';

describe('UserService', () => {
  const createdUsers: (User | mongoose.Document)[] = [];
  before(TestContext.create);
  after(TestContext.reset);
  after(() => {
    createdUsers.map((user: any) => {
      user.remove()
        .then(() => console.log(`${user._id} is removed`));
    });
  });

  it('should not get user that doesnt exist', inject([ UserService ], async (userService: UserService) => {
    userService.get('5c44fd1614058b7a9d3bcee2')
      .then((user) => assert.fail('User should not exist'))
      .catch(
        err => {
          expect(err).to.be.an.instanceof(NotFound);
          expect(err.message).to.be.a('string');
          expect(err.message).to.be.equal('Cannot get user.');
        });
  }));


  it('should create user', inject([ UserService ], async (userService: UserService) => {
    const userCreateModel = new UserCreateModel();
    userCreateModel.firstName = 'Test';
    userCreateModel.lastName = 'Test';
    userCreateModel.email = `test-email-${new Date().getTime()}@getfood.io`;
    userCreateModel.password = 'test123';

    userService.create(userCreateModel)
      .then((user: IUser) => {
        expect(user.firstName).to.be.a('string');
        expect(user.firstName).to.be.equal(userCreateModel.firstName);
        expect(user.lastName).to.be.a('string');
        expect(user.lastName).to.be.equal(userCreateModel.lastName);
        expect(user.email).to.be.a('string');
        expect(user.email).to.be.equal(userCreateModel.email);
        expect(user.verifyPasswordSync(userCreateModel.password)).to.be.a('boolean');
        expect(user.verifyPasswordSync(userCreateModel.password)).to.be.equal(true);
        createdUsers.push(user);
      })
      .catch((err) => {
        assert.isNull(err, 'Should be succesful in creating the user.');
      });
  }));

});
