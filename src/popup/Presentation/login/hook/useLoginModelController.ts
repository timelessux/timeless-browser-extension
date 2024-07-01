import BaseService from "../../../../../services/axios";
import { storeLensProfile } from "../../../../../utils/chromeStorage";
import { walletConnectWrapper } from "../../../../../utils/function";
import { getToken } from "../../../../../utils/token";
import { UserDataSource } from "../../../Data/DataSource/UserDataSource";
import { UserRepositoryImpl } from "../../../Data/Repository/UserRepositoryImpl";
import { Token } from "../../../Domain/Repository/UserRepository";

export default function useLoginModelController() {
  const axiosClient = new BaseService();
  const dataSource = new UserDataSource(axiosClient);
  const userRepository = new UserRepositoryImpl(dataSource);
  const { VITE_APP_URI, VITE_EXTENSION_ID } = import.meta.env;

  const login = async (username: string, password: string): Promise<Token | null> => {
    return await userRepository.login(username, password);
  };

  const refreshToken = async (): Promise<Token | null> => {
    const token = await getToken();
    return await userRepository.refreshToken(token);
  };

  function createSiweMessage(address) {
    const issued_at = new Date();
    const message = `${VITE_EXTENSION_ID} wants you to sign in with your Ethereum account:\n${address}\n\nSign in to Ethereum\n\nURI: ${VITE_APP_URI}\nVersion: 1\nChain ID: 1\nNonce: timelesswallet\nIssued At: ${issued_at.toISOString()}`;

    return message;
  }

  const getAuthChalenge = async (address, profileId) => {
    const res = await userRepository.getAuthChalenge(address, profileId)
    if (!res.data) return null
    return res.data["getAuthChallenge"];
  };

  const authenticateWithLens = async (
    signature: string,
    address: string,
    authId: string
  ): Promise<Token | null> => {
    const token = await userRepository.authenticateWithLens(signature, address, authId);
    return token;
  };

  const saveLensProfile = async (address: string) => {
    const response = await userRepository.getProfile(address);
    if (response.errors) {
      console.log("Get Lens Profile failed: ", response.errors[0].message);
    }

    if (response.data) {
      const lensProfile = response.data["getWallet"].profiles.filter(
        (pro) => pro.type === "LENS"
      )[0];
      await storeLensProfile(lensProfile);
    }
  };

  const getProfiles = async (address) => {
    const res = await userRepository.getProfile(address)
    if (!res.data) return null
    return res.data["getWallet"].profiles
  }

  const createChangeProfileManagersTypedData = async () => {
    const res = await walletConnectWrapper(userRepository.createChangeProfileManagersTypedData(), "createChangeProfileManagerTypedData")
    if (!res.data) return null
    return res.data["createChangeProfileManagerTypedData"]
  }

  return {
    login,
    refreshToken,
    createSiweMessage,
    getAuthChalenge,
    authenticateWithLens,
    saveLensProfile,
    getProfiles,
    createChangeProfileManagersTypedData
  };
}
