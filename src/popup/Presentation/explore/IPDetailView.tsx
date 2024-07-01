import React from 'react'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { cutAddress } from '../../../../utils/textConvert'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { RemixIcon } from '../component/RemixIcon'
import { exploreActions } from '../../redux/slices/explore/exploreSlice'
import { setVisibleHeader } from '../../redux/slices/slide/slide.slice'

type ExploreItemDetailProps = {
  goBack: () => void
  onClickRemix?: () => void
}

const IPDetailView = (props: ExploreItemDetailProps) => {
  const { goBack, onClickRemix } = props
  const dispatch = useAppDispatch()
  const { exploreItem } = useAppSelector((state) => state.exploreState)

  const _onClickRemix = () => {
    if (onClickRemix && exploreItem) {
      onClickRemix()
      dispatch(exploreActions.setExploreItem(exploreItem))
      dispatch(setVisibleHeader({ isVisibleHeader: false }))
    }
  }

  return (
    <div className="exploreItemDetailContainer">
      <div className="thumbnailContainer">
        <img
          src={exploreItem?.thumbnail}
          alt="thumbnail"
          className="thumbnail"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="rightContainer">
        <div className="headerContainer">
          <button onClick={goBack} className="goBackButton hover">
            <MdKeyboardArrowLeft color="#fff" size={24} />
          </button>
          {/* <button>{'Subscribe?'}</button> */}
        </div>
        <div className="infoContainer">
          <p className="authorName">{`Curated by: ${exploreItem?.curator.name}`}</p>
          <p className="title">{exploreItem?.name}</p>
          <p className="description">{exploreItem?.description}</p>
        </div>
        <div className="subInfoContainer">
          <p>
            {`TxHash`}
            <span>
              <BsFillArrowUpRightCircleFill />{' '}
              {cutAddress({ address: exploreItem?.ipOrg.txHash ?? '' })}
            </span>
          </p>
          <div className="divider" />
          <p>
            {`IPA Organization Name`}
            <span>{exploreItem?.ipOrg.name ?? ''}</span>
          </p>
          <div className="divider" />
          <p>
            {`Created`}
            <span>{exploreItem?.ipOrg.createdAt ?? ''}</span>
          </p>
        </div>
        <div className="d-flex justify-content-center" onClick={_onClickRemix}>
          <a
            className="open-sea-button box-grey hover cursor-pointer d-flex gap-2 align-items-center px-5 py-2"
            target="_blank"
            rel="noreferrer"
          >
            <RemixIcon width={22} />
            <span className="ms-1">{'Remix'}</span>
          </a>
        </div>
        <div className="linkContainer">
          <a href={exploreItem?.socialLinks?.website}>{'Website'}</a>
          {' | '}
          <a href={exploreItem?.socialLinks?.discord}>{'Discord'}</a>
          {' | '}
          <a href={exploreItem?.socialLinks?.twitter}>{'Twitter'}</a>
          {' | '}
          <a href={exploreItem?.socialLinks?.medium}>{'Medium'}</a>
        </div>
      </div>
    </div>
  )
}

export default IPDetailView
