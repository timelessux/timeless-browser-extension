import { ProfileAttribute } from '../Model/Profile'

export interface TimelessProfile {
  id: string | null
  provider: string | null
  handle: string | null
  name: string | null
  owner_address: string | null
  bio: string | null
  description: string | null
  avatar: string | null
  cover_avatar: string | null
  original_url: string | null
  attributes: Array<ProfileAttribute> | null
}

export interface InternalProfileRepository {
  getInternalProfiles(): Promise<Array<TimelessProfile>>
}
