import { EProvider, ETypeProfile } from "../../../../ts";
import { GraphQLResponse, WalletConnectResponse } from "../Model";
import { ChallengeResponse } from "../Model/Auth";
import { ListProfileResponse, Profile } from "../Model/Profile";

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export interface UserRepository {
  login(username: string, password: string): Promise<Token | null>;
  refreshToken(token: Token): Promise<Token | null>;
  getAuthChalenge(address: string, profileId: string): Promise<GraphQLResponse<ChallengeResponse>>;
  authenticateWithLens(signature: string, address: string, authId: string): Promise<Token | null>;
  getProfile(address: string): Promise<GraphQLResponse<ListProfileResponse>>;
  follow(profileId: string): Promise<GraphQLResponse<WalletConnectResponse>>;
  unfollow(profileId: string): Promise<GraphQLResponse<WalletConnectResponse>>;
  getProfileByHandles(handle: string): Promise<GraphQLResponse<Array<Profile>>>;
  getLeaderboards(provider: EProvider, type: ETypeProfile): Promise<GraphQLResponse<ListProfileResponse>>;
  createChangeProfileManagersTypedData(): Promise<GraphQLResponse<WalletConnectResponse>>
}
