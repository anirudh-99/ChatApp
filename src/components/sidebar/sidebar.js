import React from "react";
import classes from "./sidebar.module.css";

import SidebarChat from "../sidebarChat/sidebarChat";

//material-ui imports
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ChatIcon from "@material-ui/icons/Chat";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";

function Sidebar() {
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
        <SidebarChat />
        <SidebarChat />
        <SidebarChat />
      </div>
    </div>
  );
}

export default Sidebar;
