import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat";
import db, { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "./features/userSlice";
import { useHistory } from "react-router-dom";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const history = useHistory();

  const logoutOfApp = () => {
    dispatch(logout());
    auth.signOut();
    history.push("/login");
  };

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar onClick={logoutOfApp}>{user?.displayName[0]}</Avatar>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search or start new chat"
            type="text"
          />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat
          addNewChat
          input={input}
          setInput={setInput}
          rooms={rooms}
        />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
