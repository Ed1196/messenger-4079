import React from "react";
import { Badge, Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, activeConversation } = props;
  const { otherUser, unread } = conversation;
  const handleClick = async (conversation) => {
    
    const reqBody = {
      conversationId: conversation.id
    }
    await props.clickHandler(reqBody, unread);
    await props.setActiveChat(conversation.otherUser.username);
  };
  const disableUnread = activeConversation !== conversation.otherUser.username;

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent
        conversation={conversation}
        unread={unread}
        disableUnread={disableUnread}
      />
      {disableUnread && <Badge badgeContent={unread} color="primary" />}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    activeConversation: state.activeConversation,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (name) => {
      dispatch(setActiveChat(name));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
