import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

type Props = {
  selectedAudio: File
  setSelectedAudio: React.Dispatch<File | null>
}

const AudioAdded = ({ selectedAudio, setSelectedAudio }: Props) => {
  return (
    <div className="mt-4 d-flex align-items-center audio-post pe-2">
      <audio controls>
        <source src={URL.createObjectURL(selectedAudio)} type={selectedAudio.type} />
        Your browser does not support the audio element.
      </audio>
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
          borderRadius: '50%'
        }}
        onClick={() => {
          setSelectedAudio(null)
        }}
      >
        <AiOutlineClose color="#fff" className="cursor-pointer" />
      </div>
    </div>
  )
}

export default AudioAdded
