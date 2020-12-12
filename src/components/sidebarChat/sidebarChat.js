import React, { useState, useEffect } from "react";
import classes from "./sidebarChat.module.css";
import axios from "../../axios";

//material-ui imports
import { Avatar } from "@material-ui/core";

function SidebarChat({ addNewChat, id, name }) {
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createRoom = async () => {
    const roomName = prompt("please enter name for chat:");

    if (roomName) {
      await axios.post("/rooms", { name: roomName });
    }
  };

  return !addNewChat ? (
    <div className={classes.SidebarChat}>
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className={classes.SidebarChat__info}>
        <h2>{name}</h2>
        <p>This is the last message</p>
      </div>
    </div>
  ) : (
    <div onClick={createRoom} className={classes.SidebarChat}>
      <h3>Add New Chat</h3>
    </div>
  );
}

export default SidebarChat;
