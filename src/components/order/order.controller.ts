import { Request, Response } from 'express';
import { BadRequestError } from '../../errors/bad-request-error';
import {
  IAddOrderProduct,
  ICreateOrder,
  IOrder,
  OrderStatus,
} from './order.interfaces';
import { Password } from '../../utils/password';
import Order from './order.model';
import { NotFoundError } from '../../errors/not-found-error';
import CustomResponse from '../../utils/custom-response';
import { JWT } from '../../utils/jwt';
import Product from '../product/product.model';

class OrderController {

  async getUserCurrentOrder(req: Request, res: Response) {
    const userId = req.user!.id;
    const order = await Order.getUserActiveOrder(userId);
    if (!order) {
      throw new NotFoundError('Order Not Found!');
    }
    CustomResponse.send(res, { order });
  }

  async getUserOrders(req: Request, res: Response) {
    const userId = req.user!.id;
    const orders = await Order.getByUserId(userId);
    CustomResponse.send(res, { orders });
  }

  async getOrder(req: Request, res: Response) {
    const order = await Order.findOneById(+req.params.id);
    if (!order) {
      throw new NotFoundError('Order Not Found!');
    }
    CustomResponse.send(res, { order });
  }

  async getOrders(req: Request, res: Response) {
    const orders = await Order.findAll();
    CustomResponse.send(res, { orders });
  }

  async create(req: Request, res: Response) {
    //here we know that req.user is not null because requireAuth is passed
    const user_id = req.user!.id;
    const dataObject: ICreateOrder = { user_id, status: OrderStatus.Active };

    const order = await Order.create(dataObject);

    const result = { order };

    return CustomResponse.send(res, result, 'Created Successfully', 201);
  }

  async addOrderProduct(req: Request, res: Response) {
    const { product_id, quantity } = req.body;
    const order_id = +req.params.id;

    const order = Order.findOneById(order_id);
    if (!order) {
      throw new NotFoundError('Order Not Found!');
    }

    const product = Product.findOneById(product_id);
    if (!product) {
      throw new NotFoundError('Product Not Found!');
    }

    const dataObject: IAddOrderProduct = { product_id, order_id, quantity };

    const orderProduct = await Order.addOrderProduct(dataObject);

    if (orderProduct) {
      const result = { orderProduct };
      return CustomResponse.send(
        res,
        result,
        'Added Order Product Successfully',
        201,
      );
    } else {
      throw new Error();
    }
  }

  async getOrderProducts(req: Request, res: Response) {
    //here we know that req.user is not null requireAuth is passed
    const orderId = +req.params.id;

    const orderProducts = await Order.getOrderProducts(orderId);

    return CustomResponse.send(res, orderProducts);
  }
}

export default new OrderController();
