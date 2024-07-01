import { IWallet, SendRepository } from "../../Domain/Repository/SendRepository";
import { SendDataSource } from "../DataSource/DataSource";

export class SendRepositoryImpl implements SendRepository {
  private sendDataSource: SendDataSource;
  constructor(_sendDataSource: SendDataSource) {
    this.sendDataSource = _sendDataSource;
  }
  getRecipientAccount({ address }: { address: string }): Promise<IWallet> {
    return this.sendDataSource.getRecipientAccount({ address });
  }
}
