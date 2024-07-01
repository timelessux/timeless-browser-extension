import { RefObject, useEffect } from 'react'

const useClickOutside = ({
  insideRef,
  action
}: {
  insideRef: RefObject<HTMLDivElement>
  action: () => void
}) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (insideRef.current && !insideRef.current.contains(event.target)) {
        action()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [insideRef])
}

export default useClickOutside
