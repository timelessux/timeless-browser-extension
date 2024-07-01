import React, { MouseEventHandler, useEffect, useState } from 'react'
import { reformatToValidLink } from '../../../../utils/link'
import Invalid from '../token/components/Invalid'

type Props = {
  url: string
  name: string
  external_url?: string
  customMessage?: string
  className?: string
}

type LayoutProps = {
  totalImages: number
  url: string
  name: string
  external_url?: string
  index: number
  onClick?: MouseEventHandler
}

export function ImageMeta({ url, name, className }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    setIsError(false)
    setImageLoaded(false)
    const img = new Image()
    img.onload = () => {
      setImageLoaded(true)
    }
    img.src = url
  }, [url])

  return (
    <div className="image-container">
      {!imageLoaded && !isError && (
        <div className="skeleton-loader position-absolute h-100">
          <img />
        </div>
      )}
      {isError ? (
        <Invalid message={`${url === '' ? 'No image!' : 'Invalid image!'}`} />
      ) : (
        <img
          src={url}
          alt={name}
          height={'100%'}
          className={className}
          width={'100%'}
          loading="lazy"
          style={{
            objectFit: 'cover',
            cursor: 'pointer'
          }}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  )
}

export function ImageLayout({ url, name, external_url, index, onClick }: LayoutProps) {
  return (
    <div
      className={`mt-2 cursor-pointer ${index === 0 ? 'first-item' : ''}`}
      {...(onClick ? { onClick } : {})}
    >
      <ImageMeta url={reformatToValidLink(url) as string} name={name} external_url={external_url} />
    </div>
  )
}
