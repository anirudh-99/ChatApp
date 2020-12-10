import React, { useState } from "react";
import classes from "./chat.module.css";
import { Avatar, IconButton } from "@material-ui/core";
import axios from '../../axios';

//material-ui imports
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";

function Chat(props) {
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post("/messages", {
      message: input,
      name: "demo name",
      timestamp: new Date().toUTCString(),
      received: true,
    });

    setInput("");
  };

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
        {props.messages.map((message) => {
          return (
            <p
              className={[
                classes.Chat__message,
                message.received ? classes.Chat__receiver : "",
              ].join(" ")}
            >
              <span className={classes.Chat__name}>{message.name}</span>
              {message.message}
              <span className={classes.Chat__timestamp}>
                {message.timestamp}
              </span>
            </p>
          );
        })}
      </div>
      <div className={classes.Chat__footer}>
        <InsertEmoticonIcon className={classes.MuiIcon} />
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
        <MicIcon className={classes.MuiIcon} />
      </div>
    </div>
  );
}

export default Chat;
