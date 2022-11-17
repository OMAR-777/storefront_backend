import app from '../../../app';
import supertest from 'supertest';
import {
  signup,
  truncateDB,
  createOrder,
  createProduct,
  addOrderProduct,
} from '../../../spec/utils';
import {
  ICreateOrder,
  OrderStatus,
  IAddOrderProduct,
} from './order.interfaces';
import { IUserSerialized } from '../user/user.interfaces';

describe('[E2E] Order', function () {
  describe('Testing the create endpoint', function () {
    let orderUser: IUserSerialized;
    let authToken = '';
    beforeEach(async () => {
      await truncateDB();
      let { token, user } = await signup();
      orderUser = user;
      authToken = token;
    });

    // Success scenarios
    it('creates an order', async function () {
      // status code should be 201 `Created`
      const createdOrder: ICreateOrder = {
        user_id: orderUser.id,
        status: OrderStatus.Active,
      };
      const response = await supertest(app)
        .post('/orders')
        .set('Authorization', authToken)
        .send(createdOrder);
      expect(response.statusCode).toBe(201);
    });

    // Failure scenarios
    it('returns 401 when trying to create a product without logging in', async function () {
      // status code should be 401 `Unauthorized`
      const createdOrder: ICreateOrder = {
        user_id: orderUser.id,
        status: OrderStatus.Active,
      };
      const response = await supertest(app).post('/orders').send(createdOrder);
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the user current order (cart) endpoint', function () {
    let orderUser: IUserSerialized;
    let authToken = '';
    beforeEach(async () => {
      await truncateDB();
      let { token, user } = await signup();
      await createOrder(user.id, token);
      orderUser = user;
      authToken = token;
    });

    // Success scenarios
    it('gets user current order', async function () {
      const response = await supertest(app)
        .get('/orders/cart')
        .set('Authorization', authToken)
        .send();
      expect(response.statusCode).toBe(200);
    });

    // Failure scenarios
    it('returns 401 when trying to get user current order without logging in', async function () {
      // status code should be 401 `Unauthorized`
      const response = await supertest(app).get('/orders/cart').send();
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the add order product endpoint', function () {
    let orderUser: IUserSerialized;
    let authToken = '';
    let orderId = -1;
    let productId = -1;
    let orderProduct = {};

    beforeEach(async () => {
      await truncateDB();
      let { token, user } = await signup();
      orderId = await createOrder(user.id, token);
      productId = await createProduct();
      orderUser = user;
      authToken = token;
      orderProduct = {
        product_id: productId,
        quantity: 10,
      };
    });

    // Success scenarios
    it('adds product to an order', async function () {

      const response = await supertest(app)
        .post(`/orders/${orderId}/products`)
        .set('Authorization', authToken)
        .send(orderProduct);
      expect(response.statusCode).toBe(201);
    });

    // Failure scenarios
    it('returns 401 when trying to add order product without logging in', async function () {
      // status code should be 401 `Unauthorized`
      const response = await supertest(app)
        .post(`/orders/${orderId}/products`)
        .send(orderProduct);
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the get order products endpoint', function () {
    let orderUser: IUserSerialized;
    let authToken = '';
    let orderId = -1;
    let productId = -1;

    beforeEach(async () => {
      await truncateDB();
      let { token, user } = await signup();
      orderId = await createOrder(user.id, token);
      productId = await createProduct();
      orderUser = user;
      authToken = token;
    });

    // Success scenarios
    it('gets order products', async function () {

      const response = await supertest(app)
        .get(`/orders/${orderId}/products`)
        .set('Authorization', authToken)
        .send();
      expect(response.statusCode).toBe(200);
    });

    // Failure scenarios
    it('returns 401 when trying to get order products without logging in', async function () {
      // status code should be 401 `Unauthorized`
      const response = await supertest(app)
        .get(`/orders/${orderId}/products`)
        .send();
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the complete order endpoint', function () {
    let orderUser: IUserSerialized;
    let authToken = '';
    let orderId = -1;
    let productId = -1;

    beforeEach(async () => {
      await truncateDB();
      let { token, user } = await signup();
      orderId = await createOrder(user.id, token);
      productId = await createProduct();
      orderUser = user;
      authToken = token;
    });

    // Success scenarios
    it('it completes an order', async function () {
      await addOrderProduct(authToken,orderId, productId);
      const response = await supertest(app)
        .get(`/orders/'${orderId}/complete`)
        .set('Authorization', authToken)
        .send();
      expect(response.statusCode).toBe(400);
    });

    // Failure scenarios
    it('returns 400 when trying complete an order without adding products', async function () {
      const response = await supertest(app)
        .get(`/orders/'${orderId}/complete`)
        .set('Authorization', authToken)
        .send();
      expect(response.statusCode).toBe(400);
    });

    it('returns 401 when trying to complete an order without logging in', async function () {
      // status code should be 401 `Unauthorized`
      const response = await supertest(app)
        .get(`/orders/'${orderId}/complete`)
        .send();
      expect(response.statusCode).toBe(401);
    });

  });

  describe('Testing the get completed orders endpoint', function () {
    let orderUser: IUserSerialized;
    let authToken = '';
    beforeEach(async () => {
      await truncateDB();
      let { token, user } = await signup();
      await createOrder(user.id, token);
      orderUser = user;
      authToken = token;
    });

    // Success scenarios
    it('gets completed orders', async function () {
      const response = await supertest(app)
        .get('/orders')
        .set('Authorization', authToken)
        .send();
      expect(response.statusCode).toBe(200);
    });

    // Failure scenarios
    it('returns 401 when trying to get completed orders without logging in', async function () {
      // status code should be 401 `Unauthorized`
      const response = await supertest(app).get('/orders').send();
      expect(response.statusCode).toBe(401);
    });
  });
});
