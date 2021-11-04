import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import { updateMessages } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    const state = store.getState();
    if (state.user.id === data.message.recipientId) {
      store.dispatch(setNewMessage(data.message, data.sender));
      if (state.activeConversation === data.message.senderName) {
        updateMessages({
          conversationId: data.message.conversationId,
        });
      }
    }
  });
});

export default socket;
