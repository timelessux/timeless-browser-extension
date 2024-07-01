import { Modal } from 'antd'
import { ReactNode } from 'react'
import { EModals } from '../../../../ts'
import { useAppSelector } from '../../redux/hook'
import React from 'react'
import { IoClose } from 'react-icons/io5'

type ModalProps = {
  modalName: EModals
  children: ReactNode
  className?: string
  onCloseModal(): void
  afterClose?: () => void
  isCloseIcon?: boolean
  customModalInner?: string
  customIconClose?: ReactNode
  style?: React.CSSProperties
  width?: string
  rootClassName?: string
}

export function ModalBase({
  modalName,
  children,
  onCloseModal,
  afterClose,
  isCloseIcon = true,
  className,
  customModalInner,
  customIconClose,
  style,
  width,
  rootClassName
}: ModalProps) {
  const modalStack = useAppSelector((state) => state.modal.modalStack)
  const isOpen = modalStack.find((modal) => modal.name === modalName) !== undefined
  function handleAfterClose() {
    afterClose && afterClose()
  }

  return (
    <Modal
      open={isOpen}
      centered
      className={`modal-base ${className ? className : ''}`}
      footer={null}
      maskClosable={true}
      destroyOnClose={true}
      onCancel={onCloseModal}
      afterClose={handleAfterClose}
      style={style}
      width={width}
      rootClassName={rootClassName}
      modalRender={() => (
        <div
          className={`modal-inner position-relative ${customModalInner ? customModalInner : ''}`}
        >
          {children}
          {isCloseIcon && isCloseIcon && (
            <div className="close-icon cursor-pointer" onClick={onCloseModal}>
              {customIconClose || (
                <div className="close-bg m-2">
                  <IoClose size={24} color="#e0e8ff99" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    />
  )
}
