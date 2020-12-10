import React from "react";
import classes from "./chat.module.css";
import { Avatar, IconButton } from "@material-ui/core";

//material-ui imports
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";

function Chat() {
  return (
    <div className={classes.Chat}>
      <div className={classes.Chat__header}>
        <Avatar />

        <div className={classes.Chat__headerInfo}>
          <h3>Room name</h3>
          <p>last seen at ...</p>
        </div>

        <div className={classes.Chat__headerRight}>
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className={classes.Chat__body}>
        <p className={classes.Chat__message}>
          <span className={classes.Chat__name}>Sonny</span>
          This is a message
          <span className={classes.Chat__timestamp}>
            {new Date().toUTCString()}
          </span>
        </p>

        <p className={classes.Chat__message + " " + classes.Chat__receiver}>
          <span className={classes.Chat__name}>Sonny</span>
          This is a message
          <span className={classes.Chat__timestamp}>
            {new Date().toUTCString()}
          </span>
        </p>

        <p className={classes.Chat__message + " " + classes.Chat__receiver}>
          <span className={classes.Chat__name}>Sonny</span>
          This is a message
          <span className={classes.Chat__timestamp}>
            {new Date().toUTCString()}
          </span>
        </p>

      </div>
      <div className={classes.Chat__footer}>
          <InsertEmoticonIcon className={classes.MuiIcon}/>
          <form>
            <input placeholder="Type a message" type="text" />
            <button type="submit">Send a message</button>
          </form>
          <MicIcon className={classes.MuiIcon} />
        </div>
    </div>
  );
}

export default Chat;
