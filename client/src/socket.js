import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  markLastMessageRead,
  setNewUnread,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("ack-message", (data) => {
    const state = store.getState();
    if (state.user.id === data.senderId) {
      store.dispatch(markLastMessageRead(data.conversationId))
    }
  })

  socket.on("new-message", (data) => {
    const state = store.getState();
    if (state.user.id === data.message.recipientId) {
      store.dispatch(setNewMessage(data.message, data.sender));
      if (state.activeConversation === data.message.senderName) {
        store.dispatch(setNewUnread(data.message.conversationId, data.message.senderId));
      }
    }
  });
});

export default socket;
