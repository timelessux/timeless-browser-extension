import React from 'react'
import { useAppSelector } from '../../redux/hook'

type Props = {
  setStateBox: () => void
}

const EmptyLink = ({ setStateBox }: Props) => {
  const steps = useAppSelector((state) => state.tutorial.steps)
  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className="empty-link text-center">
        <div className="text-center" style={{ paddingLeft: 70, paddingRight: 70 }}>
          A one-click passport to your web adventures! 🌍🔗🚀
        </div>
        <button
          className={`create-link hover mt-2 ${
            !steps.every((step) => step.isActive) ? '--hover-disable' : ''
          }`}
          style={{ fontSize: 16, width: 113, height: 32, borderRadius: 24 }}
          onClick={setStateBox}
        >
          Create a link
        </button>
      </div>
    </div>
  )
}

export default EmptyLink
