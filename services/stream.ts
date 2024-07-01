/* eslint-disable no-console */
import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
import { Duplex } from 'stream'
import { Runtime } from 'webextension-polyfill'

type Log = (data: unknown, out: boolean) => void

class PortDuplexStream extends Duplex {
  private _port: Runtime.Port

  private _log: Log

  /**
   * @param port - An instance of WebExtensions Runtime.Port. See:
   * {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/Port}
   */
  constructor(port: Runtime.Port) {
    super({ objectMode: true })
    this._port = port
    this._port.onMessage.addListener((msg: unknown) => this._onMessage(msg))
    this._port.onDisconnect.addListener(() => this._onDisconnect())
    this._log = () => null
  }

  /**
   * Callback triggered when a message is received from
   * the remote Port associated with this Stream.
   *
   * @param msg - Payload from the onMessage listener of the port
   */
  private _onMessage(msg: unknown): void {
    if (Buffer.isBuffer(msg)) {
      const data: Buffer = Buffer.from(msg)
      this._log(data, false)
      this.push(data)
    } else {
      this._log(msg, false)
      //@ts-ignore
      if (msg?.name !== 'publicConfig') this.push(msg)
    }
  }

  /**
   * Callback triggered when the remote Port associated with this Stream
   * disconnects.
   */
  private _onDisconnect(): void {
    // Handle chrome.runtime error
    chrome.runtime.lastError
    this.destroy()
  }

  /**
   * Explicitly sets read operations to a no-op.
   */
  _read(): void {
    return undefined
  }

  /**
   * Called internally when data should be written to this writable stream.
   *
   * @param msg - Arbitrary object to write
   * @param encoding - Encoding to use when writing payload
   * @param cb - Called when writing is complete or an error occurs
   */
  _write(msg: unknown, _encoding: BufferEncoding, cb: (error?: Error | null) => void): void {
    try {
      if (Buffer.isBuffer(msg)) {
        const data: Record<string, unknown> = msg.toJSON()
        data._isBuffer = true
        this._log(data, true)
        this._port.postMessage(data)
      } else {
        this._log(msg, true)
        this._port.postMessage(msg)
      }
    } catch (error) {
      return cb(new Error('PortDuplexStream - disconnected'))
    }
    return cb()
  }

  /**
   * Call to set a custom logger for incoming/outgoing messages
   *
   * @param log - the logger function
   */
  _setLogger(log: Log) {
    this._log = log
  }
}

export function mapMetaMaskId() {
  const userAgent = navigator.userAgent
  const isEdge = userAgent.indexOf('Edg') > -1
  return isEdge ? 'ejbalbakoplchlghecdalmeeeajnimhm' : 'nkbihfbeogaeaoehlefnkodbefgpgknn'
}

function createMetaMaskProvider() {
  const currentMetaMaskId = mapMetaMaskId()
  const metamaskPort = chrome.runtime.connect(currentMetaMaskId)
  const pluginStream = new PortDuplexStream(metamaskPort)
  const provider = new MetaMaskInpageProvider(pluginStream, {
    logger: {
      warn: () => null,
      error: () => null,
      log: console.log.bind(null),
      info: console.info.bind(null),
      debug: console.debug.bind(null),
      trace: console.trace.bind(null)
    }
  })
  return provider
}

export const metamaskProvider = createMetaMaskProvider()

const metamaskState = new Promise((resolve) => {
  metamaskProvider.on('_initialized', () => resolve(true))
  metamaskProvider.on('error', () => resolve(false))
})

export async function checkMMInstalled() {
  return await metamaskState
}
