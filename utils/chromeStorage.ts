import { decrypt, encrypt } from '@metamask/browser-passworder'
import sha256 from 'crypto-js/sha256'
import { TokenFile } from './mapChains'

interface Storage {
  pwdHash: Array<number>
  mnemonic: string
}

export const storeListNFTLocalId = async (listNFTLocalId: string[]): Promise<void> => {
  await chrome.storage.local.set({ listNFTLocalId })
}

export async function getData(key: string) {
  const data = await chrome.storage.local.get([key])
  return data[key]
}

export const setListExploreItemBookmarkedId = async (listExploreItemBookmarkedId: string[]) => {
  await chrome.storage.local.set({ listExploreItemBookmarkedId })
}

export async function storeTutorialStep(storeTutorialStep) {
  await chrome.storage.local.set({ storeTutorialStep: storeTutorialStep })
}

export async function storeStashPage(storeStashPage) {
  await chrome.storage.local.set({ storeStashPage: storeStashPage })
}

export async function storeMantra(mantra) {
  await chrome.storage.local.remove('storeMantra')
  await chrome.storage.local.set({ storeMantra: mantra })
}

export async function storeLink(links) {
  await chrome.storage.local.set({ links: links })
}

export async function storeTimeZone(timeZone) {
  await chrome.storage.local.set({ timeZone: timeZone })
}

export async function storeTimeFormat(timeFormat) {
  await chrome.storage.local.set({ timeFormat: timeFormat })
}

export async function storeAccount(account) {
  await chrome.storage.local.set({ account: account })
}

export async function storeLensProfile(data) {
  await chrome.storage.local.set({ lensProfile: data })
}

export async function removeSignature() {
  await chrome.storage.local.remove(['timeless'])
}

export async function initEncryptStorage(password: string) {
  const secrets = { pwdHash: sha256(password), mnemonic: '' }
  const data = await encrypt(password, secrets)
  await chrome.storage.local.set({ encryptedBlob: data })
}

export async function hadEncryptStorage() {
  const encryptedBlob = await getData('encryptedBlob')
  return encryptedBlob !== undefined
}

export async function validatePassword(password: string) {
  const pwdHash = sha256(password)
  const blob = await getData('encryptedBlob')
  try {
    const storage = (await decrypt(password, blob)) as Storage
    return JSON.stringify(storage.pwdHash) === JSON.stringify(pwdHash)
  } catch (error) {
    return false
  }
}

export async function storeMnemonic(privateKey: string, password: string) {
  const encryptedBlob = await getData('encryptedBlob')
  const storage = (await decrypt(password, encryptedBlob)) as Storage
  storage.mnemonic = privateKey
  const data = await encrypt(password, storage)
  await chrome.storage.local.set({ encryptedBlob: data })
}

export async function getMnemonic(password: string) {
  const encryptedBlob = await getData('encryptedBlob')
  const storage = (await decrypt(password, encryptedBlob)) as Storage
  return storage.mnemonic
}

export async function lockWallet() {
  await chrome.storage.local.set({ lockWallet: true })
}

export async function login() {
  await chrome.storage.local.set({ isLoggedIn: true })
}

async function keepTour(res) {
  if (res && res.steps) {
    await chrome.storage.local.set({ storeTutorialStep: { steps: res.steps } })
  }
}

export async function logout(password: string | undefined) {
  const tutorialStep = await getData('storeTutorialStep')
  localStorage.clear()
  await chrome.storage.local.clear()
  await chrome.storage.local.set({ isLoggedIn: false })
  await keepTour(tutorialStep)

  /** Keep setIsFirstTimeOpen equal 'false' when user logout
   * If first time user install extension => setIsFirstTimeOpen equal 'true' in CautionView.tsx
   */
  await setIsFirstTimeOpen(false)
  /** */

  if (password) await initEncryptStorage(password)
  const account = await chrome.storage.local.get('account')
  return Object.keys(account).length === 0 ? true : false
}

export async function storeTokenSetting(listToken: TokenFile[]) {
  await chrome.storage.local.set({ tokenSetting: JSON.stringify(listToken) })
}

export async function setTelegramLoggedIn(flag: boolean) {
  await chrome.storage.local.set({ tTelegram: flag })
}

export async function setChain(chain) {
  await chrome.storage.local.set({ tChain: JSON.stringify(chain) })
}

export async function setIsFirstTimeOpen(isFirstTimeOpen: boolean) {
  await chrome.storage.local.set({ isFirstTimeOpen })
}
