import { ExpressApplication } from '@tsed/common';
import { MongooseModel } from '@tsed/mongoose';
import { bootstrap, inject, TestContext } from '@tsed/testing';
import * as mongoose from 'mongoose';
import * as SuperTest from 'supertest';
import { Server } from '../../../../src/Server';
import { User } from '../../../../src/v2/modules/auth/user/User';
import { IUser } from '../../../../src/v2/modules/auth/user/UserInterface';
import { assert } from '../../../tools';
import { UserUtil } from './UserUtil';
import _ = require('lodash');

describe('UserController', () => {
  const createdUsers: string[] = [];
  let userModel: MongooseModel<IUser> = null;
  let token: string;
  const user = UserUtil.generateCreate();
  let app;

  beforeEach(inject([ ExpressApplication, User ], (
    expressApplication: ExpressApplication,
    user: MongooseModel<IUser>
  ) => {
    app = SuperTest(expressApplication);
    userModel = user;
  }));

  before(async () => bootstrap(Server)());
  after(async () => {
    await Promise.all(
      createdUsers.map(async (userId: string) => {
        const foundUser: IUser & mongoose.Document = await userModel.findOne({ userId });

        if ( !_.isNil(foundUser) ) {
          foundUser
            .remove()
            .then(() => console.log(`${foundUser._id} is removed`));
        }
      })
    );
    TestContext.reset();
    mongoose.connection.close();
  });

  it('should create user', (done) => {
    app
      .post('/v2/user')
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(
        response => {
          console.log(response.body);
          assert.equal(response.body.firstName, user.firstName);
          assert.equal(response.body.lastName, user.lastName);
          assert.equal(response.body.email, user.email);
          token = response.body.token;
          createdUsers.push(response.body._id);
          done();
        });
  });

  it('should get user', (done) => {
    app
      .get('/v2/user')
      .set('Accept', 'application/json')
      .set('X-User-Token', token)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(
        response => {
          console.log(response.body);
          assert.equal(response.body.firstName, user.firstName);
          assert.equal(response.body.lastName, user.lastName);
          assert.equal(response.body.email, user.email);
          done();
        });
  });

  it('should authenticate user', (done) => {
    app
      .post('/v2/user/auth')
      .set('Accept', 'application/json')
      .send({ email: user.email, password: user.password })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(
        response => {
          assert.notEqual(response.body.err, true);
          token = response.body.token;
          done();
        });
  });

  it('should not authenticate user with wrong password', (done) => {
    app
      .post('/v2/user/auth')
      .set('Accept', 'application/json')
      .send({ email: user.email, password: user.password + '123' })
      .expect('Content-Type', /json/)
      .expect(403)
      .then(
        response => {
          assert.equal(response.body.err, true);
          assert.equal(response.body.message, 'Email and/or Password is incorrect.');
          done();
        });
  });

  it('should not authenticate user with wrong email', (done) => {
    app
      .post('/v2/user/auth')
      .set('Accept', 'application/json')
      .send({ email: UserUtil.generateEmail('wrong-email'), password: user.password })
      .expect('Content-Type', /json/)
      .expect(403)
      .then(
        response => {
          assert.equal(response.body.err, true);
          assert.equal(response.body.message, 'Email and/or Password is incorrect.');
          done();
        });
  });

  it('should not get user without token', (done) => {
    app
      .get('/v2/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
      .then(
        response => {
          assert.equal(response.body.err, true);
          assert.equal(response.body.message, 'User not authorized.');
          done();
        });
  });

});
