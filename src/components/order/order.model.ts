import Common from '../../utils/common';
import {
  ICreateOrder,
  IAddOrderProduct,
  IOrder,
  IOrderProduct,
  OrderStatus,
} from './order.interfaces';

class Order {
  static ordersTableName = 'orders';
  static orderProductsTableName = 'order_products';

  static async findOneById(id: number): Promise<IOrder | null> {
    const rows = await Common.dbFetch(Order.ordersTableName, { id });
    if (rows?.length) {
      const order = rows[0] as IOrder;
      return order;
    } else {
      return null;
    }
  }

  static async findAll(): Promise<IOrder[]> {
    const rows = await Common.dbFetch(Order.ordersTableName, null, [
      'id',
      'status',
      'user_id',
      'created_at',
    ]);
    return rows as IOrder[];
  }

  static async getUserActiveOrder(user_id: number): Promise<IOrder | null> {
    const rows = await Common.dbFetch(Order.ordersTableName, {
      user_id,
      status: OrderStatus.Active,
    });
    if (rows?.length) {
      const order = rows[0] as IOrder;
      return order;
    } else {
      return null;
    }
  }
  static async getCompletedOrdersByUserId(user_id: number): Promise<IOrder[]> {
    var status = OrderStatus.Completed;
    const rows = await Common.dbFetch(
      Order.ordersTableName,
      { user_id, status },
      ['id', 'status', 'user_id', 'created_at'],
    );
    return rows as IOrder[];
  }

  static async create(order: ICreateOrder): Promise<IOrder | null> {
    const insertQuery = await Common.dbInsertion(Order.ordersTableName, order);
    if (insertQuery && insertQuery.inserted) {
      const newOrder = insertQuery.data[0] as IOrder;
      return newOrder;
    } else {
      return null;
    }
  }

  static async completeOrder(id: number): Promise<boolean> {
    const updateQuery = await Common.dbUpdate(
      Order.ordersTableName,
      { status: OrderStatus.Completed },
      { id },
    );

    if (updateQuery && updateQuery.updated) {
      return true;
    }
    return false;
  }

  static async addOrderProduct(orderProduct: IAddOrderProduct) {
    const insertQuery = await Common.dbInsertion(
      Order.orderProductsTableName,
      orderProduct,
    );
    if (insertQuery && insertQuery.inserted) {
      const newOrder = insertQuery.data[0] as IOrder;
      return newOrder;
    } else {
      return null;
    }
  }

  static async getOrderProducts(order_id: number): Promise<IOrderProduct[]> {
    const rows = await Common.dbFetch(Order.orderProductsTableName, {
      order_id,
    });
    return rows as IOrderProduct[];
  }
}

export default Order;
