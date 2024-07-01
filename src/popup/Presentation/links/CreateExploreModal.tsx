import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaArrowsRotate } from 'react-icons/fa6'
import { FiLink } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { ExploreItemDTO, createStoreItem } from '../../../../services/explore'
import { EModals } from '../../../../ts'
import { isValidHttpUrl } from '../../../../utils/link'
import { dummyImage, randomImage } from '../../../../utils/textConvert'
import { usePageLoading } from '../../context/LoadingContext'
import { useAppDispatch, useAppSelector } from '../../redux/hook'
import { popModal } from '../../redux/slices/modal/modal.slice'
import { ImageMeta } from '../component/Image'
import { ModalBase } from '../modal/ModalBase'
import { TValidate } from './CreateLink'
import { TLink } from '../../../../ts/types'
import { storeLink } from '../../../../utils/chromeStorage'

const maxLength = 255
const maxLengthDescription = 512

function CreateExploreModal() {
  const LinkData = useAppSelector((state) =>
    state.modal.modalStack.find((modal) => modal.name === EModals.CREATE_EXPLORE_MODAL)
  )?.data

  const [link, setLink] = useState<TLink>()
  const [links, setLinks] = useState<TLink[]>([])
  const [index, setIndex] = useState<number>(0)
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [price, setPrice] = useState<string>('0')

  const [url, setUrl] = useState<string[]>([''])
  const [validate, setValidate] = useState<TValidate>({
    validateTitle: true,
    isCheckedTitle: false,
    requied: true,

    validateDescription: true,
    isCheckedDescription: false,
    requiedDescription: true,

    isCheckedDImage: false,
    validateImage: true,
    requiedImage: true,

    isCheckedPrice: false,
    validatePrice: true,
    requiedPrice: true,

    validateUrl: [
      {
        isChecked: false,
        isValid: true
      }
    ]
  })

  const [disabledConfirm, setDisabledConfirm] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { openMessage, destroyMessage } = usePageLoading()
  const ref = useRef<HTMLDivElement>(null)
  const wallet = useAppSelector((state) => state.wallet.wallet)

  const setIsPublicLink = (link: TLink, index: number) => {
    let data = links[index]
    data = { ...link, isPublic: true }
    links[index] = data
    storeLink(links)
  }

  const setValueUrl = (value: string, index: number) => {
    const newListUrl = [...url]
    newListUrl[index] = value
    setUrl(newListUrl)
  }

  const onScrollToTop = () => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
  const resetState = () => {
    setDescription('')
    setPrice('0')
    setImage('')
  }

  function isImageUrl(url) {
    return new Promise(function (resolve) {
      const img = new Image()

      img.onload = function () {
        resolve(true)
      }

      img.onerror = function () {
        resolve(false)
      }

      img.src = url
    })
  }

  const validateTitle = () => {
    const titleTrim = title.trim()

    setValidate((prev) => ({
      ...prev,
      validateTitle: titleTrim !== '' && titleTrim.length <= maxLength,
      isCheckedTitle: true
    }))

    if (titleTrim.length === 0) {
      setValidate((prev) => ({
        ...prev,
        isChecked: true,
        requied: false,
        validateTitle: false
      }))
      setDisabledConfirm(true)
      return false
    }

    if (titleTrim !== '' && titleTrim.length <= maxLength) {
      setDisabledConfirm(false)
      return true
    }
  }

  const validateDescription = () => {
    const descriptionTrim = description.trim()

    setValidate((prev) => ({
      ...prev,
      validateDescription: descriptionTrim !== '' && descriptionTrim.length <= maxLengthDescription,
      isCheckedDescription: true
    }))

    if (descriptionTrim.length === 0) {
      setValidate((prev) => ({
        ...prev,
        isCheckedDescription: true,
        requiedDescription: false,
        validateDescription: false
      }))
      setDisabledConfirm(true)
      return false
    }

    if (descriptionTrim !== '' && descriptionTrim.length <= maxLength) {
      setDisabledConfirm(false)
      return true
    }
  }

  const validateImage = async () => {
    if (image === '') {
      setValidate((prev) => ({
        ...prev,
        isCheckedDImage: true,
        requiedImage: false,
        validateImage: false
      }))
      setDisabledConfirm(true)
      return false
    }

    const isImage = await isImageUrl(image).then(function (result) {
      return result
    })

    if (!isImage) {
      setValidate((prev) => ({
        ...prev,
        isCheckedDImage: true,
        requiedImage: false,
        validateImage: false
      }))
      setDisabledConfirm(true)
      return false
    }
    setDisabledConfirm(false)
    return true
  }

  const validatePrices = () => {
    const priceConvert = Number(price)
    if (!price || priceConvert === 0) {
      setValidate((prev) => ({
        ...prev,
        validatePrice: false,
        isCheckedPrice: true
      }))
      return false
    }

    if (priceConvert > 0) return true
    return false
  }

  const validateAllLink = () => {
    const tmpValidateUrl = [...validate.validateUrl]
    const tmpUrls = [...url]

    const hasOneUrl = tmpUrls.filter((url) => url.trim().length > 0)

    if (hasOneUrl.length > 0) {
      const hasValidLink = tmpUrls.every((urlString) => {
        const trimmedUrl = urlString.trim()
        return (trimmedUrl.length > 0 && isValidHttpUrl(trimmedUrl)) || trimmedUrl.length === 0
      })

      tmpUrls.forEach((url, index) => {
        const trimmedUrl = url.trim()
        const isValid = trimmedUrl.length > 0 && isValidHttpUrl(trimmedUrl)
        if (trimmedUrl.length > 0) {
          tmpValidateUrl[index] = {
            isChecked: true,
            isValid: isValid
          }
        } else {
          tmpValidateUrl[index] = {
            isChecked: true,
            isValid: trimmedUrl.length === 0
          }
        }
      })

      setValidate({
        ...validate,
        validateUrl: tmpValidateUrl
      })

      return hasValidLink
    }
    setValidate({
      ...validate,
      validateUrl: tmpUrls.map(() => {
        return {
          isChecked: true,
          isValid: false
        }
      })
    })
    return false
  }

  const handleConfirm = async () => {
    const titleTrim = title.trim()
    const descriptionTrim = description.trim()
    const isImage = await validateImage()
    const isValidPrice = validatePrices()

    setDisabledConfirm(true)
    if (
      !validateTitle() ||
      !validateDescription() ||
      !isValidPrice ||
      !isImage ||
      !validateAllLink()
    ) {
      onScrollToTop()
      return
    }

    if (!disabledConfirm && wallet) {
      const newItem: Partial<ExploreItemDTO> = {
        thumbnail: image,
        name: titleTrim,
        description: descriptionTrim,
        price: Number(price),
        links: url,
        createdAt: new Date().toISOString()
      }

      try {
        openMessage('loading', 'Sending...')
        await createStoreItem(newItem)
        link && setIsPublicLink(link, index)
      } catch (error) {
        openMessage('error', 'Something went wrong...')
      } finally {
        destroyMessage()
      }

      openMessage(
        'success',
        <span>
          <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Explore Created!</div>
        </span>,
        <FiLink color="#FFD60A" size={24} />
      )
      resetState()
      dispatch(popModal())
      return
    }
  }

  useEffect(() => {
    if (LinkData) {
      const linksDataParse = JSON.parse(LinkData)
      const { link, links, index } = linksDataParse
      setLinks(links)
      setLink(link)
      setIndex(index)
      setTitle(link.title)
      setUrl(link.links)
      setValidate({
        validateTitle: true,
        isCheckedTitle: true,
        requied: true,
        validateUrl: link.links.map(() => {
          return {
            isChecked: true,
            isValid: true
          }
        })
      })
    }
  }, [LinkData])

  return (
    <ModalBase
      className="create-explore-modal"
      modalName={EModals.CREATE_EXPLORE_MODAL}
      onCloseModal={() => {
        resetState()
        dispatch(popModal())
      }}
      isCloseIcon={false}
    >
      <div className="create-explore-inner">
        <div className="d-flex me-2 mt-2 ms-3">
          <div className="title-header">Publish Collection</div>
          <div
            className="close-bg d-flex align-items-center justify-content-center cursor-pointer ms-auto"
            onClick={() => {
              resetState()
              dispatch(popModal())
            }}
          >
            <IoClose size={30} color="#fff" />
          </div>
        </div>

        <div className="create-explore-content hidden-scroll-bar fade-in px-2">
          <div className="mt-2" ref={ref}>
            <div className="label px-2 opacity-50">Title</div>
            <div>
              <div
                className={`input-box px-3 py-2 d-flex align-items-center  mt-1 w-100 ${
                  validate.isCheckedTitle && !validate.validateTitle ? '--error' : ''
                }`}
              >
                <input
                  value={title}
                  type="text"
                  placeholder="Title"
                  className="w-100"
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setDisabledConfirm(false)
                    setValidate((prev) => ({
                      ...prev,
                      isChecked: true,
                      requied: true,
                      validateTitle: true
                    }))
                  }}
                />
                {title !== '' && (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: '50%',
                      background: '#ffffff33'
                    }}
                  >
                    <AiOutlineClose
                      className="cursor-pointer"
                      onClick={() => {
                        setTitle('')
                        setValidate((prev) => ({
                          ...prev,
                          validateTitle: false,
                          isCheckedTitle: false
                        }))
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="text-danger" style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}>
                {validate.isCheckedTitle && !validate.validateTitle
                  ? !validate.requied
                    ? 'Please enter title'
                    : `Max char title is ${maxLength}`
                  : ''}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="label px-2 opacity-50">Description</div>
            <div>
              <div
                className={`input-box px-3 py-2 d-flex align-items-center  mt-1 w-100 ${
                  validate.isCheckedDescription && !validate.validateDescription ? '--error' : ''
                }`}
              >
                <input
                  value={description}
                  type="text"
                  placeholder="Description"
                  className="w-100"
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setDisabledConfirm(false)
                    setValidate((prev) => ({
                      ...prev,
                      isCheckedDescription: true,
                      requiedDescription: true,
                      validateDescription: true
                    }))
                  }}
                />
                {description !== '' && (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: '50%',
                      background: '#ffffff33'
                    }}
                  >
                    <AiOutlineClose
                      className="cursor-pointer"
                      onClick={() => {
                        setDescription('')
                        setValidate((prev) => ({
                          ...prev,
                          validateDescription: false,
                          isCheckedDescription: false
                        }))
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="text-danger" style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}>
                {validate.isCheckedDescription && !validate.validateDescription
                  ? !validate.requiedDescription
                    ? 'Please enter description'
                    : `Max char description is ${maxLengthDescription}`
                  : ''}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="label px-2 opacity-50">Link image</div>
            <div>
              <div
                className={`input-box px-3 py-2 d-flex align-items-center  mt-1 w-100 ${
                  validate.isCheckedDImage && !validate.validateImage ? '--error' : ''
                }`}
              >
                <input
                  value={image}
                  type="text"
                  placeholder="Image link"
                  className="w-100"
                  onChange={(e) => {
                    setImage(e.target.value)
                    setDisabledConfirm(false)
                    setValidate((prev) => ({
                      ...prev,
                      isCheckedDImage: true,
                      requiedImage: true,
                      validateImage: true
                    }))
                  }}
                />
                <FaArrowsRotate
                  className="cursor-pointer ms-1 me-1"
                  onClick={() => {
                    const res = randomImage(dummyImage)
                    setImage(res)
                  }}
                />
                {image !== '' && (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      borderRadius: '50%',
                      background: '#ffffff33'
                    }}
                  >
                    <AiOutlineClose
                      className="cursor-pointer"
                      onClick={() => {
                        setImage('')
                        setValidate((prev) => ({
                          ...prev,
                          validateImage: false,
                          isCheckedDImage: false
                        }))
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="text-danger" style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}>
                {validate.isCheckedDImage && !validate.validateImage
                  ? !validate.requiedImage
                    ? 'Please valid enter image'
                    : `Max char image is ${maxLength}`
                  : ''}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="label px-2 opacity-50">Preview Image</div>
            <div className="col-6">
              <ImageMeta url={image} name="image-generate" />
            </div>
          </div>
          <div className="mt-2">
            <div className="label px-2 opacity-50">Price</div>
            <div>
              <div
                className={`input-box px-3 py-2 d-flex align-items-center  mt-1 w-100 ${
                  validate.isCheckedPrice && !validate.validatePrice ? '--error' : ''
                }`}
              >
                <input
                  className="w-100"
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value)
                    setValidate((prev) => ({
                      ...prev,
                      isCheckedPrice: true,
                      requiedPrice: true,
                      validatePrice: true
                    }))
                    setDisabledConfirm(false)
                  }}
                  onWheel={(e) => e.currentTarget.blur()}
                  onFocus={() => {
                    if (price === '0') {
                      setPrice('')
                    }
                  }}
                  onBlur={() => {
                    if (price === '') {
                      setPrice('0')
                    }
                  }}
                />
              </div>
              <div className="text-danger" style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}>
                {validate.isCheckedPrice && !validate.validatePrice
                  ? !validate.requiedPrice
                    ? 'Please enter price'
                    : `Price more than 0`
                  : ''}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="label px-2 opacity-50">Links</div>
            {url.map((urlValue, index) => {
              return (
                <div key={urlValue + index}>
                  <div className="d-flex align-items-center gap-1">
                    <div
                      className={`input-box d-flex align-items-center px-3 py-2 mt-2 w-100 ${
                        validate.validateUrl[index].isChecked &&
                        !validate.validateUrl[index].isValid
                          ? '--error'
                          : ''
                      }`}
                    >
                      <input
                        readOnly
                        autoFocus
                        value={urlValue}
                        type="text"
                        placeholder="URL"
                        className="w-100"
                        onChange={(e) => {
                          setValueUrl(e.target.value, index)
                        }}
                      />
                      {/* {urlValue !== '' && (
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: 24,
                            height: 24,
                            minWidth: 24,
                            borderRadius: '50%',
                            background: '#ffffff33'
                          }}
                        >
                          <AiOutlineClose
                            onClick={() => {
                              handleClearUrl(index)
                            }}
                          />
                        </div>
                      )} */}
                    </div>
                    {/* {url.length > 1 && (
                      <MdDeleteOutline size={20} onClick={() => handleRemoveUrl(index)} />
                    )} */}
                  </div>
                  <div
                    className="text-danger"
                    style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}
                  >
                    {validate.validateUrl[index].isChecked && !validate.validateUrl[index].isValid
                      ? 'Invalid link'
                      : ''}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="d-flex gap-2 mb-4">
            <button
              className={`mt-4 w-100 add-button hover ${
                disabledConfirm ? 'disable opacity-50' : ''
              }`}
              onClick={handleConfirm}
              disabled={disabledConfirm}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  )
}

export default CreateExploreModal
