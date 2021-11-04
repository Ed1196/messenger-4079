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
    color: (props) =>
      props.unread > 0 && props.disableUnread ? "black" : "#9CADC8",
    fontWeight: (props) =>
      props.unread > 0 && props.disableUnread ? "900" : "",
    letterSpacing: (props) =>
      props.unread > 0 && props.disableUnread ? "0.3px" : "-0.17",
    textShadow: (props) =>
      props.unread > 0 && props.disableUnread ? ".5px 0 black" : "",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles(props);
  console.log(props);
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
