import { Express } from 'express';
import user from './user/user.routes';
import product from './product/product.routes';

class routing {

  api(app: Express) {
    user(app);
    product(app);
  }
}
export default new routing();