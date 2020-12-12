import React, { useState, useEffect } from "react";
import classes from "./sidebar.module.css";
import axios from "../../axios";
import Pusher from "pusher-js";

//import components
import SidebarChat from "../sidebarChat/sidebarChat";

//material-ui imports
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

function Sidebar() {
  let [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios
      .get("/rooms")
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const pusher = new Pusher("f891c6ff78f3484303a0", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("rooms");
    channel.bind("inserted", (newRoom) => {
      // alert(JSON.stringify(newMessage));
      setRooms([...rooms, newRoom]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [rooms]);

  return (
    <div className={classes.Sidebar}>
      <div className={classes.Sidebar__header}>
        <Avatar src="" />
        <div className={classes.Sidebar__headerRight}>
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

      <div className={classes.Sidebar__search}>
        <div className={classes.Sidebar__searchContainer}>
          <SearchOutlinedIcon className={classes.MuiIcon} />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>

      <div className={classes.Sidebar__chats}>
        <SidebarChat addNewChat />
        {rooms.map((room) => {
          return <SidebarChat key={room._id} id={room._id} name={room.name} />;
        })}
      </div>
    </div>
  );
}

export default Sidebar;
