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
  const { conversation } = props;
  const { otherUser } = conversation;
  const { messages } = conversation;
  // Will disable badge showing unread messages when we are currently in the chat window
  const { activeConversation } = props
  /*
  Since all messages have a 'read' flag, we can count the ones that have it set to false to count the amount
  of unread messages that we have. 
  */
  let unreadCount = messages.reduce((accumulator, currValue) => {
    if(currValue.senderId !== props.user.id) {
      if(!currValue.read) {
        accumulator += 1;
      }
    };
    return accumulator;
  }, 0);

  const handleClick = async (conversation) => {
    
    const reqBody = {
      conversationId: conversation.id
    }
    await props.clickHandler(reqBody, unreadCount);
    await props.setActiveChat(conversation.otherUser.username);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {!activeConversation && <Badge badgeContent={unreadCount} color="primary"/>}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    activeConversation: state.activeConversation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
