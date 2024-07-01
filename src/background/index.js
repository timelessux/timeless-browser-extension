/* eslint-disable no-undef */
chrome.action.onClicked.addListener(async () => {
  chrome.tabs.create({ url: 'src/index.html' })
})

let unlock = true
let password = ''
let wallet
let chain
let weather

const { VITE_WEATHER_KEY, VITE_WEATHER_API } = import.meta.env

const getWeather = async ({ lat, long }) => {
  try {
    const res = await fetch(
      `${VITE_WEATHER_API}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${VITE_WEATHER_KEY}`
    )
    return await res.json()
  } catch (error) {
    // console.log(error)
  }
}

chrome.runtime.onMessage.addListener(function ({ type, ...params }, _, sendResponse) {
  switch (type) {
    case 'updateLockStatus':
      unlock = params.unlock
      break
    case 'checkUnlockStatus':
      if (wallet) {
        sendResponse({
          unlock: unlock,
          wallet: wallet,
          password: password,
          chain: chain
        })
      } else {
        sendResponse({
          unlock: false,
          wallet: wallet,
          password: password,
          chain: chain
        })
      }
      break
    case 'updateWallet':
      wallet = params.wallet
      break
    case 'updateChain':
      chain = params.chain
      break
    case 'updatePassword':
      password = params.password
      break
    case 'getWeather':
      if (!weather) {
        getWeather({
          lat: params.position.latitude,
          long: params.position.longitude
        }).then((res) => {
          weather = res
          chrome.runtime.sendMessage({
            type: 'weather',
            weather: res
          })
        })
      } else sendResponse({ weather })
      break
    default:
      break
  }
})
