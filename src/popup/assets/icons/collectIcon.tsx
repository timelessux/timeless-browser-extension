import React from "react";
import { BiSolidCollection } from "react-icons/bi";

export function CollectIcon() {
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
      <BiSolidCollection color="#fff" size={12} />
    </div>
  );
}
