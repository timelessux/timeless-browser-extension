import React, { memo, useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { FaArrowsRotate } from 'react-icons/fa6'
import { FiLink } from 'react-icons/fi'
import { MdDeleteOutline, MdKeyboardArrowLeft } from 'react-icons/md'
import { ExploreItemDTO, createStoreItem } from '../../../../services/explore'
import { isValidHttpUrl } from '../../../../utils/link'
import { cutAddress, dummyImage, randomImage } from '../../../../utils/textConvert'
import { usePageLoading } from '../../context/LoadingContext'
import { useAppSelector } from '../../redux/hook'
import { ImageMeta } from '../component/Image'
import LineNode from '../component/LineNode'
import { TValidate } from '../links/CreateLink'

type RemixViewProps = {
  goBack: () => void
}

const maxLength = 255
const maxlengthDescription = 512

const RemixView = (props: RemixViewProps) => {
  const { goBack } = props
  const [title, setTitle] = useState<string>('')
  const [url, setUrl] = useState<string[]>([''])
  const [description, setDescription] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [price, setPrice] = useState<string>('0')
  const [date, setDate] = useState<string>('')
  const ref = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const { exploreItem } = useAppSelector((state) => state.exploreState)
  const wallet = useAppSelector((state) => state.wallet.wallet)

  const [disabledConfirm, setDisabledConfirm] = useState<boolean>(false)
  const { openMessage, destroyMessage } = usePageLoading()
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

  const setValueUrl = (value: string, index: number) => {
    const newListUrl = [...url]
    newListUrl[index] = value
    setUrl(newListUrl)
  }

  const handleClearUrl = (index) => {
    const newListUrl = [...url]
    newListUrl[index] = ''
    setUrl(newListUrl)

    const newValidateUrl = [...validate.validateUrl]
    newValidateUrl[index] = { isChecked: false, isValid: false }
    setValidate((prev) => ({ ...prev, validateUrl: newValidateUrl }))
  }

  const handleRemoveUrl = (index) => {
    const newListUrl = [...url]
    newListUrl.splice(index, 1)
    setUrl(newListUrl)

    const newValidateUrl = [...validate.validateUrl]
    newValidateUrl.splice(index, 1)
    setValidate((prev) => ({ ...prev, validateUrl: newValidateUrl }))
  }

  const handleAddNewUrl = () => {
    setUrl((prev) => [...prev, ''])
    setValidate((prev) => ({
      ...prev,
      validateUrl: [...validate.validateUrl, { isChecked: false, isValid: true }]
    }))
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
    return false
  }

  const validateDescription = () => {
    const descriptionTrim = description.trim()

    setValidate((prev) => ({
      ...prev,
      validateDescription: descriptionTrim !== '' && descriptionTrim.length <= maxlengthDescription,
      isCheckedTitle: true
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
    return false
  }

  const validateImage = async () => {
    if (image.length === 0) {
      setValidate((prev) => ({
        ...prev,
        isCheckedDImage: true,
        requiedImage: false,
        validateImage: false
      }))
      setDisabledConfirm(true)
      return false
    }

    if (image.length > 0) {
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
    }

    setValidate((prev) => ({
      ...prev,
      isCheckedDImage: true,
      requiedImage: true,
      validateImage: true
    }))
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

    if (validate.validateUrl.length == 0) {
      setDisabledConfirm(true)
      return false
    }

    setDisabledConfirm(true)
    return false
  }

  const handleChangeContent = (e: React.FormEvent<HTMLDivElement>) => {
    setDescription(e.currentTarget.innerText)
  }

  const clearContent = () => {
    if (descriptionRef.current) {
      descriptionRef.current.innerText = ''
      setDescription('')
      setValidate((prev) => ({
        ...prev,
        validateDescription: false,
        isCheckedDescription: false
      }))
    }
  }

  const handleConfirm = async () => {
    const titleTrim = title.trim()
    const descriptionTrim = description.trim()
    const isImage = await validateImage()
    const isValidPrice = validatePrices()
    const isValidAllink = validateAllLink()
    const isValidTitle = validateTitle()
    const isValidateDescription = validateDescription()

    if (!isValidTitle || !isValidateDescription || !isValidPrice || !isImage || !isValidAllink) {
      onScrollToTop()
      return
    }
    setDisabledConfirm(true)
    const urlFilter = url.filter((url) => url.trim().length > 0 && isValidHttpUrl(url))

    if (!disabledConfirm) {
      const newItem: Partial<ExploreItemDTO> = {
        thumbnail: image,
        name: titleTrim,
        description: descriptionTrim,
        price: Number(price),
        links: url,
        parentId: exploreItem?.id
      }

      try {
        openMessage('loading', 'Sending...')
        await createStoreItem(newItem)
      } catch (error) {
        openMessage('error', 'Something went wrong...')
      } finally {
        destroyMessage()
      }

      openMessage(
        'success',
        <span>
          <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Remix success!</div>
          <div style={{ textAlign: 'left', fontFamily: 'Regular' }}>
            {urlFilter.length} {urlFilter.length > 1 ? 'links' : 'link'} saved
          </div>
        </span>,
        <FiLink color="#FFD60A" size={24} />
      )
      resetState()
      goBack()
      return
    }
    return
  }

  useEffect(() => {
    if (exploreItem) {
      // const currentDate = new Date()
      // const formattedDate = currentDate.toISOString()

      setTitle(exploreItem.name)
      setDescription(exploreItem.description)

      if (descriptionRef.current) {
        descriptionRef.current.innerText = exploreItem.description
      }
      setImage(exploreItem.thumbnail)
      setPrice(exploreItem.price.toString())
      setUrl(exploreItem.links)
      setValidate({
        ...validate,
        validateUrl: exploreItem.links.map(() => {
          return {
            isChecked: true,
            isValid: true
          }
        })
      })
      setDate(`${exploreItem.ipOrg.createdAt}`)

      if (exploreItem.links.length === 0) {
        setDisabledConfirm(true)
      }
    }
    onScrollToTop()
  }, [exploreItem])

  if (!wallet) return

  return (
    <div className="remixViewContainer pt-4">
      <div className="headerContainer d-flex align-items-center gap-3">
        <button onClick={goBack} className="goBackButton">
          <MdKeyboardArrowLeft color="#fff" size={24} />
        </button>
        <div className="remix-button-text">Remix</div>
      </div>
      <div className="row gx-0 h-100">
        <div className="col-4 h-100">
          <div className="h-100 d-flex flex-column align-items-center justify-content-end">
            <div className="col-5 ms-auto me-auto mb-5">
              <div className="remix-from">
                <div className="title truncate-1">{exploreItem?.name}</div>
                <img src={exploreItem?.thumbnail} alt="" />
                <div
                  className="d-flex flex-column align-items-center justify-content-center w-100"
                  style={{ marginTop: -5 }}
                >
                  <LineNode />
                  <div className="mt-1">Remix from</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-4 h-100 ms-auto me-auto hidden-scroll-bar fade-in"
          style={{ overflow: 'scroll' }}
        >
          <div className="remix-box background-box">
            <div className="mt-2" ref={ref}>
              <div className="label px-2 opacity-50">Title</div>
              <div>
                <div
                  className={`input-box px-3 py-2 d-flex align-items-center mt-1 w-100 ${
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
              <div
                className={`input-box w-100 text-area-custom d-flex hover px-3 py-2 ${
                  validate.isCheckedDescription && !validate.validateDescription ? '--error' : ''
                }`}
              >
                <div
                  style={{ width: 'calc(100% - 24px)' }}
                  role="textbox"
                  contentEditable="true"
                  aria-multiline="true"
                  aria-labelledby="txtboxMultilineLabel"
                  aria-required="true"
                  placeholder="Post your reply"
                  className="textbox"
                  onInput={(e) => {
                    handleChangeContent(e)
                    setDisabledConfirm(false)
                    setValidate((prev) => ({
                      ...prev,
                      isCheckedDescription: true,
                      requiedDescription: true,
                      validateDescription: true
                    }))
                  }}
                  ref={descriptionRef}
                ></div>
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
                    <AiOutlineClose onClick={clearContent} />
                  </div>
                )}
              </div>
              <div className="text-danger" style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}>
                {validate.isCheckedDescription && !validate.validateDescription
                  ? !validate.requiedDescription
                    ? 'Please enter description'
                    : `Max char description is ${maxlengthDescription}`
                  : ''}
              </div>
            </div>

            <div className="mt-2">
              <div className="label px-2 opacity-50">Remix from</div>
              <div className="card-remix row">
                <div className="col-6">
                  <img src={exploreItem?.thumbnail} />
                </div>
                <div className="col-6 right">
                  <div className="title truncate-1">{exploreItem?.name}</div>
                  <div className="description truncate-5">{exploreItem?.description}</div>
                  <div className="author">Curated by: {exploreItem?.curator.name}</div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <div className="label px-2 opacity-50">Collection image</div>
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
                        onClick={() => {
                          setImage('')
                          setValidate((prev) => ({
                            ...prev,
                            isCheckedDImage: true,
                            requiedImage: true,
                            validateImage: true
                          }))
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-danger" style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}>
                  {validate.isCheckedDImage && !validate.isCheckedDImage
                    ? !validate.requiedImage
                      ? 'Please enter image'
                      : `Please enter valid image`
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
              <div className="label px-2 opacity-50">New sources</div>
              {url.map((urlValue, index) => {
                return (
                  <div key={index}>
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
                          value={urlValue}
                          type="text"
                          placeholder="URL"
                          className="w-100"
                          onChange={(e) => {
                            setValueUrl(e.target.value, index)
                            setDisabledConfirm(false)
                          }}
                        />
                        {urlValue !== '' && (
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
                        )}
                      </div>
                      {url.length > 1 && (
                        <MdDeleteOutline size={20} onClick={() => handleRemoveUrl(index)} />
                      )}
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

            {url.length === 0 && (
              <div className="text-danger" style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}>
                Please create one link valid
              </div>
            )}
            <div className="px-4 mt-2">
              <span className="cursor-pointer add-other-link" onClick={handleAddNewUrl}>
                + Add another link
              </span>
            </div>
            <div className="d-flex gap-2 mb-4">
              <button
                className={`mt-4 w-100 add-button hover ${
                  disabledConfirm ? 'disable opacity-50' : ''
                }`}
                onClick={handleConfirm}
                disabled={disabledConfirm}
              >
                {'Complete remix'}
              </button>
            </div>
          </div>
        </div>
        <div className="col-4 h-100">
          <div className="h-100 d-flex flex-column align-items-center justify-content-end">
            <div className="col-10 ms-auto me-auto mb-4">
              <div className="box-grey">
                <div className="info-item px-4 py-3 d-flex justify-content-between">
                  <div className="flex-fill">IPA Organization Name</div>
                  <div className="opacity-50 truncate-1">{exploreItem?.ipOrg.name ?? ''}</div>
                </div>
                <div className="info-item px-4 py-3 d-flex justify-content-between">
                  <div className="flex-fill">Address</div>
                  <div className="opacity-50">
                    {cutAddress({ address: exploreItem?.ipOrg.txHash ?? '' })}
                  </div>
                </div>
                <div className="info-item px-4 py-3 d-flex justify-content-between">
                  <div className="flex-fill">Created</div>
                  <div className="opacity-50">{date}</div>
                </div>
                <div className="info-item px-4 py-3 d-flex justify-content-between">
                  <div className="flex-fill">IPA Type</div>
                  <div className="opacity-50">Links</div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <a
                  className="open-sea-button box-grey hover mt-2 d-flex gap-2 align-items-center px-5 py-2"
                  target="_blank"
                  rel="noreferrer"
                  href={exploreItem?.socialLinks?.explorerLink}
                >
                  <span className="d-flex align-items-center" style={{ height: 16 }}>
                    <BsFillArrowUpRightCircleFill />
                  </span>
                  <span className="ms-2">Explorer</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(RemixView)
