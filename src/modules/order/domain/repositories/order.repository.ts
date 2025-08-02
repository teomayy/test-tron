import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  findByAddress(address: string): Promise<Order | null>;
  markAsPaid(orderId: number): Promise<void>;
}
