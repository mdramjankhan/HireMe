// redux/reducers/rootReducer.js
import { combineReducers } from '@reduxjs/toolkit'; // Use from toolkit
import authReducer from './authReducer';
import jobReducer from './jobReducer';
import chatReducer from './chatReducer';

export default combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  chat: chatReducer
});