import React from "react";
import { VscMention } from "react-icons/vsc";

export function MentionsIcon() {
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
      <VscMention color="#fff" size={12} />
    </div>
  );
}
