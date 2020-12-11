import React, { useState, useEffect } from "react";
import classes from "./sidebarChat.module.css";

//material-ui imports
import { Avatar } from "@material-ui/core";

function SidebarChat({addNewChat}) {
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = () => {
    const roomName = prompt("please enter name for chat:");

    if(roomName){
      // do some stuff
    }

  }

  return !addNewChat ?(
    <div className={classes.SidebarChat}>
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className={classes.SidebarChat__info}>
        <h2>Room name</h2>
        <p>This is the last message</p>
      </div>
    </div>
  ) : (
    <div onClick={createChat} className={classes.SidebarChat}>
      <h3>Add New Chat</h3>
    </div>
  );
}

export default SidebarChat;
