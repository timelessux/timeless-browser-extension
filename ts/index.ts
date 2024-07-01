export enum EPage {
  DASHBOARD = 'dashboard',
  EXPLORE = 'explore',
  BUY = 'buy',
  SWAP = 'swap',
  BRIDGE = 'bridge',
  CHAT = 'chat',
  NOTIFICATION = 'notification',
  SETTING = 'settings',
  SEND = 'send',
  PASSWORD = 'password',
  SOCIAL = 'social',
  SOCIAL_COMMENT = 'social_comment',
  COLLECTION = 'collection',
  COLLECTION_DETAIL = 'collection-detail',
  DEFAULT = 'default',
  ARTICLE_LISTING_BY_TYPE = 'articleListingByType',
  ARTICLE_DETAIL = 'articleDetail',
  FARCASTER = 'farcaster',
  FARCASTER_COMMENT = 'farcaster_comment'
}

export enum EOs {
  WINDOW = 'window',
  MACOS = 'mac-os',
  UNIX = 'UNIX',
  LINUX = 'Linux'
}

export enum EModals {
  NETWORK_MODAL = 'network-modal',
  FULLSCREEN_MEDIA = 'fullscreen-media',
  POST_MODAL = 'post-modal',
  AUDIENCE_MODAL = 'audience-modal',
  TIMEZONE_MODAL = 'timezone-modal',
  ACCOUNT_MODAL = 'account-modal',
  CONFIRM_MODAL = 'confirm-modal',
  SHARE_MODAL = 'share-modal',
  REPLY_MODAL = 'reply-modal',
  BUY_MODAL = 'buy-modal',
  CREATE_EXPLORE_MODAL = 'create-explore-modal'
}

export enum ETypePost {
  FOR_YOU = 'FOR_YOU',
  FOLLOWING = 'FOLLOWING',
  POPULAR = 'POPULAR',
  ART = 'ART',
  ME = 'ME'
}

export enum EContentFocus {
  AUDIO = 'AUDIO',
  TEXT = 'TEXT_ONLY',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export enum EFullscreenMode {
  IMAGE = 'image',
  MODEL = 'model'
}

export enum ETraitType {
  QUOTED_PUBLICATION_ID = 'quotedPublicationId'
}

export enum EStatusReact {
  DONE = 'DONE',
  FAILED = 'FAILED',
  IN_PROGRESS = 'IN_PROGRESS',
  REJECTED = 'REJECTED'
}

export enum EReferenceModule {
  PUBLIC = 'PUBLIC',
  FOLLOWER_ONLY = 'FOLLOWER_ONLY',
  FOLLOWING = 'FOLLOWING',
  FRENS_OF_FRENS = 'FRENS_OF_FRENS',
  DISABLED = 'DISABLED'
}

export const RenderTitle: { [key in EReferenceModule]: string } = {
  [EReferenceModule.PUBLIC]: 'Everyone',
  [EReferenceModule.FOLLOWER_ONLY]: 'Your followers',
  [EReferenceModule.FOLLOWING]: 'People you follow',
  [EReferenceModule.FRENS_OF_FRENS]: 'Frens of frens',
  [EReferenceModule.DISABLED]: 'Disable comment'
}

export enum EMimeType {
  VIDEO_WEBM = 'VIDEO_WEBM',
  VIDEO_MP4 = 'VIDEO_MP4',
  VIDEO_X_MV4 = 'VIDEO_X_MV4-m4v',
  VIDEO_OGV = 'VIDEO_OGV',
  VIDEO_OGG = 'VIDEO_OGG',
  IMAGE_GIF = 'IMAGE_GIF',
  IMAGE_JPEG = 'IMAGE_JPEG',
  IMAGE_PNG = 'IMAGE_PNG',
  IMAGE_TIFF = 'IMAGE_TIFF',
  IMAGE_X_MS_BMP = 'IMAGE_X_MS_BMP-ms-bmp',
  IMAGE_SVG_XML = 'IMAGE_SVG_XML+xml',
  IMAGE_WEBP = 'IMAGE_WEBP',
  AUDIO_WAV = 'AUDIO_WAV',
  AUDIO_MPEG = 'AUDIO_MPEG',
  AUDIO_OGG = 'AUDIO_OGG',
  AUDIO_MP4 = 'AUDIO_MP4',
  AUDIO_ACC = 'AUDIO_ACC',
  AUDIO_WEBM = 'AUDIO_WEBM',
  AUDIO_FLAC = 'AUDIO_FLAC'
}

export enum EContentWaring {
  NSFW = 'NSFW',
  SENSITIVE = 'SENSITIVE',
  SPOILER = 'SPOILER'
}

export enum ETypeNoti {
  COMMENTS = 'comments',
  MENTIONS = 'mentions',
  MIRRORS = 'mirrors',
  COLLECTS = 'collects',
  LIKES = 'likes',
  POAP = 'poap',
  POAP_MINTED = 'poap_minted',
  REMINDER = 'reminder'
}

export enum ESizeImage {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

export enum EProvider {
  LENS = 'LENS',
  CYBER_CONNECT = 'CYBER_CONNECT',
  ALL = 'ALL'
}

export enum ETypeProfile {
  INFLUENCER = 'INFLUENCER'
}

export enum ELoginState {
  WARNING = 'WARNING',
  WALLET_CONNECT = 'WALLET_CONNECT',
  RESTORE_WALLET = 'RESTORE_WALLET',
  PASSWORD = 'PASSWORD',
  DASHBOARD = 'DASHBOARD',
  LOCK = 'LOCK'
}
