import React from "react";
import { AiFillHeart } from "react-icons/ai";

export function LikeIcon() {
  return (
    <div
      style={{
        borderRadius: "50%",
        backgroundColor: "#D2042D",
        width: 16,
        height: 16,
        textAlign: "center",
      }}
      className="d-flex align-items-center justify-content-center"
    >
      <AiFillHeart color="#fff" size={12} />
    </div>
  );
}
