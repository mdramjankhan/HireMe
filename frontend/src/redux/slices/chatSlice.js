// redux/slices/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { initializeSocket } from '../../services/socket';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { addMessage, setMessages, clearError: clearChatError } = chatSlice.actions;

// Thunk actions for socket
export const sendMessage = (messageData) => (dispatch) => {
  const socket = initializeSocket();
  socket.emit('sendMessage', messageData);
};

export const setupChatListener = () => (dispatch) => {
  const socket = initializeSocket();
  socket.on('message', (message) => {
    dispatch(addMessage(message));
  });
};

export default chatSlice.reducer;