import React, { memo } from 'react'
import { TSpindl } from '../../../../../ts/articleState'
import { ImageLoader } from './ImageLoader'
import { getUrlFromString } from '../../../../../utils/link'

type SpindlCardProps = {
  data: TSpindl
  className?: string
}

const SpindlCard = memo((props: SpindlCardProps) => {
  const { data, className } = props
  const link = getUrlFromString(data.extra_data.cta.url)

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        window.open(link)
      }}
      className={`spindlCardContainer ${className}`}
    >
      <div className="thumbnailWrapper">
        <ImageLoader className="thumbnail" url={data.banner_url} />
      </div>
      <span className="spindlTitle">{data.title}</span>
      <span className="author">{data.description}</span>
    </div>
  )
})

export default SpindlCard
