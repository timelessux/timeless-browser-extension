import moment from 'moment-timezone'

export function cutMessage(message: string) {
  if (message.length > 20) return `${message.slice(0, 20)}...`
  return message
}

export const calculateTimeDifference = (inputTimeISO: string) => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return moment.tz(inputTimeISO, tz).fromNow()
}

export function htmlToString(html: string): string {
  const r1 = html?.replace(/</g, '&lt;')
  return r1?.replace(/>/g, '&gt;')
}

export function breakLineConvert(str: string) {
  return str.replace(/\n/g, '<br>')
}

export function changePrice({ input, range }: { input: number; range: number }) {
  return input * range
}

export function cutAddress({ address }: { address: string }) {
  if (address && address.length >= 42) return `${address.slice(0, 7)}...${address.slice(-5)}`
  return `0x00...`
}

export function numberFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const cstRegex = /\B(?=(\d{3})+(?!\d))/g
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value)

  if (item) {
    const formattedNum = (num / item.value).toFixed(digits).replace(rx, '$1')
    if (num >= 1000 && num < 10000) {
      return num.toString().replace(cstRegex, ',')
    } else {
      return formattedNum.replace(cstRegex, ',') + item.symbol
    }
  } else {
    return '0'
  }
}

export function convertMentionToLink(content: string) {
  if (content) {
    const listMention = content.match(/(^|\s)@\S+[a-z0-9A-Z]/gm)
    const listTag = content.match(/(^|\s)#\S+[a-z0-9A-Z]/gm)
    let ds = content

    const listFilterMention = listMention?.filter((value, index) => {
      return listMention?.indexOf(value) === index
    })
    listFilterMention?.forEach((item) => {
      ds = ds.replace(item.trim(), `[${item.trim()}](/${item.trim()})`)
    })

    listTag?.forEach((item) => {
      ds = ds.replace(item.trim(), `[${item.trim()}](#) `)
    })
    return ds
  }
  return content
}

export function formatPostContent(text: string) {
  const twitterUrlRegex = /(https:\/\/twitter\.com\/\w+\/status\/\d+)/
  const snapshotUrlRegex = /(https?:\/\/snapshot\.org[^\s]+)/g

  const twiiterMatches = text.match(twitterUrlRegex)
  const snapshotMatches = text.match(snapshotUrlRegex)

  const twitterUrlArr = twiiterMatches ? twiiterMatches[0].split('/') : null
  const snapshotUrlArr = snapshotMatches ? snapshotMatches[0].split('/') : null

  const content = text.replace(twitterUrlRegex, '')

  return {
    snapshotId: snapshotUrlArr ? snapshotUrlArr[snapshotUrlArr.length - 1] : null,
    tweetId: twitterUrlArr ? twitterUrlArr[twitterUrlArr.length - 1] : null,
    content
  }
}

export function getShortAddress(address: string) {
  if (address.length < 13) {
    // 6 char + ... + 4 char
    return address
  }
  const startChar = address.slice(0, 6)
  const endChat = address.slice(-4)

  return startChar.concat('...', endChat)
}

export const formatKMB = (n: number) => {
  if (n < 1e3) return n
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
}

export const getAvatarByAddress = (address: string) => {
  return `https://cdn.stamp.fyi/avatar/${address}`
}

export const convertContractToAddressAndChain = (contract: string | undefined) => {
  if (!contract) return { chainID: null, address: null }

  const newArray = contract.split(':')
  return { chainID: newArray[0], address: newArray[1] }
}

export const convertBalance = (balance: string) => {
  const arr = balance.split('.')
  if (arr.length > 1) {
    const decimalVal = arr[1].slice(0, 5)
    return Number(`${arr[0]}.${decimalVal}`).toFixed(5)
  }

  return Number(arr[0]).toFixed(5)
}

export const randomImage = (listImage: string[]): string => {
  if (
    !listImage ||
    listImage.length === 0 ||
    listImage.some((item) => item == undefined || item == null)
  ) {
    return ''
  }

  const randomIndex = Math.floor(Math.random() * listImage.length)
  return listImage[randomIndex]
}

export const dummyImage = [
  'https://res.cloudinary.com/timeless/image/upload/story-protocol-testing/img-1.svg',
  'https://res.cloudinary.com/timeless/image/upload/story-protocol-testing/img-2.svg',
  'https://res.cloudinary.com/timeless/image/upload/story-protocol-testing/img-3.svg'
]

export function capitalizeTitle(title: string) {
  const smallWords = /^(for|of|is)$/i

  return title
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !smallWords.test(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      } else {
        return word.toLowerCase()
      }
    })
    .join(' ')
}

export function formatBalance(input: string) {
  const str = Number(input).toFixed(7)
  const parts = str.split('.')

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return parts.join('.')
}

export function convertChainName(mainString: string, subString: string, isCheck: boolean) {
  const result = mainString.split(subString).join('')
  if (result.trim().length === 0 && isCheck) {
    return mainString
  }
  return result
}
