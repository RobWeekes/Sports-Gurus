// frontend/src/store/session.js

// const { useState } = require("react");
import { csrfFetch } from "./csrf";


// action creators - to log in / log out
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

// thunk action creator: POST /api/session
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  }); // call backend API to log in, then set session user from response
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

// test the log in thunk action in browser console:
// store.dispatch(
//   sessionActions.login({
//     credential: "Demo-lition",
//     password: "password"
//   })
// )



export default sessionReducer;
