/* eslint-disable max-len */
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
      throw new NotFoundError('No Active Order Created!');
    }

    const orderProducts = await Order.getOrderProducts(order.id);
    if(orderProducts){
      order.orderProducts = orderProducts;
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

  async create(req: Request, res: Response) {
    //here we know that req.user is not null because requireAuth is passed
    const user_id = req.user!.id;
    const dataObject: ICreateOrder = { user_id, status: OrderStatus.Active };

    const activeOrder = await Order.getUserActiveOrder(user_id);
    if (activeOrder) {
      throw new NotFoundError(
        `There\'s an active order (with id: ${activeOrder.id}) for this user already!`,
      );
    }

    const order = await Order.create(dataObject);
    if (order) {
      const result = { order };
      return CustomResponse.send(res, result, 'Created Successfully', 201);
    } else {
      throw new Error();
    }
  }

  async addOrderProduct(req: Request, res: Response) {
    const { product_id, quantity } = req.body;
    const order_id = +req.params.id;

    const order = await Order.findOneById(order_id);
    if (!order) {
      throw new NotFoundError('Order Not Found!');
    }

    const product = await Product.findOneById(product_id);
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

  async completeOrder(req: Request, res: Response) {
    const orderId = +req.params.id;
    const order = await Order.findOneById(orderId);
    if (!order) {
      throw new NotFoundError('Order Not Found!');
    }

    if (order.status === OrderStatus.Completed) {
      throw new BadRequestError('Order is already completed!');
    }

    const orderProducts = await Order.getOrderProducts(orderId);
    if (!orderProducts) {
      throw new BadRequestError('Order has no items!');
    }

    const updatedOrder = await Order.completeOrder(orderId);
    if (updatedOrder) {
      return CustomResponse.sendWithoutData(
        res,
        'Order is completed successfully!',
        200,
      );
    }else {
      throw new Error();
    }
  }
}

export default new OrderController();
