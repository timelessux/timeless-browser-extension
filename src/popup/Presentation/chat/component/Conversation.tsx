import type { CachedConversation } from "@xmtp/react-sdk";
import { useLastMessage } from "@xmtp/react-sdk";
import { Avatar } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { calculateTimeDifference, cutAddress, cutMessage } from "../../../../../utils/textConvert";
import { setConversation } from "../../../redux/conversation/conversation.slice";

const Conversation = ({ conversation }: { conversation: CachedConversation }) => {
  const dispatch = useDispatch()
  const message = useLastMessage(conversation.topic)

  const selectConversaion = () => {
    dispatch(setConversation(conversation))
  }

  return (
    <div
      className="hover"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: 20,
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      onClick={selectConversaion}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "center", }}>
        <Avatar size={50} src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${Math.ceil(Math.random() * 50)}`} />
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 5
        }}>
          <span style={{ fontWeight: 700 }}>{cutAddress({ address: conversation.peerAddress })}</span>
          {message && <span style={{ opacity: 0.6 }}>{cutMessage(message.content)}</span>}
        </div>
      </div>
      <span style={{ opacity: 0.6 }}>{calculateTimeDifference(conversation.updatedAt?.toISOString())}</span>
    </div>
  )
}

export default Conversation