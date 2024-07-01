import React from "react";
import { BsReplyFill } from "react-icons/bs";

export function ReplyIcon() {
  return (
    <div
      style={{
        borderRadius: "50%",
        backgroundColor: "#7CFC00",
        width: 16,
        height: 16,
        textAlign: "center",
      }}
      className="d-flex align-items-center justify-content-center"
    >
      <BsReplyFill color="#fff" size={16} />
    </div>
  );
}
