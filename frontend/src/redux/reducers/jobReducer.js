// redux/reducers/jobReducer.js
import { SET_JOBS } from '../actions/types';

const initialState = {
  jobs: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_JOBS:
      return { ...state, jobs: action.payload };
    default:
      return state;
  }
}