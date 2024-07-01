import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { changeStep, nextStep, setStep } from '../../redux/slices/tutorial/tutorial.slice'
import { storeTutorialStep } from '../../../../utils/chromeStorage'

const WelcomeView = () => {
  const dispatch = useAppDispatch()
  const { stepSellected, steps } = useAppSelector((state) => state.tutorial)
  const [isSkip, setIsSkip] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isFadeOut, setIsFadeOut] = useState<boolean>(false)

  const handleSkip = () => {
    const tmpSteps = [...steps]
    const newData = tmpSteps.map((step) => ({ ...step, isActive: true }))
    storeTutorialStep({ steps: newData })
    setIsSkip(true)
    dispatch(setStep({ steps: newData }))
  }

  const handleTakeTour = () => {
    setIsFadeOut(true)
    setTimeout(() => {
      setIsFadeOut(false)
      if (stepSellected) {
        dispatch(nextStep({ step: { ...stepSellected, isActive: true } }))
        dispatch(changeStep({ step: { ...stepSellected, isActive: true } }))

        const tmpSteps = [...steps]
        const index = tmpSteps.findIndex((s) => s.id === stepSellected.id)

        if (index !== -1) {
          tmpSteps[index] = { ...stepSellected, isActive: true }
        }
        storeTutorialStep({ steps: tmpSteps })
      }
    }, 1000)
  }

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 500)
  }, [])

  return (
    <>
      <div
        className={`welcome-view ${
          isOpen ? '--open' : ''
        } h-100 w-100 d-flex flex-column justify-content-center align-items-center
        `}
      >
        <div className={`background-absolute ${isSkip ? '--skip' : ''}`} />
        <div className={`title ${isFadeOut ? 'fade-out' : ''}`}>Hello Friend</div>
        <div className={`sub-title ${isFadeOut ? 'fade-out' : ''}`}>Welcome to Timeless</div>
        <p className="description">your all-in-one web3 launcher.</p>
        <button className={`btn-take-tour ${isFadeOut ? 'fade-out' : ''}`} onClick={handleTakeTour}>
          Take a tour
        </button>
        <button className={`btn-skip ${isFadeOut ? 'fade-out' : ''}`} onClick={handleSkip}>
          SKIP
        </button>
      </div>
    </>
  )
}

export default WelcomeView
