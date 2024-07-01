import React, { Fragment, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

type TImageLoader = {
  url: string
  className?: string
  skeletonClassName?: string
  onClick?: () => void
}
export const ImageLoader = (props: TImageLoader) => {
  const { url, className, skeletonClassName, onClick } = props

  const [isLoaded, setIsLoaded] = useState(false)
  const _onLoaded = () => setIsLoaded(true)

  return (
    <Fragment>
      {!isLoaded && <div className={`skeleton-loader ${skeletonClassName}`} />}
      <LazyLoadImage
        src={url}
        onLoad={_onLoaded}
        onClick={onClick}
        className={`${className} ${isLoaded ? 'fade-in-5s' : ''}`}
        style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
      />
    </Fragment>
  )
}
