import {
  CommunityTag,
  CommunityTagRepository,
} from "../../Domain/Repository/CommunityTagRepository";
import { CommunityTagDataSource } from "../DataSource/DataSource";

export class CommunityTagRepositoryImpl implements CommunityTagRepository {
  private communityTagDataSource: CommunityTagDataSource;
  constructor(_communityTagDataSource: CommunityTagDataSource) {
    this.communityTagDataSource = _communityTagDataSource;
  }
  getCommunityTags(): Promise<CommunityTag[]> {
    return this.communityTagDataSource.getCommunityTags();
  }
}
