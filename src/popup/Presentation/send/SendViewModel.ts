import { useState } from "react";
import BaseService from "../../../../services/axios";
import { SendRepository } from "../../Domain/Repository";
import { IWallet } from "../../Domain/Repository/SendRepository";

const axiosClient = new BaseService();

export const useSendModel = () => {
  const [assetValue, setAssetValue] = useState<string>("0");
  const [recipient, setRecipient] = useState<string>("");
  const [recipientAccount, setRecipientAccount] = useState<IWallet | null>(null);

  const fetchRecipientAccount = async () => {
    if (recipient) {
      const res = await SendRepository(axiosClient).getRecipientAccount({ address: recipient });
      if (res) {
        setRecipientAccount(res);
      }
    } else {
      setRecipientAccount(null);
    }
  };

  return {
    assetValue,
    setAssetValue,
    recipient,
    setRecipient,
    recipientAccount,
    fetchRecipientAccount,
  };
};
