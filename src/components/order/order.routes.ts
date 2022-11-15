import { Express } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';

import OrderController from './order.controller';
import {
  addOrderProductValidation,
  createOrderValidation,
  getOrderProductsValidation,
  getOrderValidation,
} from './order.schemas';

const orderRouter = (app: Express) => {
  app.get('/orders', OrderController.getUserOrders);
  app.get(
    '/orders/:id',
    validateRequest(getOrderValidation),
    OrderController.getUserCurrentOrder,
  );
  app.post(
    '/orders',
    requireAuth,
    OrderController.create,
  );
  app.get(
    '/orders/:id/products',
    requireAuth,
    validateRequest(getOrderProductsValidation),
    OrderController.getOrderProducts,
  );
  app.post(
    '/orders/:id/products',
    requireAuth,
    validateRequest(addOrderProductValidation),
    OrderController.addOrderProduct,
  );
};

export default orderRouter;
