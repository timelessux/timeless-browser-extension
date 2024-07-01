export interface CommunityTag {
  createdAt?: string;
  description?: string;
  name: string;
  tag: string;
}

export interface CommunityTagRepository {
  getCommunityTags(): Promise<Array<CommunityTag>>;
}
