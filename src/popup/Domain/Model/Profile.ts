export interface ProfileAttribute {
  traitType?: string;
  displayType?: string;
  value?: string;
  key?: string;
}

export interface Wallet {
  totalFollowers: number;
  totalFollowings: number;
}

export interface Profile {
  attributes?: ProfileAttribute[];
  avatar?: string;
  bio?: string;
  coverAvatar?: string;
  createdAt?: string;
  deleted?: boolean;
  handle?: string;
  id?: string;
  isDefault?: boolean;
  isFollowedByMe?: boolean;
  isProviderDefault?: boolean;
  name?: string;
  originalUrl?: string;
  ownerAddress?: string;
  totalCollects?: number;
  totalFollowers?: number;
  totalPosts?: number;
  totalPublications?: number;
  type?: string;
  updatedAt?: string;
  wallet?: Wallet;
}

export interface ListProfileResponse {
  profiles: Array<Profile>;
}
