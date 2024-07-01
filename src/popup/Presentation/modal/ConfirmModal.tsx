import React from "react";
import { useAppDispatch } from "../../redux/hook";
import { EModals } from "../../../../ts";
import { popModal } from "../../redux/slices/modal/modal.slice";
import { ModalBase } from "./ModalBase";
import { ImWarning } from "react-icons/im";

type Props = {
  title: string;
  subTitle: string;
  type: "delete" | "confirm";
  confirmAction: () => void;
  cancelAction: () => void;
};

export const ConfirmModal = ({ title, subTitle, type, cancelAction, confirmAction }: Props) => {
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    dispatch(popModal());
  };

  return (
    <ModalBase
      modalName={EModals.CONFIRM_MODAL}
      onCloseModal={handleCancel}
      className="confirm-modal"
      isCloseIcon={false}
    >
      <div className="confirm-inner p-3">
        <div className="text-center">
          <ImWarning size={40} color="#FFEA00" />
        </div>
        <div className="title text-center mt-3">{title}</div>
        <div className="sub-title text-center mt-1">{subTitle}</div>
        <div className="line-top mt-3" />
        <div className="d-flex flex-column gap-3 mt-3">
          <button className="cancel-button hover py-2" onClick={cancelAction}>
            Keep
          </button>
          <button
            className={`confirm-button hover py-2 ${type === "delete" ? "--delete" : ""}`}
            onClick={confirmAction}
          >
            Delete
          </button>
        </div>
      </div>
    </ModalBase>
  );
};
