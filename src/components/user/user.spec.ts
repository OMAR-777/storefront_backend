import app from '../../../app';
import supertest from 'supertest';
import { truncateDB, signup } from '../../../spec/utils';
import { ICreateUser, IUserSerialized } from './user.interfaces';
import User from './user.model';
import Common from '../../utils/common';

describe('[E2E] User endpoinds', function () {
  describe('Testing the signup endpoint', function () {
    beforeEach(async () => {
      await truncateDB();
    });

    // Success scenarios
    it('creates an account', async function () {
      // status code should be 201 `Created`
      const user1: ICreateUser = {
        firstname: 'test',
        lastname: 'test',
        email: 'test@test.com',
        password: '12345678',
      };
      const response = await supertest(app).post('/users').send(user1);
      expect(response.statusCode).toBe(201);
    });

    // Failure scenarios
    it('returns 400 if an account existed with the same email address', async function () {
      // status code should be 201 `Created`
      const createdUser1: ICreateUser = {
        firstname: 'test',
        lastname: 'test',
        email: 'test@test.com',
        password: '12345678',
      };
      const createdUser2: ICreateUser = {
        firstname: 'test',
        lastname: 'test',
        email: 'test@test.com',
        password: '12345678',
      };
      const createUser1Response = await supertest(app)
        .post('/users')
        .send(createdUser1);
      expect(createUser1Response.statusCode).toBe(201);

      // status code should be 400
      const createUser2Response = await supertest(app)
        .post('/users')
        .send(createdUser2);
      expect(createUser2Response.statusCode).toBe(400);
    });
  });

  describe('Testing the login endpoint', function () {
    let loginEmail = 'test@test.com';
    let loginPassword = '12345678';
    beforeEach(async () => {
      await truncateDB();
      await signup(loginEmail, loginPassword);
    });

    // Success scenarios
    it('logs user in', async function () {
      const response = await supertest(app).post('/users/login').send({
        email: loginEmail,
        password: loginPassword,
      });
      expect(response.statusCode).toBe(200);
    });

    // Failure scenarios
    it('returns 400 when trying to login with invalid credintials', async function () {
      const invalidPassword = loginPassword + 'blaabla';
      const response = await supertest(app).post('/users/login').send({
        email: loginEmail,
        password: invalidPassword,
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('Testing the profile endpoint', function () {
    let authToken = '';
    beforeEach(async () => {
      await truncateDB();
      let { token } = await signup();
      authToken = token;
    });

    // Success scenarios
    it('gets user profile', async function () {
      const response = await supertest(app)
        .get('/me')
        .set('Authorization', authToken)
        .send();
      expect(response.statusCode).toBe(200);
    });

    // Failure scenarios
    it('returns 401 when trying to access profile endpoint without logging in', async function () {
      const response = await supertest(app).get('/users/me').send();
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the get users endpoint', function () {
    let authToken = '';
    beforeEach(async () => {
      await truncateDB();
      let { token } = await signup();
      authToken = token;
    });

    // Success scenarios
    it('gets users', async function () {
      const response = await supertest(app)
        .get('/users')
        .set('Authorization', authToken)
        .send();
      expect(response.statusCode).toBe(200);
    });

    // Failure scenarios
    it('returns 401 when trying to access users endpoint without logging in', async function () {
      const response = await supertest(app).get('/users').send();
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the get user endpoint', function () {
    let authToken = '';
    let createdUser: IUserSerialized;
    beforeEach(async () => {
      await truncateDB();
      let { token, user } = await signup();
      authToken = token;
      createdUser = user;
    });

    // Success scenarios
    it('gets user', async function () {
      const id = createdUser.id;
      const response = await supertest(app)
        .get('/users/' + id)
        .set('Authorization', authToken)
        .send();
      expect(response.statusCode).toBe(200);
    });

    // Failure scenarios
    it('returns 401 when trying to get user by id endpoint without logging in', async function () {
      const id = createdUser.id;
      const response = await supertest(app)
        .get('/users/' + id)
        .send();
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the create N users endpoint', function () {
    let authToken = '';
    beforeEach(async () => {
      await truncateDB();
      let { token } = await signup();
      authToken = token;
    });

    // Success scenarios
    it('creates users', async function () {
      const user1 = {
        firstname: 'test',
        lastname: 'test',
        email: 'test@test.com',
        password: '12345678',
      };
      const user2 = {
        firstname: 'test',
        lastname: 'test',
        email: 'test2@test.com',
        password: '12345678',
      };

      const response = await supertest(app)
        .post('/users/createMany')
        .set('Authorization', authToken)
        .send([user1, user2]);
      expect(response.statusCode).toBe(201);
    });

    // Failure scenarios
    it('returns 401 when trying to add users without logging in', async function () {
      const user1 = {
        firstname: 'test',
        lastname: 'test',
        email: 'test@test.com',
        password: '12345678',
      };
      const user2 = {
        firstname: 'test',
        lastname: 'test',
        email: 'test2@test.com',
        password: '12345678',
      };
      const response = await supertest(app)
        .post('/users/createMany')
        .send([user1, user2]);
      expect(response.statusCode).toBe(401);
    });
  });
});

describe('Testing the User model', function () {
  describe('Testing create function', function () {
    beforeEach(async () => {
      await truncateDB();
    });

    it('creates a user', async function () {
      const user: ICreateUser = {
        firstname: 'testy',
        lastname: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      };
      const newUser = await User.create(user);
      expect(newUser).toBeDefined();
      expect(newUser).not.toBeNull();
    });
  });

  describe('Testing findAll function', function () {
    beforeEach(async () => {
      await truncateDB();
      await Common.dbInsertion(User.tableName, {
        firstname: 'testy',
        lastname: 'test',
        email: 'test1@gmail.com',
        password: '12345678',
      });
      await Common.dbInsertion(User.tableName, {
        firstname: 'testo',
        lastname: 'test',
        email: 'test2@gmail.com',
        password: '12345678',
      });
    });

    it('gets all users', async function () {
      const users = await User.findAll();
      expect(users).toBeDefined();
      expect(users).not.toBeNull();
      expect(users.length).toEqual(2);
    });
  });

  describe('Testing findOneById function', function () {
    let newUser: IUserSerialized;
    beforeEach(async () => {
      await truncateDB();
      const userInsert = await Common.dbInsertion(User.tableName, {
        firstname: 'testy',
        lastname: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      });
      if (userInsert && userInsert.inserted) {
        newUser = userInsert.data[0] as IUserSerialized;
      }
    });

    it('gets a user by id', async function () {
      const user = await User.findOneById(newUser.id);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();
    });
  });

  describe('Testing findOneByEmail function', function () {
    let newUser: IUserSerialized;
    beforeEach(async () => {
      await truncateDB();
      const userInsert = await Common.dbInsertion(User.tableName, {
        firstname: 'testy',
        lastname: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      });
      if (userInsert && userInsert.inserted) {
        newUser = userInsert.data[0] as IUserSerialized;
      }
    });

    it('gets a user by email', async function () {
      const user = await User.findOneByEmail(newUser.email);
      expect(user).toBeDefined();
      expect(user).not.toBeNull();
    });
  });
});
