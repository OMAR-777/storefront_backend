import supertest from 'supertest';
import app from '../../app';
import {
  IAddOrderProduct,
  ICreateOrder,
  OrderStatus,
} from '../../src/components/order/order.interfaces';
import { ICreateProduct, IProduct } from '../../src/components/product/product.interfaces';
import {
  ICreateUser,
  IUserSerialized,
} from '../../src/components/user/user.interfaces';
import Logger from '../../src/middlewares/logger';
import Common from '../../src/utils/common';

const truncateDB = async () => {
  await Common.dbTruncate();
};

const signup = async (email?: string, password?: string) => {
  try {
    if (!email) {
      const randomId = Math.floor(Math.random() * 1000);
      email = `test-${randomId}@test.com`;
    }
    if (!password) {
      password = '12345678';
    }

    const response = await supertest(app).post('/users').send({
      firstname: 'test',
      lastname: 'test',
      email: email,
      password: password,
    });
    const token = 'Bearer ' + response.body.data.token;
    const user: IUserSerialized = response.body.data.user;
    return { token, user };
  } catch (e) {
    throw new Error('Could not sign up test user: ' + e);
  }
};

async function createProduct() {
  try {
    const randomId = Math.floor(Math.random() * 1000);
    const { token } = await signup();
    const dataObject: ICreateProduct = {
      name: `test-product-${randomId}`,
      price: 4.99,
    };
    const response = await supertest(app)
      .post('/products')
      .set('Authorization', token)
      .send(dataObject);
    const productId = response.body.data.product.id;
    return productId;
  } catch (e) {
    throw new Error('Could not create test product: ' + e);
  }
}

async function createOrder(
  user_id: number,
  token: string,
  orderStatus = OrderStatus.Active,
) {
  try {
    const randomId = Math.floor(Math.random() * 1000);
    const dataObject: ICreateOrder = {
      user_id: user_id,
      status: orderStatus,
    };
    const response = await supertest(app)
      .post('/orders')
      .set('Authorization', token)
      .send(dataObject);
    const orderId: number = response.body.data.order.id;
    return orderId;
  } catch (e) {
    throw new Error('Could not create test order: ' + e);
  }
}

async function addOrderProduct(
  token: string,
  order_id: number,
  product_id: number,
  quantity = 1,
) {
  try {
    const dataObject = {
      product_id,
      quantity,
    };
    const response = await supertest(app)
      .post(`/orders/${order_id}/products`)
      .set('Authorization', token)
      .send(dataObject);
    const orderProduct: number = response.body.data.orderProduct.id;
    return orderProduct;
  } catch (e) {
    throw new Error('Could not add product to order: ' + e);
  }
}

export { truncateDB, signup, createProduct, createOrder, addOrderProduct };
