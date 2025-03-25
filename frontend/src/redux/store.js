// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import chatReducer from './slices/chatSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,  // Manages authentication state (user, token, role)
    jobs: jobReducer,   // Manages job listings and applications
    chat: chatReducer,  // Manages chat messages
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values from socket.io in actions
        ignoredActions: ['chat/sendMessage', 'chat/setupChatListener'],
        ignoredPaths: ['chat.socket'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

// Export the store for use in the app
export default store;
