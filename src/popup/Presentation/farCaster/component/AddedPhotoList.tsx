import { Spin } from 'antd'
import { CSSProperties } from 'react'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { LoadingOutlined } from '@ant-design/icons'

const AddedPhotoList = ({
  photos,
  onDeletePhoto,
  style,
  className,
  uploadingPhoto
}: {
  photos: Array<File>
  onDeletePhoto?(index: number): void
  disabledRemove?: boolean
  className?: string
  style?: CSSProperties
  uploadingPhoto: boolean
}) => {
  if (photos.length === 0 && !uploadingPhoto) return null
  return (
    <div
      className={`list-added-photo d-flex flex-wrap gap-3 ${
        photos.length < 3 && 'hidden-scroll-bar'
      } ${className || ''}`}
      style={style}
    >
      {photos.map((photo, index) => {
        return (
          <div style={{ position: 'relative' }} key={index} className="photo-item border">
            <div
              style={{
                position: 'absolute',
                width: 20,
                height: 20,
                right: 0,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 5,
                background: 'black',
                borderRadius: '50%'
              }}
              onClick={() => {
                onDeletePhoto?.(index)
              }}
            >
              <AiOutlineClose color="#fff" />
            </div>
            <img src={URL.createObjectURL(photo)} alt={`Image ${index}`} />
          </div>
        )
      })}
      {uploadingPhoto ? (
        <div className="photo-item">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : null}
    </div>
  )
}

export default AddedPhotoList
