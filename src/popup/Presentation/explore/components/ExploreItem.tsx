import { Dropdown, Space } from 'antd'
import React from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'
import { getData, setListExploreItemBookmarkedId } from '../../../../../utils/chromeStorage'
import { useAppDispatch } from '../../../redux/hook'
import { TExploreItem, exploreActions } from '../../../redux/slices/explore/exploreSlice'
import { setVisibleHeader } from '../../../redux/slices/slide/slide.slice'
import HeartButton from '../../component/HeartButton'
import IPTreeIcon from '../../component/IPTreeIcon'
import { ImageMeta } from '../../component/Image'
import { RemixIcon } from '../../component/RemixIcon'

type ExploreItemProps = {
  data: TExploreItem
  isDetailView?: boolean
  onClick?: (activeTab?: string) => void
  onClickRemix?: () => void
  onClickIPDetails?: () => void
  onClickIPTree?: () => void
}

const ExploreItem = (props: ExploreItemProps) => {
  const {
    data,
    isDetailView = false,
    onClick,
    onClickRemix,
    onClickIPDetails,
    onClickIPTree
  } = props

  const dispatch = useAppDispatch()

  const _handleSetBookmark = async () => {
    const listLocalBookmark: string[] = (await getData('listExploreItemBookmarkedId')) ?? []
    dispatch(exploreActions.setBookmark({ id: data.id, isBookmark: !data.isBookmark }))
    await setListExploreItemBookmarkedId(
      !data.isBookmark
        ? [data.id, ...listLocalBookmark]
        : [...listLocalBookmark.filter((e) => e !== data.id)]
    )
  }

  const _onClickRemix = () => {
    if (onClickRemix) {
      onClickRemix()
      dispatch(exploreActions.setExploreItem(data))
      dispatch(setVisibleHeader({ isVisibleHeader: false }))
    }
  }

  const _onClickIpDetails = () => {
    if (onClickIPDetails) {
      onClickIPDetails()
      dispatch(exploreActions.setExploreItem(data))
      dispatch(setVisibleHeader({ isVisibleHeader: false }))
    }
  }

  const _onClickIpTree = () => {
    if (onClickIPTree) {
      onClickIPTree()
      dispatch(exploreActions.setExploreItem(data))
      dispatch(setVisibleHeader({ isVisibleHeader: false }))
    }
  }

  return (
    <div className="exploreItem">
      <div className="thumbnailContainer">
        <ImageMeta url={data.thumbnail} name="thumbnail" />
        {!isDetailView && (
          <HeartButton
            className="heartButton"
            initialState={data.isBookmark ?? false}
            onClick={_handleSetBookmark}
          />
        )}
      </div>
      <div className="contentContainer">
        <div className="d-flex gap-2 justify-content-between align-items-center">
          <div className="d-flex gap-2 align-items-center">
            <div className="priceButton">
              <p>
                {data.price !== 15 && `$${data.price}/mo`}
                {data.price === 15 && `Subscribed`}
              </p>
            </div>
            {data.isRemix && <RemixIcon />}
          </div>
          {!isDetailView && (
            <Dropdown
              placement="bottom"
              destroyPopupOnHide
              dropdownRender={() => (
                <div className="dropdownContainer">
                  <button type="button" className="optionsButton" onClick={_onClickIpDetails}>
                    {'IP Details'}
                    <IoInformationCircleOutline size={25} color={'#ffffff99'} />
                  </button>
                  {data.isRemix && (
                    <button type="button" className="optionsButton" onClick={_onClickIpTree}>
                      {'IP Tree'}
                      <IPTreeIcon />
                    </button>
                  )}
                  <button type="button" className="optionsButton" onClick={_onClickRemix}>
                    {'Remix'}
                    <RemixIcon />
                  </button>
                </div>
              )}
            >
              <Space className="threeDotButton">...</Space>
            </Dropdown>
          )}
        </div>
        <p className="title" onClick={() => onClick && onClick()}>
          {data.name}
        </p>
        <p className="description" onClick={() => onClick && onClick()}>
          {data.description}
        </p>
        <p className="authorName">{`Curated by: ${data.curator.name}`}</p>
      </div>
    </div>
  )
}
export default ExploreItem
