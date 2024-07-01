export interface IWallet {
  address: string;
  defaultProfile: {
    avatar: string;
    name: string;
  };
}

export interface SendRepository {
  getRecipientAccount({ address }: { address: string }): Promise<IWallet>;
}
