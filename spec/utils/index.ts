import supertest from 'supertest';
import app from '../../app';
import { ICreateOrder, OrderStatus } from '../../src/components/order/order.interfaces';
import { ICreateProduct } from '../../src/components/product/product.interfaces';
import {
  ICreateUser,
  IUserSerialized,
} from '../../src/components/user/user.interfaces';
import Common from '../../src/utils/common';

const truncateDB = async () => {
  await Common.dbTruncate();
};

const signup = async (email?: string, password?: string) => {
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
};

async function createProduct() {
  const randomId = Math.floor(Math.random() * 1000);
  const { token } = await signup();
  const dataObject: ICreateProduct = {
    name: `test-product-${randomId}`,
    price: '4.99',
  };
  const response = await supertest(app)
    .post('/products')
    .set('Authorization', token)
    .send(dataObject);
  const productId = response.body.data.product.id;
  return productId;
}

export { truncateDB, signup, createProduct };
