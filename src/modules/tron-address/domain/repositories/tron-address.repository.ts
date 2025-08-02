export interface TronAddressCreateInput {
  orderId: number;
  userId: number;
  address: string;
  privateKey: string;
  expiresAt: Date;
}

export interface ITronAddressRepository {
  save(data: TronAddressCreateInput): Promise<void>;
}
