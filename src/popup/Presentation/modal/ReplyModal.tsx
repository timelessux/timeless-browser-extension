import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineGif } from 'react-icons/ai'
import { BsCameraVideo, BsDot } from 'react-icons/bs'
import { FaRegImage } from 'react-icons/fa6'
import { GiSoundWaves } from 'react-icons/gi'
import { EModals, EReferenceModule, EStatusReact } from '../../../../ts'
import { getData } from '../../../../utils/chromeStorage'
import { reformatToValidLink } from '../../../../utils/link'
import { Profile } from '../../Domain/Model/Profile'
import avt1 from '../../assets/icons/avt1.png'
import { usePageLoading } from '../../context/LoadingContext'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { popModal } from '../../redux/slices/modal/modal.slice'
import { useSocialViewModel } from '../social/SocialViewModel'
import AddedPhotoList from '../social/component/AddedPhotoList'
import AudioAdded from '../social/component/AudioAdded'
import VideoAdded from '../social/component/VideoAdded'
import { ModalBase } from './ModalBase'
import { setTypePost } from '../../redux/slices/post/post.slice'
import { IoClose } from 'react-icons/io5'
import Avatar from '../component/Avatar'
import { PiSealCheckFill } from 'react-icons/pi'
import { reformatDateFromNow } from '../../../../utils/date'
import DetectedContent from '../social/component/DetectedContent'
import { formatPostContent } from '../../../../utils/textConvert'
import VoteInformation from '../social/component/VoteInfomation'

const fileSize = 2147483648
const fileLength = 4

export const ReplyModal = () => {
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

  const { openMessage } = usePageLoading()
  const { createComment, poll } = useSocialViewModel()

  let dataComment
  const data = useAppSelector((state) => state.modal.lastModal?.data)
  if (data) dataComment = JSON.parse(data)

  const onClickComment = async () => {
    if (!dataComment) return

    const status = await createComment(dataComment.id, content, `Post by @${profile?.handle}`)
    if (status === EStatusReact.DONE) {
      setContent('')
      dispatch(popModal())
    }
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
      openMessage('error', `Can not upload more ${fileLength} image`)
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

  useEffect(() => {
    getData('lensProfile').then((res) => {
      if (res) {
        setProfile(res)
      }
    })
  }, [])

  useEffect(() => {
    if (content !== '' || imageFiles.length === 4 || selectedAudio || selectedVideo) {
      setButtonDisable(false)
    } else {
      setButtonDisable(true)
    }
  }, [content, imageFiles, selectedAudio, selectedVideo])

  if (!dataComment || !dataComment.profile) return null
  const { snapshotId } = formatPostContent(dataComment.content || '')
  const shouldShowVote = snapshotId && poll

  return (
    <ModalBase
      modalName={EModals.REPLY_MODAL}
      onCloseModal={() => dispatch(popModal())}
      afterClose={() => {
        setImageFiles([])
        setSelectedAudio(null)
        setSelectedVideo(null)
        dispatch(setTypePost({ type: EReferenceModule.PUBLIC }))
      }}
      className="reply-modal"
      isCloseIcon={false}
      rootClassName="reply-custom"
    >
      <div
        className="reply-inner p-4 hidden-scroll-bar"
        style={{ maxHeight: 700, overflowY: 'scroll' }}
      >
        <div
          className="close-bg d-flex align-items-center justify-content-center mb-4 cursor-pointer"
          onClick={() => {
            dispatch(popModal())
          }}
        >
          <IoClose size={30} color="#fff" />
        </div>
        <div className="post-info d-flex flex-column px-3">
          <div className="d-flex" style={{ overflow: 'hidden' }}>
            <div className="avatar me-2">
              <Avatar
                size={48}
                src={profile ? reformatToValidLink(dataComment.profile.avatar) : avt1}
                radius={'50%'}
              />
              <div className="border-image ms-auto me-auto mt-2 h-100" />
            </div>
            <div className="content flex-fill hidden-scroll-bar">
              <div className="author d-flex align-items-center gap-1">
                <div className="name">
                  {dataComment.profile.name ?? dataComment.profile.handle ?? dataComment.profile.id}
                </div>
                <div
                  style={{ minWidth: 16, minHeight: 16, maxHeight: 16, maxWidth: 16 }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <PiSealCheckFill size={16} />
                </div>
                <div className="handle opacity-50">@{dataComment.profile.handle}</div>
                <BsDot className="opacity-50" />
                <div className="time opacity-50">{reformatDateFromNow(dataComment.createdAt)}</div>
              </div>
              <div className="caption">
                <DetectedContent content={dataComment.content || ''} />
                {shouldShowVote && <VoteInformation voteData={poll} />}
              </div>
            </div>
          </div>
          <div className="d-flex">
            <div style={{ width: 48 }} className="me-2">
              <div className="border-image ms-auto me-auto" style={{ minHeight: 40 }} />
            </div>
            <div className="flex-fill reply-info">
              <span className="reply-to-text opacity-50"> Replying to </span>
              <span className="name">@{dataComment.profile.handle}</span>
            </div>
          </div>
        </div>
        <div className="reply-content px-3 mt-2">
          <div className="d-flex flex-column">
            <div className="d-flex">
              <div className="me-2">
                <Avatar
                  size={48}
                  src={profile ? reformatToValidLink(profile.avatar) : avt1}
                  radius={'50%'}
                />
              </div>
              <div className="reply-input flex-fill me-2">
                <div
                  role="textbox"
                  contentEditable="true"
                  aria-multiline="true"
                  aria-labelledby="txtboxMultilineLabel"
                  aria-required="true"
                  placeholder="Post your reply"
                  className="text-area-custom p-2 hover"
                  onInput={handleChangeContent}
                ></div>
              </div>
              <button
                className={`post-button hover ${buttonDisable ? 'opacity-50' : ''}`}
                disabled={buttonDisable}
                onClick={onClickComment}
              >
                Post
              </button>
            </div>
            <div className="d-flex d-none">
              <div style={{ width: 48, height: 1 }} className="me-2" />
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
                    disabled={
                      imageFiles.length > 0 || selectedAudio !== null || selectedVideo !== null
                    }
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
                    disabled={
                      imageFiles.length == 4 || selectedAudio !== null || selectedVideo !== null
                    }
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
                    disabled={
                      imageFiles.length > 0 || selectedAudio !== null || selectedVideo !== null
                    }
                  />
                </div>
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
          </div>
        </div>
      </div>
    </ModalBase>
  )
}
