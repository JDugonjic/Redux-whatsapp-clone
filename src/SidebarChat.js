import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import db from "./firebase";
import "./SidebarChat.css";

function SidebarChat({ addNewChat, id, name, input, setInput, rooms }) {
  const [messages, setMessages] = useState("");
  const history = useHistory();

  const createChat = (e) => {
    e.preventDefault();

    if (input) {
      const filteredRoom = rooms.filter((room) =>
        room.data.name.toLowerCase().includes(input.toLowerCase())
      );

      if (filteredRoom[0]?.data.name === input) {
        history.push(`/rooms/${filteredRoom[0].id}`);
      } else {
        const roomName = input;

        if (roomName) {
          db.collection("rooms").add({
            name: roomName,
          });
        }
      }
    }
    setInput("");
  };

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar>{messages[0]?.name[0]}</Avatar>
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
