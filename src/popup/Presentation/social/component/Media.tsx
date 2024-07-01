import React from 'react'
import { useAppDispatch } from '../../../redux/hook'
import { pushModal } from '../../../redux/slices/modal/modal.slice'
import { EContentFocus, EFullscreenMode, EModals } from '../../../../../ts'
import { ImageLayout, ImageMeta } from '../../component/Image'
import { reformatToValidLink } from '../../../../../utils/link'
import AudioMeta from '../../component/AudioMeta'
import VideoMeta from '../../component/VideoMeta'
import { PublicationMedia, PublicationMetadata } from '../../../Domain/Model/Publication'

type Props = {
  metas: PublicationMetadata
  media: PublicationMedia[]
}

function Media({ metas, media }: Props) {
  const dispatch = useAppDispatch()

  function openImageView(src: string, e: React.MouseEvent<Element, MouseEvent>) {
    dispatch(
      pushModal({
        name: EModals.FULLSCREEN_MEDIA,
        data: JSON.stringify({ src, type: EFullscreenMode.IMAGE })
      })
    )
    e.stopPropagation()
  }

  return (
    <div>
      {media &&
        (metas.mainContentFocus === EContentFocus.AUDIO ||
          metas?.lens?.mainContentFocus === EContentFocus.AUDIO) && (
          <div>
            {media.map((data, index) => {
              return (
                <AudioMeta
                  key={index}
                  name={metas.name}
                  url={reformatToValidLink(data.item) as string}
                  image={reformatToValidLink(metas.image) as string}
                  type={data.type}
                />
              )
            })}
          </div>
        )}
      {media &&
        (metas.mainContentFocus === EContentFocus.VIDEO ||
          metas?.lens?.mainContentFocus === EContentFocus.VIDEO) && (
          <VideoMeta url={reformatToValidLink(media[0].item) as string} image={''} />
        )}

      {media &&
        (metas.mainContentFocus === EContentFocus.IMAGE ||
          metas?.lens?.mainContentFocus === EContentFocus.IMAGE) && (
          <div
            className={`d-grid image-layout ${
              media.slice(0, 4).length === 3 ? 'layout-three' : ''
            }`}
          >
            {media.slice(0, 4).map((data, index) => (
              <ImageLayout
                key={index}
                totalImages={media.slice(0, 4).length}
                url={data.item}
                name={metas.name}
                index={index}
                onClick={(e) => {
                  openImageView(data.item, e)
                }}
              />
            ))}
          </div>
        )}

      {media && !metas.mainContentFocus && !metas.lens && (
        <>
          {media.map((data, index) => {
            if (data.type === 'image/png') {
              return (
                <ImageMeta
                  key={index}
                  url={reformatToValidLink(data.item) as string}
                  name={data.altTag || metas.name}
                />
              )
            }
            if (data.type === 'video/mp4') {
              return (
                <VideoMeta
                  key={index}
                  url={reformatToValidLink(data.item) as string}
                  image={reformatToValidLink(data.cover) as string}
                />
              )
            }
            if (data.type === 'audio/mpeg')
              <AudioMeta
                key={index}
                name={metas.name}
                url={reformatToValidLink(data.item) as string}
                image={reformatToValidLink(metas.image) as string}
                type={data.type}
              />
          })}
        </>
      )}
    </div>
  )
}

export default Media
