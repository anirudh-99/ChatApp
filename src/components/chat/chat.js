import React, { useState, useEffect, useContext } from "react";
import classes from "./chat.module.css";
import { Avatar, IconButton } from "@material-ui/core";
import axios from "../../axios";
import Pusher from "pusher-js";
import { useParams } from "react-router-dom";
import UserContext from "../../context/userContext";

//material-ui imports
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";

function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [seed, setSeed] = useState(0);

  const { userData } = useContext(UserContext);
  let token = userData.token;
  let currUser = userData.user;

  //get the room name from room Id and change seed
  useEffect(() => {
    axios
      .get("/rooms", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const rooms = res.data;
        const room = rooms.find((el) => el._id === roomId);
        setRoomName(room.name);
      });

    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId, token]);

  //fetch messages initially
  useEffect(() => {
    axios
      .get(`/rooms/${roomId}/messages`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setMessages(res.data.data.messages);
      });
  }, [token, roomId]);

  //listener for "messages" channel in pusher
  useEffect(() => {
    const pusher = new Pusher("f891c6ff78f3484303a0", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("message added", (data) => {
      const newMessage = data._doc;
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  //post message onto database
  const sendMessage = async (e) => {
    e.preventDefault();
    console.log();

    await axios.patch(
      `/rooms/${roomId}/messages`,
      {
        message: input,
        name: currUser.name,
        userId: currUser._id,
        timestamp: new Date().toUTCString(),
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    setInput("");
  };

  return (
    <div className={classes.Chat}>
      <div className={classes.Chat__header}>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

        <div className={classes.Chat__headerInfo}>
          <h3>{roomName}</h3>
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
        {messages.map((message, index) => {
          return (
            <p
              className={[
                classes.Chat__message,
                message.userId === currUser._id ? classes.Chat__receiver : "",
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
