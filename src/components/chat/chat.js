import React, { useState,useEffect } from "react";
import classes from "./chat.module.css";
import { Avatar, IconButton } from "@material-ui/core";
import axios from '../../axios';
import Pusher from 'pusher-js';

//material-ui imports
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  //fetch messages initially
  useEffect(() => {
    axios.get("/messages").then((res) => {
      setMessages(res.data);
    });
  }, []);

  //listener for a channel in pusher
  useEffect(() => {
    const pusher = new Pusher("f891c6ff78f3484303a0", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      // alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

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
        {messages.map((message,index) => {
          return (
            <p
              className={[
                classes.Chat__message,
                message.received ? classes.Chat__receiver : "",
              ].join(" ")}
              key={index}
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
