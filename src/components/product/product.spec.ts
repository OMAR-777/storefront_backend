import app from '../../../app';
import supertest from 'supertest';
import { signup, truncateDB, createProduct } from '../../../spec/utils';
import { ICreateProduct, IProduct } from './product.interfaces';
import Product from './product.model';
import Common from '../../utils/common';

describe('[E2E] Product endpoints', function () {
  describe('Testing the create endpoint', function () {
    beforeEach(async () => {
      await truncateDB();
    });

    // Success scenarios
    it('creates a product', async function () {
      // status code should be 201 `Created`
      const { token } = await signup();
      const response = await supertest(app)
        .post('/products')
        .set('Authorization', token)
        .send({
          name: 'testProduct',
          price: 3.99,
        });
      expect(response.statusCode).toBe(201);
    });

    // Failure scenarios
    it('returns 401 when trying to create a product without logging in', async function () {
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

describe('Testing the Product model', function () {
  describe('Testing create function', function () {
    beforeEach(async () => {
      await truncateDB();
    });

    it('creates a product', async function () {
      const product: ICreateProduct = {
        name: 'test product',
        price: 2.99,
      };
      const newProduct = await Product.create(product);
      expect(newProduct).toBeDefined();
      expect(newProduct).not.toBeNull();
    });
  });

  describe('Testing findAll function', function () {
    beforeEach(async () => {
      await truncateDB();
      await Common.dbInsertion(Product.tableName, { name: 'test1', price: 2.99 });
      await Common.dbInsertion(Product.tableName, { name: 'test2', price: 3.99 });
    });

    it('gets all products', async function () {
      const products = await Product.findAll();
      expect(products).toBeDefined();
      expect(products).not.toBeNull();
      expect(products.length).toEqual(2);
    });
  });

  describe('Testing findById function', function () {
    let newProduct: IProduct;
    beforeEach(async () => {
      await truncateDB();
      const insertQuery = await Common.dbInsertion(Product.tableName, {
        name: 'test1',
        price: 2.99,
      });
      if (insertQuery && insertQuery.inserted) {
        newProduct = insertQuery.data[0] as IProduct;
      }
    });

    it('gets a product by id', async function () {
      const product = await Product.findOneById(newProduct.id);
      expect(product).toBeDefined();
      expect(product).not.toBeNull();
    });
  });

  describe('Testing findByName function', function () {
    let newProduct: IProduct;
    beforeEach(async () => {
      await truncateDB();
      const insertQuery = await Common.dbInsertion(Product.tableName, {
        name: 'test1',
        price: 2.99,
      });
      if (insertQuery && insertQuery.inserted) {
        newProduct = insertQuery.data[0] as IProduct;
      }
    });

    it('gets a product by name', async function () {
      const product = await Product.findOneByName(newProduct.name);
      expect(product).toBeDefined();
      expect(product).not.toBeNull();
    });
  });
});
