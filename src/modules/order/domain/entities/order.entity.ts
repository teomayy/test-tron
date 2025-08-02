export class Order {
  constructor(
    public readonly id: number,
    public readonly status: string,
    public readonly amountExpected: number,
    public readonly callbackUrl?: string,
  ) {}

  isPaid(): boolean {
    return this.status === 'paid';
  }

  canBePaid(amount: number): boolean {
    return !this.isPaid() && amount >= this.amountExpected;
  }
}
