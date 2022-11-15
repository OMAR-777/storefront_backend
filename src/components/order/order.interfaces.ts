export enum OrderStatus {
  Active = "Active",
  Completed = "Completed",
}

export interface IAddOrderProduct {
  order_id: number;
  product_id: number;
  quantity: number;
}

export interface IOrderProduct {
  product_id: number;
  quantity: number;
}

export interface ICreateOrder {
  user_id: number;
  status: OrderStatus
}

export interface IOrder {
  user_id: number;
  status: OrderStatus;
  orderProducts: IOrderProduct[];
  created_at: string;
}
