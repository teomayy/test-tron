export class GenerateAddressCommand {
  constructor(
    public readonly orderId: number,
    public readonly userId: number,
    public readonly ttlMinutes: number,
  ) {}
}
