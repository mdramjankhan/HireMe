// redux/reducers/authReducer.js
import { SET_USER, CLEAR_USER } from '../actions/types';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  role: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload.userId, token: action.payload.token, role: action.payload.role };
    case CLEAR_USER:
      return { ...state, user: null, token: null, role: null };
    default:
      return state;
  }
}