import React from "react";

export function XMTPConnect({ handleConnect, isLoading }: { handleConnect, isLoading: boolean }) {
  return (
    <div className="d-flex flex-column gap-3">
      <span style={{ fontWeight: 700, color: "#000", fontSize: 18 }}>Timeless x Your fave messenger</span>
      <button
        onClick={handleConnect}
        style={{
          backgroundColor: "blue",
          border: "none",
          fontWeight: 700,
          color: "#fff",
          padding: 20,
          borderRadius: 40
        }}>
        {isLoading ? "Awaiting signatures..." : "Connect to XMTP"}
      </button>
    </div>
  )
}
