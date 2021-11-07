import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: (newMessage) => (newMessage ? "black" : "#9CADC8"),
    fontWeight: (newMessage) => (newMessage ? "900" : ""),
    letterSpacing: (newMessage) => (newMessage ? "0.3px" : "-0.17"),
    textShadow: (newMessage) => (newMessage ? ".5px 0 black" : ""),
  },
}));

const ChatContent = (props) => {
  const newMessage = props.unread > 0 && props.disableUnread; 
  const classes = useStyles(newMessage);
  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
