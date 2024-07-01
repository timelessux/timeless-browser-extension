import { ESizeImage } from '../ts/index'

export function getIpfsData(key: string) {
  return `https://ipfs.io/ipfs/${key.slice(7)}`
}

export function getArData(key: string) {
  return `https://arweave.net/${key.slice(5)}`
}

export function isValidString(str, compareString?: string) {
  if (typeof str !== 'string') return false
  if (str.trim().length === 0) return false
  if (compareString && str.trim() === compareString.trim()) return false
  return true
}

export function isValidIpfsString(str: string) {
  const urlPattern = new RegExp('^ipfs:\\/\\/')
  return !!urlPattern.test(str)
}

export function isValidHttpString(str: string) {
  if (!str || typeof str !== 'string' || str.length < 8) return false

  return str.startsWith('https://') || str.startsWith('http://')
  // const urlPattern = new RegExp(
  //   "^(http(s)?:\\/\\/)[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/+,;=.]+"
  // );
  // return !!urlPattern.test(str);
}

export function isValidArString(str: string) {
  if (!str || typeof str !== 'string' || str.length < 8) return false

  return str.startsWith('ar://')
  // const urlPattern = new RegExp(
  //   "^(http(s)?:\\/\\/)[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/+,;=.]+"
  // );
  // return !!urlPattern.test(str);
}

export function reformatToValidLink(link): string | undefined {
  if (isValidHttpString(link)) {
    return link
  }
  if (isValidIpfsString(link)) {
    return getIpfsData(link)
  }
  if (isValidArString(link)) {
    return getArData(link)
  }

  return link
}

export function isValidHttpUrl(string: string) {
  try {
    const newUrl = new URL(string)
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:'
  } catch (err) {
    return false
  }
}

export function returnImageUrl({
  previews,
  original,
  size
}: {
  previews: {
    imageLargeUrl: string | null
    imageMediumUrl: string | null
    imageSmallUrl: string | null
    imageOpengraphUrl: string | null
    predominantColor: string | null
    blurhash: string | null
  }
  original: string | null
  size?: ESizeImage
}): string | null {
  if (size === ESizeImage.SMALL) {
    if (previews.imageSmallUrl) return previews.imageSmallUrl
    return original
  }
  if (size === ESizeImage.MEDIUM) {
    if (previews.imageMediumUrl) return previews.imageMediumUrl
    return original
  }
  if (size === ESizeImage.LARGE) {
    if (previews.imageLargeUrl) return previews.imageLargeUrl
    return original
  }
  if (!size) {
    return original
  }
  return null
}

export const getUrlFromString = (inputString: string) => {
  const params = new URLSearchParams(inputString.split('?')[1])
  const encodedUrl = params.get('url')
  if (encodedUrl) {
    const decodedUrl = decodeURIComponent(encodedUrl)
    return decodedUrl
  }
  return ''
}
