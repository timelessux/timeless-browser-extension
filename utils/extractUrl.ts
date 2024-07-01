export function getDomainName(url) {
  try {
    const urlObj = new URL(url)
    let domain = urlObj.hostname
    if (domain.startsWith('www.')) {
      domain = domain.substring(4)
    }
    return domain
  } catch (e) {
    return e.toString()
  }
}
