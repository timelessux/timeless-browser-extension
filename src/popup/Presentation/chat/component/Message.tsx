import { CachedConversation, isValidAddress, useCanMessage, useMessages, useSendMessage, useStreamMessages } from "@xmtp/react-sdk";
import { Avatar, Button, Input } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { useAppSelector } from "../../../redux/hook";

const MessageBody = ({ conversation }: { conversation: CachedConversation }) => {
  const divRef = useRef<HTMLDivElement>(null)

  const { messages } = useMessages(conversation);
  useStreamMessages(conversation)

  const formatSentAt = (time: Date) => {
    const sentTime = moment(time)
    return sentTime.format("hh:mm A")
  }

  const renderDateThread = (messages, idx) => {
    const curSentDay = moment(messages[idx].sentAt).format("MMMM D, yyyy")

    let preSentDay = ""
    if (idx > 0) {
      preSentDay = moment(messages[idx - 1].sentAt).format("MMMM D, yyyy")
    }

    if (curSentDay !== preSentDay) {
      return (
        <div className="d-flex align-items-center mb-5">
          <div style={{ height: 2, backgroundColor: "#00000013" }} className="flex-grow-1"></div>
          <div>{curSentDay}</div>
          <div style={{ height: 2, backgroundColor: "#00000013" }} className="flex-grow-1"></div>
        </div>
      )
    } else {
      return <></>
    }
  }

  if (divRef.current) {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }

  return (
    <div
      ref={divRef}
      style={{
        height: "100%",
        maxHeight: "100%",
        overflowY: "scroll",
        opacity: 1
      }}
      className="hidden-scroll-bar d-flex flex-column p-4"
    >
      {messages.map((message, idx) => {
        const isMessageMe = message.senderAddress === conversation.walletAddress
        return (
          <>
            {renderDateThread(messages, idx)}
            <div
              style={{
                width: "fit-content",
                maxWidth: "70%",
                overflowWrap: "break-word",
              }}
              className={`px-3 py-2 mb-3 ${isMessageMe ? "align-self-end" : ""}`}
              key={message.id}
            >
              <p
                style={{ borderRadius: isMessageMe ? "15px 15px 0px 15px" : "15px 15px 15px 0px", }}
                className="m-0 bg-primary py-2 px-3"
              >
                {message.content}
              </p>
              <div style={{ textAlign: isMessageMe ? "end" : "start" }}>
                <span>{formatSentAt(message.sentAt)}</span>
              </div>
            </div>
          </>
        )
      })}
    </div>
  )
}


export const Messages = () => {
  const [peerAddress, setPeerAddress] = useState("");
  const [isOnNetwork, setIsOnNetwork] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { canMessage } = useCanMessage();
  const { sendMessage } = useSendMessage();


  const { conversation } = useAppSelector((state) => state.conversation)


  useEffect(() => {
    if (conversation) {
      setPeerAddress(conversation.peerAddress)
      setIsOnNetwork(true)
    }
  }, [conversation])

  const handleCheckAddress = useCallback(async () => {
    if (isValidAddress(peerAddress)) {
      setIsLoading(true);
      setIsOnNetwork(await canMessage(peerAddress))
      setIsLoading(false);
    } else {
      setIsOnNetwork(false);
    }
  }, [peerAddress])

  const handleSendMessage = useCallback(
    async () => {
      if (peerAddress && isValidAddress(peerAddress) && message && conversation) {
        setMessage("")
        await sendMessage(conversation, message);
      }
    },
    [message, peerAddress, sendMessage],
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      width: "67%",
    }}>
      <div style={{
        display: "flex",
        boxShadow: "0 2px 2px rgb(0,0,0,0.251)",
        padding: 10
      }}>
        {isOnNetwork ?
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <Avatar
              src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${Math.ceil(Math.random() * 50)}`}
            />
            <span style={{ fontWeight: 700, fontSize: 18 }}>{peerAddress}</span>
          </div> :
          <>
            <Input style={{ color: "black", width: "5%" }} defaultValue="To:" bordered={false} disabled />
            <Input
              style={{ width: "90%" }}
              placeholder={"Enter a 0x wallet, ENS, or UNS address"}
              bordered={false}
              value={peerAddress}
              onChange={({ target: { value } }) => setPeerAddress(value)}
            />
            {peerAddress &&
              <Button type="text" onClick={handleCheckAddress} loading={isLoading}>
                <IoArrowForwardCircleOutline size={24} />
              </Button>}
          </>
        }
      </div>
      {conversation && <MessageBody conversation={conversation} />}
      <div style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        padding: 20
      }}>
        <Input
          style={{ resize: "none" }}
          placeholder="Write a message"
          allowClear
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage()
          }}
        />
        <Button type="text" onClick={handleSendMessage}>
          <BsFillSendFill size={24} color="blue" />
        </Button>
      </div>
    </div >
  );
};


















