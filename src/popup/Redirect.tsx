import React from 'react'
import XLogo512 from './assets/images/xLogo512.png'

const Redirect = () => {
  return (
    <div className="redirect-container fade-in d-flex flex-column align-items-center justify-content-center gap-2">
      <img src={XLogo512} alt="" height={250} style={{ borderRadius: 20 }} />
      <div className="redirect-text">
        Loading <span className="dot" /> <span className="dot" /> <span className="dot" />
      </div>
    </div>
  )
}

export default Redirect
