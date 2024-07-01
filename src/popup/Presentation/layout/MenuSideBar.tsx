import React from 'react'
import { AiOutlineCompass } from 'react-icons/ai'
import { BsApple, BsRainbow } from 'react-icons/bs'
import { FiPlusCircle } from 'react-icons/fi'
import { IoIosSwap } from 'react-icons/io'
import { IoPaperPlaneOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { EPage } from '../../../../ts'
import XIcon from '../../assets/icons/XIcon'
import { setVisibleMenuSideBar } from '../../redux/slices/slide/slide.slice'
import MenuItem from './component/MenuItem'
import { articleActions } from '../../redux/slices/articles/articleSlice'
import { ARTICLE_DISPLAY_VIEW } from '../../constants/article'
import { setPage as setSubPageCollectionView } from '../../redux/slices/pages/pageSlice'

type Props = {
  page: EPage
  setPage: React.Dispatch<React.SetStateAction<EPage>>
  inlineCollapsed: boolean
  disable: boolean
  moveY: number
  setInlineCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuSideBar = ({
  setPage,
  page,
  inlineCollapsed,
  disable,
  moveY,
  setInlineCollapsed
}: Props) => {
  const dispatch = useDispatch()

  return (
    <div
      onTransitionEnd={() => {
        if (moveY === 100) {
          dispatch(setVisibleMenuSideBar({ isVisibleMenuSideBar: false }))
        }
      }}
      style={{
        left: moveY,
        opacity: moveY === 100 ? 0 : 1
      }}
      className={`menu-side-bar d-flex flex-column justify-content-between align-items-center align-items-center gap-3 ${
        inlineCollapsed ? 'open-side-bar' : 'close-side-bar'
      }`}
      onMouseLeave={(e) => {
        e.stopPropagation()
        setInlineCollapsed(false)
      }}
      onMouseOver={(e) => {
        e.stopPropagation()
        setInlineCollapsed(true)
      }}
    >
      <div className="group-items d-flex flex-column">
        <MenuItem
          title={'Dashboard'}
          icon={
            <div className="d-flex justify-content-center">
              <XIcon />
            </div>
          }
          onClick={() => {
            setPage(EPage.COLLECTION)
            dispatch(setSubPageCollectionView({ page: EPage.DEFAULT }))
          }}
          className="mb-3"
          active={page === EPage.COLLECTION || page === EPage.COLLECTION_DETAIL}
          collapsed={inlineCollapsed}
          disable={disable}
        />
        <MenuItem
          title={'Explore'}
          icon={
            <AiOutlineCompass size={24} color={`${'#fffffff5'}`} opacity={`${disable ? 0.5 : 1}`} />
          }
          onClick={() => {
            setPage(EPage.EXPLORE)
            dispatch(articleActions.setCurrentView(ARTICLE_DISPLAY_VIEW.ARTICLE_LISTING))
          }}
          className="mb-3"
          active={page === EPage.EXPLORE}
          collapsed={inlineCollapsed}
          disable={disable}
        />
        <MenuItem
          title={'Buy'}
          icon={
            <FiPlusCircle color={`${'#fffffff5'}`} size={24} opacity={`${disable ? 0.5 : 1}`} />
          }
          onClick={() => {
            setPage(EPage.BUY)
          }}
          className="mb-3"
          active={page === EPage.BUY}
          collapsed={inlineCollapsed}
          disable={disable}
        />

        <MenuItem
          title={'Send'}
          icon={
            <IoPaperPlaneOutline
              color={`${'#fffffff5'}`}
              size={24}
              opacity={`${disable ? 0.5 : 1}`}
            />
          }
          onClick={() => {
            setPage(EPage.SEND)
          }}
          className="mb-3"
          active={page === EPage.SEND}
          collapsed={inlineCollapsed}
          disable={disable}
        />
        <MenuItem
          title={'Swap'}
          icon={<IoIosSwap color={`${'#fff'}`} size={24} opacity={`${disable ? 0.5 : 1}`} />}
          onClick={() => {
            setPage(EPage.SWAP)
          }}
          className="mb-3"
          active={page === EPage.SWAP}
          collapsed={inlineCollapsed}
          disable={disable}
        />
        {/* <MenuItem
          title={'Bridge'}
          icon={<BsRainbow color={`${'#fffffff5'}`} size={24} opacity={`${disable ? 0.5 : 1}`} />}
          onClick={() => {
            setPage(EPage.BRIDGE)
          }}
          active={page === EPage.BRIDGE}
          collapsed={inlineCollapsed}
          disable={disable}
        /> */}
      </div>

      <a
        href="https://apps.apple.com/us/app/timeless-x/id6470180600"
        target="_blank"
        rel="noopener noreferrer"
        className={`d-flex align-items-center download-app hover ${
          inlineCollapsed
            ? 'btn-collapsed open-menu-item '
            : 'btn-none-collapsed close-menu-item justify-content-center'
        }`}
        style={inlineCollapsed ? {} : { borderRadius: '50%' }}
      >
        <div className={`d-flex p-2 hover-icon ${inlineCollapsed ? 'ms-3' : ''}`}>
          <BsApple color="#fffffff5" />
        </div>
        {inlineCollapsed && (
          <span className="ms-2" style={{ opacity: 0.5 }}>
            Try iOS
          </span>
        )}
      </a>
    </div>
  )
}

export default MenuSideBar
