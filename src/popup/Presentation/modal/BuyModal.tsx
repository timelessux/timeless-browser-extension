import React from "react"
import { ModalBase } from "./ModalBase"
import { EModals } from "../../../../ts"
import { useAppDispatch } from "../../redux/hook";
import { popModal } from "../../redux/slices/modal/modal.slice";

interface Props {
  url: string
}

function BuyModal({ url }: Props) {
  const dispatch = useAppDispatch();

  return (
    <ModalBase
      modalName={EModals.BUY_MODAL}
      onCloseModal={() => dispatch(popModal())}
      style={{
        backgroundColor: "#1c1c1e",
        borderRadius: "20px",
      }}
    >
      <iframe
        className="buy-iframe"
        src={url}
        style={{
          width: "100%",
          height: "60vh",
          marginTop: "30px",
          backgroundColor: "#1c1c1e",
        }}
        loading="lazy"
      />
    </ModalBase>
  )
}

export default BuyModal