import React, { Fragment, useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { isAddress, parseEther } from 'viem'
import { useEstimateFeesPerGas } from 'wagmi'
import { HexString, TToken } from '../../../../ts/types'
import { changePrice, cutAddress, formatBalance } from '../../../../utils/textConvert'
import { _getTokenBalance } from '../../../../utils/w3'
// import { ArrowDownCircleIcon } from '../../assets/icons/arrowDownCircle'
import { usePageLoading } from '../../context/LoadingContext'
import { getWalletBalanceAction } from '../../redux/slices/wallet/wallet.slice'
import BoxContent from '../component/BoxContent'
import SelectCustom from '../component/SelectCustom'
import { useData } from '../hook/useData'
import useGetPrice from '../hook/useGetPrice'
import { useGetTokenJson } from '../hook/useGetTokenJson'
import { useSendModel } from './SendViewModel'

const SendView = () => {
  const dispatch = useDispatch()
  const { openMessage, destroyMessage } = usePageLoading()
  const { setAssetValue, setRecipient, recipient, assetValue, fetchRecipientAccount } =
    useSendModel()

  const { chainFrom, setChainFrom, wallet } = useData()
  const { getJsonToken } = useGetTokenJson({ chain: chainFrom })

  const { cryptoValue, getPriceUsdByToken } = useGetPrice()

  const [total, setTotal] = useState<number>(0)
  const [findToken, setFindToken] = useState<TToken | null>(null)
  const [tokens, setTokens] = useState<Array<TToken>>([])
  const [balanceData, setBalanceData] = useState<string>()
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false)
  const [txSuccess, setTxSuccess] = useState<boolean>(false)
  const [visibleTotal, setVisibleTotal] = useState<boolean>(false)
  const [recipientWaring, setRecipientWaring] = useState<string>('')

  const { data: FeeData } = useEstimateFeesPerGas({ formatUnits: 'ether', chainId: chainFrom?.id })

  useEffect(() => {
    if (!loadingTransaction) destroyMessage()
  }, [loadingTransaction])

  useEffect(() => {
    setAssetValue('0')
    const jsonToken: Array<TToken> = getJsonToken({ chainName: chainFrom?.name })

    if (jsonToken) {
      setTokens(jsonToken)
      getPriceUsdByToken(jsonToken[0].token_symbol, chainFrom!.id)
      setFindToken(jsonToken[0])
    }
  }, [chainFrom])

  useEffect(() => {
    const isNativeToken = findToken?.token_symbol === chainFrom?.nativeCurrency.symbol
    const gasLimit = isNativeToken ? 21000 : 100000
    const t = (Number(assetValue) + Number(FeeData?.gasPrice ?? 0) * gasLimit) * cryptoValue
    setTotal(t)
  }, [assetValue, FeeData, cryptoValue])

  useEffect(() => {
    if (txSuccess) {
      openMessage('success', 'Send success')
      setAssetValue('0')
      setRecipient('')
      setTotal(0)
      if (findToken) {
        _getTokenBalance({
          walletAddress: wallet?.account.address as HexString,
          token: findToken,
          chainId: chainFrom?.id
        }).then((value) => setBalanceData(value))
      }
    }
  }, [txSuccess])

  useEffect(() => {
    if (findToken && wallet) {
      _getTokenBalance({
        walletAddress: wallet.account.address as HexString,
        token: findToken,
        chainId: chainFrom?.id
      }).then((value) => setBalanceData(value))
    }
  }, [findToken, wallet])

  const verifyAddress = (address: string) => {
    // The isAddress utility function now performs checksum validation by default (viem v2.13.10)
    // To opt-out of this behavior, you can pass strict: false or lowercase the address.
    if (isAddress(address, { strict: false })) {
      if (wallet?.account.address === address) return 'Recipient and sender cannot be the same'
      else return true
    }
    return 'Invalid address'
  }

  useEffect(() => {
    let isValidRecipient
    let isAvailableAsset

    if (recipient !== '') {
      isValidRecipient = verifyAddress(recipient)
      setRecipientWaring(isValidRecipient)
    } else {
      setRecipientWaring('')
    }
    if (assetValue !== '' && assetValue !== '0') {
      isAvailableAsset = Number(assetValue) > 0
    }
    setVisibleTotal(isValidRecipient === true && isAvailableAsset)
  }, [recipient, assetValue])

  const onSend = async () => {
    openMessage('loading', 'Waiting for transaction...')
    setLoadingTransaction(true)
    try {
      let txResult

      if (findToken?.address === '0x0000000000000000000000000000000000000000') {
        txResult = await wallet!.executeTransaction({
          to: recipient as HexString,
          value: parseEther(assetValue),
          data: '0x',
          chainId: chainFrom!.id
        })
      } else {
        txResult = await wallet?.executeERC20Transaction({
          to: recipient as HexString,
          //@ts-ignore
          value: assetValue,
          chainId: chainFrom!.id,
          tokenAddress: findToken?.address
        })
      }

      switch (txResult.status) {
        case 'FAILED':
          destroyMessage()
          openMessage('error', 'Transaction Failed')
          break
        case 'SUCCESS':
          setTxSuccess(true)
          dispatch(getWalletBalanceAction())
      }
      setLoadingTransaction(false)
    } catch (error) {
      setLoadingTransaction(false)
      destroyMessage()
      openMessage('error', 'Something went wrong!')
    }
  }

  return (
    <div className="send-page page col-10 fade-in">
      <BoxContent
        title="Send tokens"
        subTitle="Send tokens to another user quickly and securely."
        onConfirm={onSend}
        loading={loadingTransaction}
        price={total}
        visibleTotal={visibleTotal}
        chainFrom={chainFrom}
        setChainFrom={setChainFrom}
        isSendFrom
      >
        <div className="recipient-box box-grey d-flex justify-content-between py-3 ps-3 pe-5 mb-2 gap-4">
          <div className="info-address">
            <div className="title">Send to</div>
            <div className="d-flex align-items-center">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  padding: 10,
                  borderRadius: 5,
                  backgroundColor: '#00000060',
                  width: 48
                }}
              >
                <FaUser size={24} />
              </div>
              <input
                spellCheck={false}
                style={{ height: 48, paddingLeft: 10 }}
                type="text"
                placeholder="Enter Address or Domain (ENS, UD, Cyber)"
                onChange={(e) => {
                  setRecipient(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchRecipientAccount()
                  }
                }}
                onBlur={fetchRecipientAccount}
              />
              {/* <div className="d-flex align-items-center justify-content-end gap-2 count">0</div> */}
            </div>
            {/* <div className="d-flex justify-content-between">
              <div
                className="user-id"
                style={{ color: recipientWaring.length > 0 ? '#F4245E' : '' }}
              >
                {recipientWaring.length > 0 ? recipientWaring : cutAddress({ address: recipient })}
              </div>
              <div className="price">$0.00</div>
            </div> */}
          </div>
        </div>

        <div className="asset-box box-grey py-3 ps-3 pe-5 mb-2">
          <div>
            <div className="title">Asset</div>
            <div className="d-flex align-items-center">
              <div className="d-flex gap-3 mb-1 align-items-center">
                <SelectCustom
                  token={findToken}
                  onChange={(e) => {
                    setFindToken(e)
                  }}
                  listData={tokens}
                  position="bottom"
                />
              </div>
              <input
                className="count w-100 ps-4"
                type="number"
                value={assetValue}
                style={{ textAlign: 'right' }}
                onChange={(e) => {
                  setAssetValue(e.target.value)
                }}
                onWheel={(e) => e.currentTarget.blur()}
                onFocus={() => {
                  if (assetValue === '0') {
                    setAssetValue('')
                  }
                }}
                onBlur={() => {
                  if (assetValue === '') {
                    setAssetValue('0')
                  }
                }}
              />
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {balanceData && (
                <div className="status">Balance: {`${formatBalance(balanceData || '0')}`}</div>
              )}
            </div>
            <div className="price">
              {!changePrice({ input: Number(assetValue), range: cryptoValue || 1 }) && (
                <Fragment>
                  ${changePrice({ input: Number(assetValue), range: cryptoValue || 1 }).toFixed(1)}
                </Fragment>
              )}
              {changePrice({ input: Number(assetValue), range: cryptoValue || 1 }) && (
                <Fragment>
                  ${changePrice({ input: Number(assetValue), range: cryptoValue || 1 }).toFixed(5)}
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </BoxContent>
    </div>
  )
}

export default SendView
