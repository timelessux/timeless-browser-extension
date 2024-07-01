import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FiLink } from 'react-icons/fi'
import { MdDeleteOutline, MdKeyboardArrowLeft } from 'react-icons/md'
import { EModals } from '../../../../ts'
import { TLink } from '../../../../ts/types'
import { storeLink } from '../../../../utils/chromeStorage'
import { isValidHttpUrl } from '../../../../utils/link'
import { usePageLoading } from '../../context/LoadingContext'
import { useAppDispatch } from '../../redux/hook'
import { popModal, pushModal } from '../../redux/slices/modal/modal.slice'
import { ConfirmModal } from '../modal/ConfirmModal'

type Props = {
  setStateBox: () => void
  link: TLink | null
  links: TLink[]
  index: number
}

type TValidateUrl = {
  isChecked: boolean
  isValid: boolean
}

export type TValidate = {
  validateTitle: boolean
  isCheckedTitle: boolean
  requied: boolean

  validateDescription?: boolean
  isCheckedDescription?: boolean
  requiedDescription?: boolean

  validateImage?: boolean
  isCheckedDImage?: boolean
  requiedImage?: boolean

  validatePrice?: boolean
  isCheckedPrice?: boolean
  requiedPrice?: boolean

  validateUrl: TValidateUrl[]
}

const maxLength = 255

const CreateLink = ({ setStateBox, link, links, index }: Props) => {
  const [title, setTitle] = useState<string>('')
  const [url, setUrl] = useState<string[]>([''])
  const [publicLink, setPublicLink] = useState<boolean>(false)
  const [validate, setValidate] = useState<TValidate>({
    validateTitle: true,
    isCheckedTitle: false,
    requied: true,
    validateUrl: [
      {
        isChecked: false,
        isValid: true
      }
    ]
  })

  const [disabledConfirm, setDisabledConfirm] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { openMessage } = usePageLoading()

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

  const setValueUrl = (value: string, index: number) => {
    const newListUrl = [...url]
    newListUrl[index] = value
    setUrl(newListUrl)
  }

  const handleAddNewUrl = () => {
    setUrl((prev) => [...prev, ''])
    setValidate((prev) => ({
      ...prev,
      validateUrl: [...validate.validateUrl, { isChecked: false, isValid: true }]
    }))
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

  const handleConfirm = () => {
    const titleTrim = title.trim()
    if (!validateTitle()) return
    if (!validateAllLink()) return

    const urlFilter = url.filter((url) => url.trim().length > 0 && isValidHttpUrl(url))

    if (!disabledConfirm && !link) {
      const newList = [{ isPublic: publicLink, title: titleTrim, links: urlFilter }, ...links]
      storeLink(newList)
      openMessage(
        'success',
        <span>
          <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Search Engine Links Created!</div>
          <div style={{ textAlign: 'left', fontFamily: 'Regular' }}>
            {urlFilter.length} {urlFilter.length > 1 ? 'links' : 'link'} saved
          </div>
        </span>,
        <FiLink color="#FFD60A" size={24} />
      )
      setStateBox()
      return
    }

    if (!disabledConfirm && link) {
      let data = links[index]
      data = { title: title, isPublic: publicLink, links: urlFilter }
      links[index] = data
      storeLink(links)
    }
    openMessage(
      'success',
      <span>
        <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Search Engine Links Updated!</div>
        <div style={{ textAlign: 'left', fontFamily: 'Regular' }}>
          {urlFilter.length} {urlFilter.length > 1 ? 'links' : 'link'} saved
        </div>
      </span>,
      <FiLink color="#FFD60A" size={24} />
    )
    setStateBox()
    return
  }

  const deleteLink = () => {
    if (link) {
      links.splice(index, 1)
      storeLink(links)
      openMessage(
        'success',
        <span>
          <div style={{ textAlign: 'left', fontFamily: 'Bold' }}>Search Engine Links Deleted!</div>
          <div style={{ textAlign: 'left', fontFamily: 'Regular' }}>
            {url.length} {url.length > 1 ? 'links' : 'link'} deleted
          </div>
        </span>,
        <FiLink color="#FFD60A" size={24} />
      )
    }
    setStateBox()
  }

  const openConfirmModal = () => {
    dispatch(pushModal({ name: EModals.CONFIRM_MODAL }))
  }

  // useEffect(() => {
  //   if (validate.validateTitle) {
  //     setDisabledConfirm(false)
  //   } else {
  //     setDisabledConfirm(true)
  //   }

  //   if (!validate.isCheckedTitle) {
  //     setDisabledConfirm(true)
  //     return
  //   }

  //   for (let index = 0; index < validate.validateUrl.length; index++) {
  //     if (!validate.validateUrl[index].isValid) {
  //       setDisabledConfirm(true)
  //       break
  //     }
  //   }
  // }, [validate, title, url])

  useEffect(() => {
    if (!link) return
    setPublicLink(link.isPublic)
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
  }, [link])

  return (
    <div className="create">
      <div className="d-flex mb-2 gap-3 align-items-center">
        <button className="hover back-button" onClick={setStateBox}>
          <MdKeyboardArrowLeft color="#fff" size={24} />
        </button>
        <span style={{ fontSize: 17 }}>{link ? 'Edit Link' : 'Create Link'}</span>
      </div>

      <div className="create-link-state hidden-scroll-bar fade-in px-2">
        <div className="mt-2">
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
          <div className="label px-2 opacity-50">Links</div>
          {url.map((urlValue, index) => {
            return (
              <div key={urlValue + index}>
                <div className="d-flex align-items-center gap-1">
                  <div
                    className={`input-box d-flex align-items-center px-3 py-2 mt-2 w-100 ${
                      validate.validateUrl[index].isChecked && !validate.validateUrl[index].isValid
                        ? '--error'
                        : ''
                    }`}
                  >
                    <input
                      autoFocus
                      value={urlValue}
                      type="text"
                      placeholder="URL"
                      className="w-100"
                      onChange={(e) => {
                        setValueUrl(e.target.value, index)
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
                <div className="text-danger" style={{ fontSize: 14, maxHeight: 14, minHeight: 14 }}>
                  {validate.validateUrl[index].isChecked && !validate.validateUrl[index].isValid
                    ? 'Invalid link'
                    : ''}
                </div>
              </div>
            )
          })}
        </div>
        <div className="px-4 mt-2">
          <span className="cursor-pointer add-other-link" onClick={handleAddNewUrl}>
            + Add another link
          </span>
        </div>
        <div className="d-flex gap-2 mb-4">
          <button
            className={`mt-4 w-100 add-button hover ${disabledConfirm ? 'disable opacity-50' : ''}`}
            onClick={handleConfirm}
            disabled={disabledConfirm}
          >
            {link ? 'Save' : 'Add'}
          </button>
          {link && (
            <button className={`mt-4 w-100 delete-button hover`} onClick={openConfirmModal}>
              Delete
            </button>
          )}
        </div>
        {/* <div className={`mt-4 d-flex align-items-center ${disabledConfirm ? 'opacity-50' : ''}`}>
          <span className="me-2">Make Public</span>
          <Switch
            checked={publicLink}
            onChange={() => {
              setPublicLink(!publicLink)
            }}
            disabled={disabledConfirm}
          />
        </div>
        <div className={`mt-1 mb-4 ${disabledConfirm ? 'opacity-50' : ''}`}>
          Make your list visible to others
        </div> */}
        <ConfirmModal
          title={'Permanently delete?'}
          subTitle={`Are you want to delete ${link?.title}?`}
          type="delete"
          cancelAction={() => {
            dispatch(popModal())
          }}
          confirmAction={() => {
            dispatch(popModal())
            deleteLink()
          }}
        />
      </div>
    </div>
  )
}

export default CreateLink
