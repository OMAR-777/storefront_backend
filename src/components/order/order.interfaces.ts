export enum OrderStatus {
  Active = "Active",
  Completed = "Completed",
}

export interface ICreateOrder {
  user_id: number;
  status: OrderStatus
}

export interface IAddOrderProduct {
  order_id: number;
  product_id: number;
  quantity: number;
}

export interface IOrder {
  id: number,
  user_id: number;
  status: OrderStatus;
  orderProducts: IOrderProduct[];
  created_at: string;
}

export interface IOrderProduct {
  id: number,
  product_id: number;
  quantity: number;
}
