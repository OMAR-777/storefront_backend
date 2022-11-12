import { Express } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';

import ProductController from './product.controller';
import { createProductValidation, getProductValidation } from './product.schemas';

const productRouter = (app: Express) => {

  app.get('/products', ProductController.getProducts);
  app.get('/products/:id', validateRequest(getProductValidation), ProductController.getProduct);
  app.post('/products', requireAuth,
    validateRequest(createProductValidation), ProductController.create);

};

export default productRouter;