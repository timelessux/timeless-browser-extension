import React, { useEffect } from "react";
import { NoSelectedConversationNotification } from "./NoSelectedConversationNotification";
import { useConversations, useStreamConversations } from "@xmtp/react-sdk";
import Conversation from "./Conversation";

export const Inbox = () => {
  const { conversations, isLoaded } = useConversations();
  useStreamConversations();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderWidth: "5px",
      }}>
      {!conversations && <NoSelectedConversationNotification />}
      {isLoaded &&
        <div style={{ width: "100%", height: "100%" }}>
          {conversations.map(conversation => (
            <Conversation key={conversation.topic} conversation={conversation} />
          ))}
        </div>
      }
    </div>
  );
};
