import { Modal, Tabs, TabsProps } from 'antd'
import React from 'react'
import { HeartIcon } from '../../../assets/icons/HeartIcon'
import { TExploreItem, exploreActions } from '../../../redux/slices/explore/exploreSlice'
import { RemixIcon } from '../../component/RemixIcon'
import useModalHandler from '../../hook/useModalHandler'
import { useAppDispatch } from '../../../redux/hook'
import { setVisibleHeader } from '../../../redux/slices/slide/slide.slice'

type ReviewExploreItemModalProps = {
  onClickRemix?: () => void
  modalHandler: ReturnType<typeof useModalHandler<TExploreItem>>
}

const ReviewExploreItemModal = (props: ReviewExploreItemModalProps) => {
  const { modalHandler, onClickRemix } = props
  const dispatch = useAppDispatch()
  const data = modalHandler.currentValue

  const _onClickRemix = () => {
    modalHandler.hide()
    const timer = setTimeout(() => {
      onClickRemix && onClickRemix()
      data && dispatch(exploreActions.setExploreItem(data))
      dispatch(setVisibleHeader({ isVisibleHeader: false }))
      clearTimeout(timer)
    }, 500)
  }

  const items: TabsProps['items'] = [
    {
      key: 'info',
      label: 'Info',
      children: (
        <div className="infoTabContainer">
          <div>
            <img src={data?.thumbnail} height={150} style={{ borderRadius: 8 }} alt="thumbnail" />
          </div>
          <div className="infoContainer">
            <p className="title">{data?.name}</p>
            <p className="description">{data?.description}</p>
            <p className="authorName">{`Curated by: ${data?.curator.name}`}</p>
          </div>
          <div className="buttonContainer">
            <button>
              <HeartIcon />
              {'Subscribe'}
            </button>
            <button onClick={_onClickRemix}>
              <RemixIcon />
              {'Remix'}
            </button>
          </div>
        </div>
      )
    }
    // {
    //   key: 'ipTree',
    //   label: 'IP Graph',
    //   children: 'Content of Tab Pane 2',
    //   disabled: true
    // }
  ]

  return (
    <Modal
      centered
      width={'50%'}
      footer={null}
      destroyOnClose
      closable={false}
      open={modalHandler.visible}
      onCancel={modalHandler.hide}
      styles={{ content: { backgroundColor: '#ffffff4d', borderRadius: 24 } }}
    >
      <div className="reviewExploreItemModalContainer">
        <button className="closeButton" type="button" onClick={modalHandler.hide}>
          {'X'}
        </button>
        <Tabs
          defaultActiveKey={modalHandler.activeTab ?? 'info'}
          items={items}
          tabBarGutter={24}
          style={{ flex: 1 }}
        />
      </div>
    </Modal>
  )
}

export default ReviewExploreItemModal
