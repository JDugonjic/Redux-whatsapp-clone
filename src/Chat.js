import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import db from "./firebase";
import firebase from "firebase";
import ChatMessage from "./ChatMessage";
import { useParams } from "react-router-dom";
import { selectUser } from "./features/userSlice";
import { useSelector } from "react-redux";
import Picker from "emoji-picker-react";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const user = useSelector(selectUser);
  const [showPicker, setShowPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [messages]);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setInput(input + emojiObject.emoji);
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          )
        );
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("rooms").doc(roomId).collection("messages").add({
      name: user.displayName,
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar>{messages[messages.length - 1]?.data.name[0]}</Avatar>
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            last seen at{" "}
            {new Date(
              messages[messages.length - 1]?.data.timestamp?.toDate()
            ).toLocaleTimeString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map(({ id, data: { name, message, timestamp } }) => (
          <ChatMessage
            key={id}
            name={name}
            message={message}
            timestamp={new Date(timestamp?.seconds * 1000).toLocaleTimeString()}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat__footer">
        {showPicker && <Picker onEmojiClick={onEmojiClick} />}
        <IconButton onClick={(e) => setShowPicker(!showPicker)}>
          <InsertEmoticonIcon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
