// redux/reducers/chatReducer.js
import { SET_MESSAGES } from '../actions/types';

const initialState = {
  messages: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGES:
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
}