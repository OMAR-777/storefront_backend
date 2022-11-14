enum OrderStatus {
  Active = "Active",
  Completed = "Completed",
}

interface IOrderItem {
  product_id: number;
  quantity: number;
}

export interface ICreateOrder {
  user_id: number;
  orderItems: IOrderItem[];
}

export interface IOrder {
  user_id: number;
  status: OrderStatus;
  orderItems: IOrderItem[];
  created_at: string;
}
