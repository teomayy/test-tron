export interface ICallbackSender {
  send(url: string, payload: Record<string, any>): Promise<void>;
}
