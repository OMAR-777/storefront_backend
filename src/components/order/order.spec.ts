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
  IOrder,
  IOrderProduct,
} from './order.interfaces';
import { ICreateUser, IUserSerialized } from '../user/user.interfaces';
import Order from './order.model';
import User from '../user/user.model';
import Common from '../../utils/common';
import Product from '../product/product.model';
import { IProduct } from '../product/product.interfaces';
import exp from 'constants';

describe('[E2E] Order endpoints', function () {
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
      await addOrderProduct(authToken, orderId, productId);
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

describe('Testing the Order model', function () {
  describe('Testing create function', function () {
    let newUser: IUserSerialized;
    beforeEach(async () => {
      await truncateDB();
      const insertQuery = await Common.dbInsertion(User.tableName, {
        firstname: 'testy',
        lastname: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      });
      if (insertQuery && insertQuery.inserted) {
        newUser = insertQuery.data[0] as IUserSerialized;
      }
    });

    it('creates an order', async function () {
      const order: ICreateOrder = {
        user_id: newUser.id,
        status: OrderStatus.Active,
      };
      const newOrder = await Order.create(order);
      expect(newOrder).toBeDefined();
      expect(newOrder).not.toBeNull();
    });
  });

  describe('Testing findAll function', function () {
    beforeEach(async () => {
      await truncateDB();
      const insertQuery = await Common.dbInsertion(User.tableName, {
        firstname: 'testy',
        lastname: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      });
      if (insertQuery && insertQuery.inserted) {
        const newUser = insertQuery.data[0] as IUserSerialized;
        await Common.dbInsertion(Order.ordersTableName, {
          user_id: newUser.id,
          status: OrderStatus.Active,
        });
        await Common.dbInsertion(Order.ordersTableName, {
          user_id: newUser.id,
          status: OrderStatus.Active,
        });
      }
    });

    it('gets all orders', async function () {
      const orders = await Order.findAll();
      expect(orders).toBeDefined();
      expect(orders).not.toBeNull();
      expect(orders.length).toEqual(2);
    });
  });

  describe('Testing findById function', function () {
    let newOrder: IOrder;
    beforeEach(async () => {
      await truncateDB();
      const userInsert = await Common.dbInsertion(User.tableName, {
        firstname: 'testy',
        lastname: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      });
      if (userInsert && userInsert.inserted) {
        const newUser = userInsert.data[0] as IUserSerialized;
        const orderInsert = await Common.dbInsertion(Order.ordersTableName, {
          user_id: newUser.id,
          status: OrderStatus.Active,
        });
        if (orderInsert && orderInsert.inserted) {
          newOrder = orderInsert.data[0] as IOrder;
        }
      }
    });

    it('gets a order by id', async function () {
      const order = await Order.findOneById(newOrder.id);
      expect(order).toBeDefined();
      expect(order).not.toBeNull();
    });
  });

  describe('Testing getUserActiveOrder function', function () {
    let newOrder: IOrder;
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
        const orderInsert = await Common.dbInsertion(Order.ordersTableName, {
          user_id: newUser.id,
          status: OrderStatus.Active,
        });
        if (orderInsert && orderInsert.inserted) {
          newOrder = orderInsert.data[0] as IOrder;
        }
      }
    });

    it("gets user's active order", async function () {
      const order = await Order.getUserActiveOrder(newUser.id);
      expect(order).toBeDefined();
      expect(order).not.toBeNull();
    });
  });

  describe('Testing addOrderProduct function', function () {
    let newOrder: IOrder;
    let newProduct: IProduct;
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
        const orderInsert = await Common.dbInsertion(Order.ordersTableName, {
          user_id: newUser.id,
          status: OrderStatus.Active,
        });
        if (orderInsert && orderInsert.inserted) {
          newOrder = orderInsert.data[0] as IOrder;
          const productInsert = await Common.dbInsertion(Product.tableName, {
            name: 'test1',
            price: 2.99,
          });
          if (productInsert && productInsert.inserted) {
            newProduct = productInsert.data[0] as IProduct;
          }
        }
      }
    });

    it('adds order product to an order', async function () {
      const dataObject: IAddOrderProduct = {
        order_id: newOrder.id,
        product_id: newProduct.id,
        quantity: 3,
      };
      const orderProduct = await Order.addOrderProduct(dataObject);
      expect(orderProduct).toBeDefined();
      expect(orderProduct).not.toBeNull();
    });
  });

  describe('Testing getOrderProducts function', function () {
    let newOrder: IOrder;
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
        const orderInsert = await Common.dbInsertion(Order.ordersTableName, {
          user_id: newUser.id,
          status: OrderStatus.Active,
        });
        if (orderInsert && orderInsert.inserted) {
          newOrder = orderInsert.data[0] as IOrder;
          const product1Insert = await Common.dbInsertion(Product.tableName, {
            name: 'test1',
            price: 2.99,
          });
          const product2Insert = await Common.dbInsertion(Product.tableName, {
            name: 'test2',
            price: 3.99,
          });
          if (
            product1Insert &&
            product1Insert.inserted &&
            product2Insert &&
            product2Insert.inserted
          ) {
            const newProduct1 = product1Insert.data[0] as IProduct;
            const newProduct2 = product1Insert.data[0] as IProduct;

            await Common.dbInsertion(Order.orderProductsTableName, {
              order_id: newOrder.id,
              product_id: newProduct1.id,
              quantity: 2,
            });
            await Common.dbInsertion(Order.orderProductsTableName, {
              order_id: newOrder.id,
              product_id: newProduct2.id,
              quantity: 3,
            });
          }
        }
      }
    });

    it('gets order products', async function () {
      const orderProducts = await Order.getOrderProducts(newOrder.id);
      expect(orderProducts).toBeDefined();
      expect(orderProducts).not.toBeNull();
      expect(orderProducts.length).toEqual(2);
    });
  });

  describe('Testing completeOrder function', function () {
    let newOrder: IOrder;
    beforeEach(async () => {
      await truncateDB();
      const userInsert = await Common.dbInsertion(User.tableName, {
        firstname: 'testy',
        lastname: 'test',
        email: 'test@gmail.com',
        password: '12345678',
      });
      if (userInsert && userInsert.inserted) {
        const newUser = userInsert.data[0] as IUserSerialized;
        const orderInsert = await Common.dbInsertion(Order.ordersTableName, {
          user_id: newUser.id,
          status: OrderStatus.Active,
        });
        if (orderInsert && orderInsert.inserted) {
          newOrder = orderInsert.data[0] as IOrder;
          const productInsert = await Common.dbInsertion(Product.tableName, {
            name: 'test1',
            price: 2.99,
          });
          if (productInsert && productInsert.inserted) {
            const newProduct = productInsert.data[0] as IProduct;
            await Common.dbInsertion(Order.orderProductsTableName, {
              order_id: newOrder.id,
              product_id: newProduct.id,
              quantity: 2,
            });
          }
        }
      }
    });

    it('completes an order', async function () {
      const orderProduct = await Order.completeOrder(newOrder.id);
      expect(orderProduct).toBeTrue();
    });
  });

  describe('Testing the getCompletedOrdersByUserId function', function () {
    let newOrder: IOrder;
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
        const orderInsert = await Common.dbInsertion(Order.ordersTableName, {
          user_id: newUser.id,
          status: OrderStatus.Active,
        });
        if (orderInsert && orderInsert.inserted) {
          newOrder = orderInsert.data[0] as IOrder;
          const productInsert = await Common.dbInsertion(Product.tableName, {
            name: 'test1',
            price: 2.99,
          });
          if (productInsert && productInsert.inserted) {
            const newProduct = productInsert.data[0] as IProduct;
            await Common.dbInsertion(Order.orderProductsTableName, {
              order_id: newOrder.id,
              product_id: newProduct.id,
              quantity: 2,
            });
            await Common.dbUpdate(
              Order.ordersTableName,
              { status: OrderStatus.Completed },
              { id: newOrder.id },
            );
          }
        }
      }
    });

    it('gets completed orders by user id', async function () {
      const completedOrders = await Order.getCompletedOrdersByUserId(
        newUser.id,
      );
      expect(completedOrders).not.toBeNull();
      expect(completedOrders.length).toEqual(1);
    });
  });
});
