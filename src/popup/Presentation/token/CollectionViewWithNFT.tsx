import React from 'react'
import ButtonWithIcon from '../component/ButtonWithIcon'
import { BsEye, BsEyeSlash, BsSortAlphaDown, BsSortAlphaUp } from 'react-icons/bs'
import { Loader } from '../component/Loader'
import { handleFilterCollections } from '../../redux/slices/token/token.slice'
import ListCollection from './ListCollection'
import FullscreenMediaModal from '../modal/FullScreenMediaModal'
import { useAppDispatch } from '../../redux/hook'
import { EPage } from '../../../../ts'

type CollectionViewWithNFTProps = {
  isVisible: boolean
  isViewBalance: boolean
  loadingTotal?: boolean
  isFilter: boolean
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>
  setIsViewBalance: React.Dispatch<React.SetStateAction<boolean>>
  setPage: React.Dispatch<React.SetStateAction<EPage>>
  total: string
}

export const CollectionViewWithNFT = (props: CollectionViewWithNFTProps) => {
  const {
    isViewBalance,
    isVisible,
    loadingTotal,
    setIsViewBalance,
    total,
    isFilter,
    setIsFilter,
    setPage
  } = props

  const dispatch = useAppDispatch()
  return (
    <div className={`collection-page page col-9 ${isVisible ? '' : 'd-none'}`}>
      <div
        className="h-100 hidden-scroll-bar fade-in collection-view p-4"
        style={{ overflow: 'scroll', maxHeight: 628 }}
        id="collection-page"
      >
        <div className="balance">
          <div className="title opacity-50">TOTAL BALANCE</div>
          <div className="d-flex align-items-center position-relative gap-2">
            <div className={`total ${isViewBalance ? '--visible' : '--hidden'}`}>${total}</div>
            <div
              className={`total d-flex align-items-center position-absolute left-0 ${
                isViewBalance ? '--hidden' : '--visible'
              }`}
            >
              {(total || '0').split('').map((data, index) => (
                <div key={data + index}>
                  <div
                    style={{
                      transform: 'translateY(6.5px)'
                    }}
                  >
                    *
                  </div>
                </div>
              ))}
            </div>
            <ButtonWithIcon
              icon={isViewBalance ? <BsEyeSlash size={24} /> : <BsEye size={24} />}
              visibleTitle={false}
              className="hover eye"
              onClick={() => {
                setIsViewBalance(!isViewBalance)
              }}
            />
            {loadingTotal && <Loader size="small" />}
          </div>
          {/* {currentPrice && percent && (
              <div className={`status ${Number(percent) >= 0 ? '--success' : '--error'}`}>
                ${currentPrice} ({percent}%)
              </div>
            )} */}
        </div>
        <div className="nft-text mt-4 d-flex align-items-center justify-content-between">
          <div>NFT</div>
          <ButtonWithIcon
            icon={isFilter ? <BsSortAlphaUp size={24} /> : <BsSortAlphaDown size={24} />}
            visibleTitle={false}
            className="hover"
            onClick={() => {
              setIsFilter(!isFilter)
              dispatch(handleFilterCollections({ type: isFilter ? 'A-Z' : 'Z-A' }))
            }}
          />
        </div>
        <ListCollection setPage={setPage} />
        <FullscreenMediaModal />
      </div>
    </div>
  )
}
