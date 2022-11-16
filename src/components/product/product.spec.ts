import app from '../../../app';
import supertest from 'supertest';
import { signup, truncateDB, createProduct } from '../../../spec/utils';

describe('[E2E] Product', function () {
  describe('Testing the create endpoint', function () {
    beforeEach(async () => {
      await truncateDB();
    });

    // Success scenarios
    it('creates a product', async function () {
      // status code should be 201 `Created`
      const authToken = await signup();
      const response = await supertest(app)
        .post('/products')
        .set('Authorization', authToken)
        .send({
          name: 'testProduct',
          price: 3.99,
        });
      expect(response.statusCode).toBe(201);
    });

    // Failure scenarios
    it('returns 401 when creating a product without logging in', async function () {
      // status code should be 401 `Unauthorized`
      const response = await supertest(app).post('/products').send({
        name: 'testProduct',
        price: 3.99,
      });
      expect(response.statusCode).toBe(401);
    });
  });

  describe('Testing the get product by id endpoint', function () {

    beforeEach(async () => {
      await truncateDB();
    });
    // Success scenarios
    it('gets a product', async function () {
      const productId = await createProduct();
      const response = await supertest(app)
        .get('/products/' + productId)
        .send();
      expect(response.statusCode).toBe(200);
    });

    // Failure scenarios
    it('returns 404 when getting a product that does not exist', async function () {
      const response = await supertest(app)
        .get('/products/' + 1)
        .send();
      expect(response.statusCode).toBe(404);
    });
  });

  describe('Testing the get products endpoint', function () {
    beforeEach(async () => {
      await truncateDB();
    });

    it('gets products', async function () {
      await createProduct();
      const response = await supertest(app).get('/products').send();
      expect(response.statusCode).toBe(200);
    });

  });
});
