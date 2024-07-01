import FakeAvatar from '../../../assets/images/fakeAvatar2.png'
import FakeImagePost from '../../../assets/images/fakePostImage1.png'

export const fakeSocialPost = {
  __typename: 'Post',
  id: 'lens-0x01-0x02a0',
  collectCount: 61,
  dislikeCount: 0,
  likeCount: 6203,
  commentCount: 26,
  mirrorCount: 12,
  title: 'Post by @lensprotocol',
  content: 'ENFJ activist, founder 🧀📷',
  metadata_: {
    content: 'ENFJ activist, founder 🧀📷',
    external_url: 'https://hey.xyz/lensprotocol',
    image: FakeImagePost,
    name: 'Post by @lensprotocol',
    attributes: [],
    media: [
      {
        original: {
          item: FakeImagePost,
          cover: FakeImagePost,
          type: 'image/jpeg',
          altTag: null
        }
      }
    ],
    mainContentFocus: 'IMAGE'
  },
  media: [
    {
      altTag: null,
      cover: FakeImagePost,
      item: FakeImagePost,
      type: 'image/jpeg'
    }
  ],
  profile: {
    avatar: FakeAvatar,
    id: 'lens-0x01',
    name: 'Balajis',
    handle: 'balajis.eth',
    isFollowedByMe: false
  },
  createdAt: '2024-06-02T09:31:46+00:00',
  isCollectedByMe: true,
  isMirroredByMe: false,
  isReactedByMe: true,
  authorHandle: 'balajis.eth'
}
