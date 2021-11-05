export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unread: payload.userId ? 0 : 1,
      latestMessageText: message.text,
      latestReadByOtherId: null,
    };
    const findIndex = state.findIndex((c) => c.otherUser.id === sender.id);
    if (state[findIndex]) {
      const updatedConvos = [ ...state ];
      updatedConvos[findIndex].id = newConvo.id;
      updatedConvos[findIndex].latestMessageText = message.text;
      updatedConvos[findIndex].latestReadByOtherId = null;
      updatedConvos[findIndex].messages = [message];
      updatedConvos[findIndex].unread = payload.userId ? 0 : 1;
      return updatedConvos;
    } else {
      console.log("HERE");
      return [newConvo, ...state];
    }
  }
  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const updateConvo = { ...convo };
      updateConvo.messages.push(message);
      updateConvo.latestMessageText = message.text;
      updateConvo.unread = payload.userId ? 0 : updateConvo.unread + 1;
      return updateConvo;
    } else {
      return convo;
    }
  });
};

export const updateMessageInStore = (state, convoId) => {
  return state.map((convo) => {
    if (convo.id === convoId) {
      const updateConvo = { ...convo };
      const messages = [...convo.messages];
      const indx = updateConvo.messages.length - 1;
      const updateMessage = { ...messages[indx], read: true };
      convo.messages[indx] = updateMessage;
      updateConvo.latestReadByOtherId = updateMessage.id;
      return updateConvo;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    const newConvo = { ...convo };
    if (convo.otherUser.id === recipientId) {
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};
