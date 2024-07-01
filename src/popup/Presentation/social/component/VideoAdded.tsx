import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

type Props = {
  selectedVideo: File
  setSelectedVideo: React.Dispatch<File | null>
}

const VideoAdded = ({ selectedVideo, setSelectedVideo }: Props) => {
  return (
    <div className="position-relative mt-4">
      <video controls width={'100%'} style={{ borderRadius: 16, position: 'relative' }}>
        <source src={URL.createObjectURL(selectedVideo)} type={selectedVideo.type} />
      </video>
      <div
        style={{
          width: 20,
          height: 20,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 5,
          background: 'black',
          borderRadius: '50%',
          position: 'absolute',
          top: 16,
          right: 16
        }}
        onClick={() => {
          setSelectedVideo(null)
        }}
      >
        <AiOutlineClose color="#fff" className="cursor-pointer" />
      </div>
    </div>
  )
}

export default VideoAdded
