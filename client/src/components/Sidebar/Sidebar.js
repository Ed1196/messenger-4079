import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";
import { updateMessages } from "../../store/utils/thunkCreators.js";
import { gotConversations } from "../../store/conversations.js";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15,
  },
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = props.conversations || [];
  const { handleChange, searchTerm, gotConversations } = props;
  const onChatClickedHandler = async (body, unreadCount) => {
    if(body.conversationId) {
      const data = await updateMessages(body);
      if (unreadCount > 0 && data) {
        const convoIndx = conversations.findIndex(
          (convo) => convo.id === data.convo.id
        );
        const updatedConvos = [...conversations];
        console.log(updatedConvos[convoIndx]);
        console.log(data.convo);
        updatedConvos[convoIndx] = data.convo;
        gotConversations(updatedConvos);
      }
    }
  };

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations
        .filter((conversation) =>
          conversation.otherUser.username.includes(searchTerm)
        )
        .map((conversation) => {
          return (
            <Chat
              conversation={conversation}
              key={conversation.otherUser.username}
              clickHandler={onChatClickedHandler}
            />
          );
        })}
    </Box>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    gotConversations: (conversation) => {
      dispatch(gotConversations(conversation))
    },
  };
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
