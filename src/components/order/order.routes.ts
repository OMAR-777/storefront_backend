import { Express } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';

import OrderController from './order.controller';
import {
  addOrderProductValidation,
  getOrderProductsValidation,
  getOrderValidation,
} from './order.schemas';

const orderRouter = (app: Express) => {
  app.get('/orders', requireAuth, OrderController.getUserCompletedOrders);
  app.get(
    '/orders/cart',
    requireAuth,
    OrderController.getUserCurrentOrder,
  );
  app.get(
    '/orders/:id/complete',
    requireAuth,
    validateRequest(getOrderValidation),
    OrderController.completeOrder,
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
