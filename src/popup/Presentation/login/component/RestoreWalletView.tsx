import { validateMnemonic } from '@scure/bip39'
import React, { useEffect, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { BsKey } from 'react-icons/bs'
import { IoIosWarning } from 'react-icons/io'
import { formatEther } from 'viem'
import { english } from 'viem/accounts'
import { mainnet } from 'wagmi/chains'
import { storeAccount, storeMnemonic } from '../../../../../utils/chromeStorage'
import { getChain } from '../../../../../utils/mapChains'
import { setLoggedIn } from '../../../../../utils/token'
import { EOAWallet } from '../../../../../utils/wallet'
import { LensLogo } from '../../../assets/icons/lensLogo'
import { usePageLoading } from '../../../context/LoadingContext'
import { useWallet } from '../../../context/WalletContext'
import { useAppDispatch } from '../../../redux/hook'
import { setWallet } from '../../../redux/slices/wallet/wallet.slice'
import CustomPicker from '../../component/CustomPicker'
import useLoginModelController from '../hook/useLoginModelController'
import { IoArrowBackCircleOutline } from 'react-icons/io5'

interface PhraseProps {
  index: number
  mnemonic: Array<string>
  mnemonicLength: number
  setMnemonic: React.Dispatch<React.SetStateAction<string[]>>
  latestSeen: number | null
  setLatestSeen: React.Dispatch<React.SetStateAction<number | null>>
}

function Phrase({
  index,
  mnemonic,
  setMnemonic,
  mnemonicLength,
  latestSeen,
  setLatestSeen
}: PhraseProps) {
  const [data, setData] = useState<string>(mnemonic[index])

  useEffect(() => {
    setData(mnemonic[index])
  }, [mnemonic])

  return (
    <div className="col-3">
      <div className="word-item-wrapper d-flex align-items-center">
        <div className="number ms-2">{index + 1}</div>
        <input
          value={data}
          type={latestSeen === index ? 'text' : 'password'}
          className="input-text ms-1 me-1"
          style={{ flex: 3 }}
          onPaste={(event) => {
            event.preventDefault()
            const mnemonicCopy = event.clipboardData.getData('Text')
            const phrase = mnemonicCopy.split(' ').map((str) => str.replace(/[\s\n\t]/g, ''))

            if (phrase.length === 1) {
              const mnemonicClone = [...mnemonic]
              mnemonicClone.splice(index, 1, phrase[0])
              setMnemonic(mnemonicClone)
            }
            if (phrase.length === mnemonicLength) setMnemonic([...phrase])
          }}
          onChange={(event) => {
            event.preventDefault()
            let tempValue = ''
            if (event.target.value.includes(' ')) {
              tempValue = event.target.value.trim().split(' ')[0]
            } else {
              tempValue = event.target.value.replace(/\s/g, '')
            }
            setData(tempValue)
            const mnemonicClone = [...mnemonic]
            mnemonicClone.splice(index, 1, tempValue)
            setMnemonic(mnemonicClone)
          }}
        />
        <div
          className="mb-1 cursor-pointer"
          onClick={() => {
            if (latestSeen === index) {
              setLatestSeen(null)
            } else {
              setLatestSeen(index)
            }
          }}
          style={{ flex: 1 }}
        >
          {latestSeen === index ? <AiOutlineEye size={16} /> : <AiOutlineEyeInvisible size={16} />}
        </div>
      </div>
    </div>
  )
}

export function RestoreWallet({ goBack, password }: { goBack: () => void; password: string }) {
  const dispatch = useAppDispatch()
  const { initPublicClient, getAccount, initWalletClient } = useWallet()

  const [mnemonicLength, setMnemonicLength] = useState(12)
  const [mnemonic, setMnemonic] = useState<string[]>(Array(mnemonicLength).fill(''))
  const [latestSeen, setLatestSeen] = useState<number | null>(null)

  const [isValid, setValid] = useState<boolean>()

  const { openMessage, destroyMessage } = usePageLoading()
  const { createSiweMessage } = useLoginModelController()

  useEffect(() => {
    if (!mnemonic.every((item) => item === '')) {
      const phrase = mnemonic.join(' ')
      const isValid = validateMnemonic(phrase, english)
      if (isValid) {
        setValid(isValid)
      } else {
        setValid(false)
      }
    }
  }, [mnemonic])

  useEffect(() => {
    if (isValid) openMessage('success', 'Valid Passphrase')
  }, [isValid])

  const onClickContinue = async () => {
    openMessage('loading', 'Checking...')
    setValid(undefined)
    const client = await initPublicClient(mainnet)
    const privateKey = mnemonic.join(' ')
    const account = getAccount(privateKey)
    const ensName = await client.getEnsName({ address: account.address })
    const balance = await client.getBalance({ address: account.address })

    const siweMessage = createSiweMessage(account.address)
    const walletClient = await initWalletClient(mainnet, account)

    const signature = await walletClient.signMessage({ account: account, message: siweMessage })

    const walletData = {
      account: account,
      ensName: ensName,
      chain: await getChain(mainnet.id),
      balance: Number(formatEther(balance)).toFixed(3),
      avatar: ensName ? await client.getEnsAvatar({ name: ensName }) : '',
      siweMessage: siweMessage.replace(/\n/g, '\\n'),
      signature: signature
    }

    storeAccount(walletData)
    const wallet = new EOAWallet(
      account,
      ensName || undefined,
      ensName ? (await client.getEnsAvatar({ name: ensName })) || undefined : ''
    )

    dispatch(setWallet({ wallet: wallet }))
    storeMnemonic(privateKey, password)
    await setLoggedIn(true)
    destroyMessage()
    openMessage('success', 'Redirect to dashboard')
  }

  return (
    <div className="ctn-restore-wallet">
      <button className="back-button mb-4" onClick={goBack}>
        <IoArrowBackCircleOutline size={40} />
      </button>
      {!isValid && isValid === false && (
        <div className="position-absolute invalid-mnemonic pe-2 ps-3 d-flex align-items-center fade-in">
          <div className="d-flex align-items-center gap-2">
            <BsKey color="#FFD60A" className="key-icon" size={24} />
            <span className="title">Invalid Passphrase</span>
            <span className="sub-title">Double check and retry</span>
            <button
              className="re-enter-button py-2 px-3 d-flex align-items-center hover"
              onClick={() => {
                setMnemonic(Array(mnemonicLength).fill(''))
                setValid(undefined)
              }}
            >
              Re-enter
            </button>
          </div>
        </div>
      )}
      <div className="d-flex flex-row">
        <div className="indicator " />
        <div className="indicator indicator-active" />
        <div className="indicator" />
        <div className="indicator" />
      </div>
      <div className="title">Restore wallet</div>
      <div className="description mt-3">
        {`Enter each of the ${mnemonicLength} words from your recovery phrase separated by a space`}
      </div>
      <CustomPicker
        className="mb-4"
        initialValue={mnemonicLength}
        data={[12, 18, 24]}
        onChange={(value) => {
          setMnemonic(Array(value).fill(''))
          setMnemonicLength(value)
          setValid(undefined)
          setLatestSeen(null)
        }}
      />
      <div className="action-wrapper">
        <div className="restore-information d-flex flex-column align-items-center justify-content-center">
          <LensLogo />
          <div className="title">Private Alpha Testing</div>
          <div className="desc">
            If interested, DM{' '}
            <a
              href="https://t.me/hochung"
              target="_blank"
              style={{ color: 'white', textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
              rel="noreferrer"
            >
              @hochung
            </a>{' '}
            on Telegram
          </div>
        </div>
        <div className="list-word-restore">
          <div className="word-wrapper">
            {[...Array(mnemonicLength).keys()].map((item, index) => {
              return (
                <Phrase
                  key={index}
                  index={index}
                  mnemonic={mnemonic}
                  mnemonicLength={mnemonicLength}
                  setMnemonic={setMnemonic}
                  latestSeen={latestSeen}
                  setLatestSeen={setLatestSeen}
                />
              )
            })}
          </div>
        </div>
      </div>
      <div className="safer-warning d-flex mt-4">
        <div className="icon d-flex align-items-center justify-content-center">
          <IoIosWarning color="#DED2C2" size={26} />
        </div>
        <div className="ms-3 d-flex flex-column justify-content-center">
          <div className="title">Typing is safer</div>
          <div className="desc">
            You can paste your recovery phrases at once but typing individually is safer.
          </div>
        </div>
      </div>

      <button
        disabled={!isValid}
        style={{
          border: '1px solid rgba(255,255,255,0.04)',
          color: !isValid ? '#89857D' : '#358CEA'
        }}
        className="mt-2 btn-continue px-5 py-2"
        onClick={onClickContinue}
      >
        Continue
      </button>
    </div>
  )
}
