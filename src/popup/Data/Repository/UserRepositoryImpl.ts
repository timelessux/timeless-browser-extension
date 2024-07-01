import { EProvider, ETypeProfile } from "../../../../ts";
import { GraphQLResponse, WalletConnectResponse } from "../../Domain/Model";
import { ChallengeResponse } from "../../Domain/Model/Auth";
import { ListProfileResponse, Profile } from "../../Domain/Model/Profile";
import type { Token, UserRepository } from "../../Domain/Repository/UserRepository";
import { UserDataSource } from "../DataSource/UserDataSource";

export class UserRepositoryImpl implements UserRepository {
  dataSource: UserDataSource;

  constructor(dataSource: UserDataSource) {
    this.dataSource = dataSource;
  }

  createChangeProfileManagersTypedData(): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.dataSource.createChangeProfileManagersTypedData()
  }

  getAuthChalenge(address: string, profileId: string): Promise<GraphQLResponse<ChallengeResponse>> {
    return this.dataSource.getAuthChalenge(address, profileId);
  }

  getLeaderboards(
    provider: EProvider,
    type: ETypeProfile
  ): Promise<GraphQLResponse<ListProfileResponse>> {
    return this.dataSource.getLeaderboards(provider, type);
  }

  getProfileByHandles(handle: string): Promise<GraphQLResponse<Array<Profile>>> {
    return this.dataSource.getProfileByHandles(handle);
  }

  unfollow(profileId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.dataSource.unfollow(profileId);
  }

  follow(profileId: string): Promise<GraphQLResponse<WalletConnectResponse>> {
    return this.dataSource.follow(profileId);
  }

  getProfile(address: string): Promise<GraphQLResponse<ListProfileResponse>> {
    return this.dataSource.getProfile(address);
  }

  async authenticateWithLens(signature: string, address: string, authId: string): Promise<Token | null> {
    return await this.dataSource.authenticateWithLens(signature, address, authId);
  }

  async refreshToken(token: Token): Promise<Token | null> {
    return await this.dataSource.refreshToken(token);
  }
  async login(username: string, password: string): Promise<Token | null> {
    return await this.dataSource.login(username, password);
  }
}
