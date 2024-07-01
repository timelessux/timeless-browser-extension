import { Switch } from 'antd'
import { debounce } from 'lodash'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { IoIosCloseCircle } from 'react-icons/io'
import { ArrowDownCircleIcon } from '../../assets/icons/arrowDownCircle'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { tokenActions } from '../../redux/slices/token/token.slice'
import Avatar from '../component/Avatar'
import Invalid from '../token/components/Invalid'
import { convertChainName } from '../../../../utils/textConvert'

const TokenSetting = () => {
  const [searchText, setSearchText] = useState<string>('')
  const { listToken, listSearchToken } = useAppSelector((state) => state.token)
  const dispatch = useAppDispatch()
  const searchRef = useRef<HTMLInputElement>(null)

  const displayToken = searchText === '' ? listToken : listSearchToken

  console.log(listToken)

  function changeSearchText(e: ChangeEvent<HTMLInputElement>) {
    setTextWithDebounce(e.target.value)
  }

  const setTextWithDebounce = useRef(
    debounce(async (searchKeyParam: string) => {
      setSearchText(searchKeyParam)
    }, 500)
  ).current

  useEffect(() => {
    dispatch(tokenActions.searchToken({ tokenName: searchText }))
  }, [searchText])

  return (
    <div
      className="token-setting-view d-flex flex-column position-relative fade-in h-100"
      style={{ fontFamily: 'Medium' }}
    >
      <div className="d-flex gap-2 justify-content-end w-100">
        <div className={`search-box-token box-grey px-3 py-2 d-flex align-items-center`}>
          <input
            type="text"
            onChange={changeSearchText}
            placeholder="Enter token name here..."
            ref={searchRef}
          />
          {searchText && (
            <IoIosCloseCircle
              size={20}
              onClick={() => {
                setSearchText('')
                if (searchRef.current && searchRef.current.value) {
                  searchRef.current.value = ''
                }
              }}
              className="cursor-pointer me-2 delete-search"
            />
          )}
          <AiOutlineSearch size={20} />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div className="row gx-2 h-100">
          <div className="col-12 h-100 d-flex flex-column">
            <div className="border-bottom py-2" style={{ fontSize: 18 }}>
              Token
            </div>
            {displayToken.length > 0 ? (
              <div className="hidden-scroll-bar h-100" style={{ overflow: 'scroll', flex: 1 }}>
                {displayToken.map((tokenFile) => {
                  if (tokenFile.data.length === 0) return null
                  return <TokenWithNetwork tokenFile={tokenFile} key={tokenFile.chainId} />
                })}
              </div>
            ) : (
              <Invalid message="No token found!" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenSetting

const TokenWithNetwork = ({ tokenFile }: { tokenFile }) => {
  const [open, setOpen] = useState<boolean>(true)

  return (
    <div className="token-with-network">
      <div className="py-2">
        <div
          className="d-flex justify-content-between cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <div style={{ fontSize: 22 }}>{tokenFile.name}</div>
          <div
            className={`${open ? 'rotation-0' : 'rotation-270'}`}
            style={{ height: 'fit-content' }}
          >
            <ArrowDownCircleIcon />
          </div>
        </div>
        <div className={`list-token ${open ? '--open' : ''}`}>
          {tokenFile.data.map((token) => {
            return (
              <TokenItem
                tokenFileName={tokenFile.name}
                token={token}
                networkLogo={tokenFile.chain.logo}
                networkName={tokenFile.chain.name}
                chainId={tokenFile.chainId}
                key={token.address}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

const TokenItem = ({
  token,
  networkLogo,
  networkName,
  chainId,
  tokenFileName
}: {
  token
  networkLogo
  networkName
  chainId
  tokenFileName
}) => {
  const dispatch = useAppDispatch()
  const [active, setActive] = useState<boolean>(token.active)

  return (
    <div
      className={`token-item hover p-2 rounded cursor-pointer`}
      onClick={(e) => {
        e.stopPropagation()
        dispatch(
          tokenActions.setActiveToken({
            chainId,
            tokenAddress: token.address,
            active: !active
          })
        )
        setActive(!active)
      }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="info d-flex align-items-center gap-2">
          <Avatar size={30} radius={'50%'} src={token.logoURI} />
          <div className="name">
            <div style={{ fontSize: 18 }}>{convertChainName(token.name, tokenFileName, true)}</div>
            <div className="d-flex align-items-center gap-1">
              {/* <div style={{ fontSize: 12 }}>
                {convertChainName(token.name, tokenFileName, false)}
              </div> */}
              <Avatar size={16} radius={'50%'} src={networkLogo} />
              <div style={{ fontSize: 12 }}>{networkName}</div>
            </div>
          </div>
        </div>
        <Switch checked={active} />
      </div>
    </div>
  )
}
