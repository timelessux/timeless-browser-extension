import { TbFaceIdError } from "react-icons/tb";
import React from "react";

const Invalid = ({
  message = "Invalid!",
  visibleMessage = true,
}: {
  message?: string;
  isHiddenIcon?: boolean;
  visibleMessage?: boolean;
}) => {
  return (
    <div className="invalid w-100 h-100 d-flex flex-column justify-content-center align-items-center">
      <TbFaceIdError size={24} color="#edf2f4cc" />
      {visibleMessage && <p className="truncate-1">{message}</p>}
    </div>
  );
};

export default Invalid;
