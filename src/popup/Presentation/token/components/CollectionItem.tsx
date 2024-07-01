import React from 'react'
import { BsDot } from 'react-icons/bs'
import { getYearByISOString } from '../../../../../utils/date'
import { Collection } from '../../../Domain/Model/Token'
import { ImageMeta } from '../../component/Image'
import { useCollectionViewModel } from '../CollectionViewModel'
import Invalid from './Invalid'

const CollectionItem = ({ collection }: { collection: Collection }) => {
  const { loading } = useCollectionViewModel()

  if (loading) {
    return <CollectionSkeleton />
  }

  return (
    <div>
      {collection.collectionDetails.imageUrl ? (
        <ImageMeta
          url={collection.collectionDetails.imageUrl}
          name={collection.collectionDetails.name}
        />
      ) : (
        <Invalid message="No image!" />
      )}
      <div className="truncate-1 mt-2">{collection.collectionDetails.name}</div>
      <div className="d-flex align-items-center mt-1 opacity-50">
        <span>{collection.collectionDetails.name}</span>
        <BsDot />
        <span>{getYearByISOString(collection.lastAcquiredDate)}</span>
      </div>
    </div>
  )
}

export default CollectionItem

export const CollectionSkeleton = () => {
  return (
    <div style={{ height: 200 }}>
      <div className="nft-metas skeleton-loader" style={{ borderRadius: 16 }} />
    </div>
  )
}
