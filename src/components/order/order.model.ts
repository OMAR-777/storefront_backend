import Common from '../../utils/common';
import { ICreateOrder, IOrder } from './order.interfaces';

class Order {
  static tableName = 'orders';

  static async findOneById(id: number): Promise<IOrder | null> {
    const rows = await Common.dbFetch(Order.tableName, { id });
    if (rows?.length) {
      const order = rows[0] as IOrder;
      return order;
    } else {
      return null;
    }
  }

  static async findOneByName(name: string): Promise<IOrder | null> {
    const rows = await Common.dbFetch(Order.tableName, { name });
    if (rows?.length) {
      return rows[0] as IOrder;
    } else {
      return null;
    }
  }

  static async findAll(): Promise<IOrder[]> {
    const rows = await Common.dbFetch(Order.tableName, null, [
      'id',
      'status',
      'user_id',
      'created_at',
    ]);
    return rows as IOrder[];
  }

  static async create(order: ICreateOrder): Promise<IOrder | null> {
    const insertQuery = await Common.dbInsertion(Order.tableName, order);
    if (insertQuery && insertQuery.inserted) {
      const newOrder = insertQuery.data[0] as IOrder;
      return newOrder;
    } else {
      return null;
    }
  }
}

export default Order;
