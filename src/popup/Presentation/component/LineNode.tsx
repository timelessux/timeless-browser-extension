import React from 'react'

type LineNodeProps = {
  height?: number
}

const LineNode = (props: LineNodeProps) => {
  const { height = 80 } = props
  return (
    <div className="d-flex flex-column align-items-center" style={{ width: 'fit-content' }}>
      <div
        style={{
          width: 8,
          backgroundColor: 'transparent',
          height: 8,
          border: 1,
          borderStyle: 'solid',
          borderColor: 'white',
          borderRadius: 4
        }}
      />
      <div
        style={{
          width: 1,
          height,
          backgroundColor: 'white'
        }}
      />
    </div>
  )
}

export default LineNode
