import React from "react";
import classes from "./sidebarChat.module.css";

//material-ui imports
import { Avatar } from "@material-ui/core";

function SidebarChat() {
  return (
    <div className={classes.SidebarChat}>
      <Avatar />
      <div className={classes.SidebarChat__info}>
        <h2>Room name</h2>
        <p>This is the last message</p>
      </div>
    </div>
  );
}

export default SidebarChat;
