import { useState } from 'react'

interface SwipeInput {
  onSwipedLeft?: () => void
  onSwipedRight?: () => void
}

interface SwipeOutput {
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  onMouseUp: () => void
}

/** The required distance between touchStart and touchEnd to be detected as a swipe */
const MIN_SWIPE_DISTANCE = 150
export const useHorizontalSwipe = (props: SwipeInput): SwipeOutput => {
  const [touchStart, setTouchStart] = useState<number>()
  const [touchEnd, setTouchEnd] = useState<number>()

  const _onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setTouchEnd(undefined) /** otherwise the swipe is fired even with usual touch events */
    setTouchStart(e.clientX)
  }

  const _onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => setTouchEnd(e.clientX)

  const _onMouseUp = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE
    if (isLeftSwipe && props.onSwipedLeft) props.onSwipedLeft()
    if (isRightSwipe && props.onSwipedRight) props.onSwipedRight()
  }

  return {
    onMouseDown: _onMouseDown,
    onMouseMove: _onMouseMove,
    onMouseUp: _onMouseUp
  }
}
