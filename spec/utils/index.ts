import supertest from 'supertest';
import app from '../../app';
import Common from '../../src/utils/common';

const truncateDB = async () => {
  await Common.dbTruncate();
};

const signup = async () => {
  const randomId = Math.floor(Math.random() * 1000);
  const response = await supertest(app)
    .post('/users')
    .send({
      firstname: 'test',
      lastname: 'test',
      email: `test-${randomId}@test.com`,
      password: '12345678',
    });
  const token = response.body.data.token;
  return 'Bearer ' + token;
};

const createProduct = async () => {
  const randomId = Math.floor(Math.random() * 1000);
  const authToken = await signup();
  const response = await supertest(app)
    .post('/products')
    .set('Authorization', authToken)
    .send({
      name: `test-product-${randomId}`,
      price: '4.99',
    });
  const productId = response.body.data.product.id;
  return productId;
};

export { truncateDB, signup, createProduct };
