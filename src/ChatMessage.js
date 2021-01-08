import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import "./ChatMessage.css";

function ChatMessage({ name, message, timestamp }) {
  const user = useSelector(selectUser);

  return (
    <div className="chat__messageContainer">
      <p
        className={`chat__message ${
          name === user.displayName && "chat__reciever"
        }`}
      >
        <span className="chat__name">{name}</span>
        {message}
        <span className="chat__timestamp">{timestamp}</span>
      </p>
    </div>
  );
}

export default ChatMessage;
