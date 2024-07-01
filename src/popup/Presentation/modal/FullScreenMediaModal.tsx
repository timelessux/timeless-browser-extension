import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { EFullscreenMode, EModals } from '../../../../ts'
import { popModal } from '../../redux/slices/modal/modal.slice'
import { ModalBase } from './ModalBase'
import { reformatToValidLink } from '../../../../utils/link'

const FullscreenMediaModal = () => {
  const dispatch = useAppDispatch()
  const fullscreenViewData = useAppSelector((state) =>
    state.modal.modalStack.find((modal) => modal.name === EModals.FULLSCREEN_MEDIA)
  )?.data as undefined | { src: string; type: EFullscreenMode }
  const [pressable, setPressable] = useState<boolean>(false)

  return (
    <ModalBase
      modalName={EModals.FULLSCREEN_MEDIA}
      onCloseModal={() => {
        dispatch(popModal())
        setPressable(false)
      }}
      className="fullscreen-modal"
    >
      <div onClick={() => pressable && dispatch(popModal())} style={{ cursor: 'pointer' }}>
        <div className="fullscreen-modal-inner">
          {fullscreenViewData ? <MediaViewer {...fullscreenViewData} /> : null}
        </div>
      </div>
    </ModalBase>
  )
}

const MediaViewer = ({ src, type }: { src: string; type: EFullscreenMode }) => {
  if (type === EFullscreenMode.MODEL)
    return (
      <div className="fullscreen-model" style={{ cursor: 'auto' }}>
        <model-viewer
          // src="http://localhost:3000/Astronaut.glb" // for testing
          src={src}
          ios-src=""
          poster=""
          alt="Preview 3D model"
          shadow-intensity="1"
          camera-controls
          auto-rotate
          ar
        ></model-viewer>
      </div>
    )

  return (
    <div className="fullscreen-image">
      <img src={reformatToValidLink(src) ?? undefined} alt="Preview" width="100%" height="100%" />
      {reformatToValidLink(src) ? (
        <a href={reformatToValidLink(src) || '#'} target="_blank" rel="noreferrer">
          <div className="open-original">Open original</div>
        </a>
      ) : null}
    </div>
  )
}

export default FullscreenMediaModal
