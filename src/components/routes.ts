import { Express } from 'express';
import userRouter from './user/user.routes';
import productRouter from './product/product.routes';
import orderRouter from './order/order.routes';

class routing {

  api(app: Express) {
    userRouter(app);
    productRouter(app);
    orderRouter(app);
  }
}
export default new routing();