import React from 'react'

type AnimatedBackgroundProps = {
  url?: string
}

const AnimatedBackground = (props: AnimatedBackgroundProps) => {
  const { url } = props
  const bgElement = document.getElementById('background-app')
  return (
    <div id="background-app" className="background-app">
      {url && (
        <img
          src={url}
          data-src={url}
          loading="lazy"
          onLoad={() => {
            bgElement?.classList.remove('fade-out')
            bgElement?.classList.add('fade-in')
          }}
        />
      )}
    </div>
  )
}

export default AnimatedBackground
