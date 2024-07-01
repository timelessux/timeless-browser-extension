import React, { useState } from 'react'
import { PiArrowBendRightUpBold } from 'react-icons/pi'
import { storeTutorialStep } from '../../../../utils/chromeStorage'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { changeStep, nextStep, setComponent } from '../../redux/slices/tutorial/tutorial.slice'

const Tutorial = () => {
  const {
    ref,
    customHeight,
    customTop,
    steps,
    customWidth,
    customLeft,
    stepSellected,
    customRight,
    topText
  } = useAppSelector((state) => state.tutorial)
  const dispatch = useAppDispatch()
  const [isFadeOut, setIsFadeOut] = useState<boolean>(false)

  const updateStep = () => {
    if (isFadeOut) return
    setIsFadeOut(true)

    setTimeout(() => {
      setIsFadeOut(false)
      dispatch(
        setComponent({
          ref: null,
          customHeight: 0,
          customTop: 0,
          customWidth: 0,
          customLeft: 0,
          customRight: 0,
          topText: 0
        })
      )
      if (!stepSellected) return
      dispatch(nextStep({ step: stepSellected }))
      dispatch(changeStep({ step: { ...stepSellected, isActive: true } }))
      const tmpSteps = [...steps]
      const index = tmpSteps.findIndex((s) => s.id === stepSellected.id)

      if (index !== -1) {
        tmpSteps[index] = { ...stepSellected, isActive: true }
      }
      storeTutorialStep({ steps: tmpSteps })
    }, 500)
  }

  if (steps.length <= 1 || !stepSellected || stepSellected.id === 'welcome') return null

  return (
    <div className={`tutorial w-100 h-100 ${stepSellected.id === 'reload' ? '--reload' : ''}`}>
      {stepSellected.id !== 'reload' && ref && (
        <div
          className={`position-absolute highlight fade-in ${isFadeOut ? 'fade-out' : ''}`}
          style={{
            left: ref.left - 10 + customLeft,
            top: ref.top - 20 + customTop,
            background: `${
              stepSellected.id === 'links' || stepSellected.id === 'stash'
                ? '#d3d3d333'
                : '#d3d3d380'
            } `,
            width: ref.width + 20 + customWidth,
            height: ref.height + customHeight,
            borderRadius: 12
          }}
        ></div>
      )}

      {stepSellected.id !== 'reload' && ref && (
        <div
          className={`position-absolute fade-in  ${isFadeOut ? 'fade-out' : ''}`}
          style={{
            left: ref.right + 40 + customRight,
            top: ref.top - 20 + topText
          }}
        >
          <PiArrowBendRightUpBold size={45} className="rotation-270" />
          <div className="title" style={{ fontFamily: 'Bold', fontSize: 35 }}>
            {stepSellected.title}
          </div>
          <div className="content" style={{ maxWidth: 350, fontSize: 20, fontFamily: 'Regular' }}>
            {stepSellected.content}
          </div>
          <button
            style={{
              outline: 'none',
              background: 'none',
              border: '1px solid #fff',
              color: '#fff',
              fontFamily: 'Bold',
              padding: '10px 25px',
              borderRadius: 26,
              marginTop: 10
            }}
            onClick={() => {
              updateStep()
            }}
          >
            {stepSellected.customNextButtonText || 'Next'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Tutorial
