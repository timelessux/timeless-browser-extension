import { Avatar } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineGif } from 'react-icons/ai'
import { BsCameraVideo } from 'react-icons/bs'
import { FaEarthAmericas, FaRegImage } from 'react-icons/fa6'
import { GiSoundWaves } from 'react-icons/gi'
import { MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { EMimeType, EModals, EReferenceModule, RenderTitle } from '../../../../../ts'
import { getData } from '../../../../../utils/chromeStorage'
import { reformatToValidLink } from '../../../../../utils/link'
import { Profile } from '../../../Domain/Model/Profile'
import { CreatePostInput, CreatePostMediaInput } from '../../../Domain/Model/Publication'
import avt1 from '../../../assets/icons/avt1.png'
import { usePageLoading } from '../../../context/LoadingContext'
import { useAppDispatch, useAppSelector } from '../../../redux/hook'
import { popModal, pushModal } from '../../../redux/slices/modal/modal.slice'
import { setTypePost } from '../../../redux/slices/post/post.slice'
import { useSocialViewModel } from '../../social/SocialViewModel'
import AddedPhotoList from '../../social/component/AddedPhotoList'
import AudioAdded from '../../social/component/AudioAdded'
import VideoAdded from '../../social/component/VideoAdded'
import { ModalBase } from '../ModalBase'

const fileSize = 2147483648
const fileLength = 4

export const PostModal = () => {
  const dispatch = useAppDispatch()

  const [profile, setProfile] = useState<Profile>()
  const [content, setContent] = useState<string>('')
  const [buttonDisable, setButtonDisable] = useState<boolean>(true)

  const imageRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLInputElement>(null)
  const gifRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)

  const [imageFiles, setImageFiles] = useState<Array<File>>([])
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null)
  const typeSelected = useAppSelector((state) => state.post.type)

  const { createPost, upload, isCreatePost } = useSocialViewModel()
  const { openMessage } = usePageLoading()

  const openAudienceModal = () => {
    dispatch(pushModal({ name: EModals.AUDIENCE_MODAL }))
  }

  const handleChangeContent = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerText)
  }

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0]
    if (file.size > fileSize) {
      openMessage('error', 'Max file size is 2GB')
      return
    }

    setSelectedVideo(file)
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files.length > fileLength || imageFiles.length + files.length > fileLength) {
      openMessage('error', `Can not upload more than ${fileLength} images`)
      return
    }
    const newImageFiles: Array<File> = []

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i]

      if (file.type.startsWith('image/')) {
        newImageFiles.push(file)
      }
    }

    setImageFiles([...imageFiles, ...newImageFiles])
  }

  const handleAudioChange = (e) => {
    const file = e.target.files[0]

    if (file && file.type.startsWith('audio/')) {
      setSelectedAudio(file)
    } else {
      setSelectedAudio(null)
    }
  }

  const handleRemoveImage = (index) => {
    const newImageFiles = [...imageFiles]
    newImageFiles.splice(index, 1)
    setImageFiles(newImageFiles)
  }

  const handleCreatePost = async () => {
    if (isCreatePost) return
    openMessage('loading', 'Creating post...')
    setButtonDisable(true)
    const media: CreatePostMediaInput = []
    let url
    if (selectedVideo) {
      url = await upload(selectedVideo)
      media.push({
        item: url,
        type: selectedVideo.type.toUpperCase().replace('/', '_') as EMimeType
      })
    }
    if (selectedAudio) {
      url = await upload(selectedAudio)
      media.push({
        item: url,
        type: selectedAudio.type.toUpperCase().replace('/', '_') as EMimeType
      })
    }
    for (const file of imageFiles) {
      url = await upload(file)
      media.push({
        item: url,
        type: file.type.toUpperCase().replace('/', '_') as EMimeType
      })
    }

    const data: CreatePostInput = {
      name: `Post by @${profile?.handle}`,
      description: null,
      content: content,
      contentWarning: null,
      media: media,
      attributes: null,
      animationUrl: null, //only for GIF
      referenceModuleInput: {
        type: typeSelected
      },
      tags: null
    }
    await createPost(data)
    dispatch(popModal())
    setContent('')
  }

  useEffect(() => {
    getData('lensProfile').then((res) => {
      if (res) {
        setProfile(res)
      }
    })
  }, [])

  useEffect(() => {
    if (content !== '') {
      if (imageFiles.length > 4 && !selectedAudio && !selectedVideo) {
        setButtonDisable(true)
      } else {
        setButtonDisable(false)
      }
    } else setButtonDisable(true)
  }, [content, imageFiles, selectedAudio, selectedVideo])

  // if (!profile) return null;

  return (
    <ModalBase
      modalName={EModals.POST_MODAL}
      onCloseModal={() => dispatch(popModal())}
      afterClose={() => {
        setImageFiles([])
        setSelectedAudio(null)
        setSelectedVideo(null)
        dispatch(setTypePost({ type: EReferenceModule.PUBLIC }))
      }}
      className="post-modal"
    >
      <div className="post-inner p-3">
        <div className="header d-flex gap-3">
          <div>
            <Avatar size={52} src={profile ? reformatToValidLink(profile.avatar) : avt1} />
          </div>
          <div>
            <div className="info">
              {profile?.name && <span className="name">{profile?.name}</span>}
              {profile?.handle && <span className="handle ms-1">@{profile?.handle}</span>}
            </div>
            <div className="group-button d-flex gap-2 align-items-center mt-1 ">
              <button className="border px-3 hover d-flex align-items-center">
                <span className="align-middle">Public</span>
                <MdOutlineKeyboardArrowDown size={18} />
              </button>
              <button className="border px-3 hover d-flex align-items-center">
                Add tag and Flair
              </button>
            </div>
            <button
              className="border mt-2 px-3 hover d-flex align-items-center"
              onClick={openAudienceModal}
            >
              <FaEarthAmericas />
              <span className="align-middle ms-1">{RenderTitle[typeSelected]}</span>
            </button>
          </div>
        </div>
        <AddedPhotoList
          photos={imageFiles}
          className="mt-4"
          onDeletePhoto={handleRemoveImage}
          uploadingPhoto={false}
        />
        {selectedAudio && (
          <AudioAdded selectedAudio={selectedAudio} setSelectedAudio={setSelectedAudio} />
        )}

        {selectedVideo && (
          <VideoAdded selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />
        )}
        <div className="social-input">
          <div
            role="textbox"
            contentEditable="true"
            aria-multiline="true"
            aria-labelledby="txtboxMultilineLabel"
            aria-required="true"
            placeholder="What's happening?"
            className="text-area-custom p-2 hover mt-4"
            onInput={handleChangeContent}
          ></div>
        </div>
        <div className="action d-flex gap-4">
          <div>
            <label
              htmlFor="audio"
              className={`${
                imageFiles.length > 0 || selectedAudio !== null || selectedVideo !== null
                  ? 'opacity-50'
                  : 'cursor-pointer'
              } `}
            >
              <GiSoundWaves />
            </label>
            <input
              ref={audioRef}
              type="file"
              hidden
              multiple
              onChange={handleAudioChange}
              accept="audio/mp3,audio/*; capture=microphone"
              id="audio"
              disabled={imageFiles.length > 0 || selectedAudio !== null || selectedVideo !== null}
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className={`${
                imageFiles.length === 4 || selectedAudio !== null || selectedVideo !== null
                  ? 'opacity-50'
                  : 'cursor-pointer'
              }`}
            >
              <FaRegImage />
            </label>
            <input
              ref={imageRef}
              type="file"
              hidden
              multiple
              onChange={handleFileChange}
              accept="image/jpeg, image/png"
              id="image"
              disabled={selectedAudio !== null || selectedVideo !== null}
            />
          </div>
          <div>
            <label
              htmlFor="gif"
              className={`${
                imageFiles.length == 4 || selectedAudio !== null || selectedVideo !== null
                  ? 'opacity-50'
                  : 'cursor-pointer'
              }`}
            >
              <AiOutlineGif />
            </label>
            <input
              ref={gifRef}
              type="file"
              hidden
              multiple
              onChange={handleFileChange}
              accept="image/gif"
              id="gif"
              disabled={imageFiles.length == 4 || selectedAudio !== null || selectedVideo !== null}
            />
          </div>
          <div>
            <label
              htmlFor="video"
              className={`${
                imageFiles.length > 0 || selectedAudio !== null || selectedVideo !== null
                  ? 'opacity-50'
                  : 'cursor-pointer'
              }`}
            >
              <BsCameraVideo />
            </label>
            <input
              ref={videoRef}
              type="file"
              hidden
              onChange={handleVideoFileChange}
              accept="video/mp4,video/x-m4v,video/webm,video/ogv,video/ogg"
              id="video"
              disabled={imageFiles.length > 0 || selectedAudio !== null || selectedVideo !== null}
            />
          </div>
        </div>
        <div className="mt-2 d-flex justify-content-end">
          <button
            className={`post-button border px-4 py-2 ${
              buttonDisable ? '--disabled' : '--success hover'
            }`}
            onClick={handleCreatePost}
            disabled={buttonDisable}
          >
            Post
          </button>
        </div>
      </div>
    </ModalBase>
  )
}
