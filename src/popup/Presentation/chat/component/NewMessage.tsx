import React from "react";
import { AiFillPlusCircle } from "react-icons/ai";


export const NewMessage = () => {
  return (
    <>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
      }}>
        <span style={{ fontWeight: 700, color: "black", fontSize: 24 }}>All messages</span>
        <AiFillPlusCircle color="blue" size={30} style={{ cursor: "pointer" }} />
      </div>
    </>
  )
}