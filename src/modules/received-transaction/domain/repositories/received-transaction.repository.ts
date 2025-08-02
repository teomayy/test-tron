export interface ReceivedTransactionCreateInput {
  txHash: string;
  tronAddress: string;
  sender: string;
  amount: number;
  confirmed?: boolean;
}

export interface IReceivedTransactionRepository {
  save(data: ReceivedTransactionCreateInput): Promise<void>;
  exists(txHash: string): Promise<boolean>;
}
