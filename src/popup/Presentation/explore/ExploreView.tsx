import React, { useCallback, useState } from 'react'
import ExploreItemListing from './ExploreItemListing'
import RemixView from './RemixView'
import IPDetailView from './IPDetailView'
import IPTreeView from './IPTreeView'
import { useAppDispatch } from '../../redux/hook'
import { setVisibleHeader } from '../../redux/slices/slide/slide.slice'

type TDisplay = 'listing' | 'ipDetails' | 'ipTree' | 'remix'

const ExploreView = () => {
  const [isDisplay, setIsDisplay] = useState<TDisplay>('listing')
  const dispatch = useAppDispatch()

  const _goToRemixView = useCallback(() => {
    setIsDisplay('remix')
  }, [])

  const _goToIPDetails = useCallback(() => {
    setIsDisplay('ipDetails')
  }, [])

  const _goToIPTree = useCallback(() => {
    setIsDisplay('ipTree')
  }, [])

  const _goBack = useCallback(() => {
    setIsDisplay('listing')
    dispatch(setVisibleHeader({ isVisibleHeader: true }))
  }, [])

  return (
    <div className={`explore-page ${isDisplay === 'listing' ? 'col-10' : 'col-12'} col-10 fade-in`}>
      {isDisplay === 'listing' && (
        <ExploreItemListing
          onClickRemix={_goToRemixView}
          onClickIPDetails={_goToIPDetails}
          onClickIPTree={_goToIPTree}
        />
      )}
      {isDisplay === 'ipDetails' && <IPDetailView goBack={_goBack} onClickRemix={_goToRemixView} />}
      {isDisplay === 'ipTree' && <IPTreeView goBack={_goBack} />}
      {isDisplay === 'remix' && <RemixView goBack={_goBack} />}
    </div>
  )
}

export default ExploreView
