import React, { useState, useEffect, useContext } from "react";
import classes from "./sidebarChat.module.css";
import axios from "../../axios";
import { Link } from "react-router-dom";
import UserContext from "../../context/userContext";

//material-ui imports
import { Avatar } from "@material-ui/core";

function SidebarChat({ addNewChat, id, name }) {
  const [seed, setSeed] = useState("");
  const { userData } = useContext(UserContext);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createRoom = async () => {
    const roomName = prompt("please enter name for chat:");

    if (roomName) {
      await axios.post(
        "/rooms",
        { name: roomName },
        {
          headers: {
            Authorization: "Bearer " + userData.token,
          },
        }
      );
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`} className={classes.Room__links}>
      <div className={classes.SidebarChat}>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className={classes.SidebarChat__info}>
          <h2>{name}</h2>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createRoom} className={classes.SidebarChat}>
      <h3>Add New Chat</h3>
    </div>
  );
}

export default SidebarChat;
