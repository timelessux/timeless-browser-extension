import React from "react";
import { IoMdSwap } from "react-icons/io";

export function MirrorIcon() {
  return (
    <div
      style={{
        borderRadius: "50%",
        backgroundColor: "#DC143C",
        width: 16,
        height: 16,
        textAlign: "center",
      }}
      className="d-flex align-items-center justify-content-center"
    >
      <IoMdSwap color="#fff" size={12} />
    </div>
  );
}
