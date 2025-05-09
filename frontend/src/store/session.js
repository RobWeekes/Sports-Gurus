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

// thunk action creator: calls POST /api/session
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

// thunk action creator: calls GET /api/session
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// thunk action creator: calls POST /api/users
export const signup = (user) => async (dispatch) => {
  const { firstName, lastName, email, password, userName } = user;
  const requestBody = {
    firstName,
    lastName,
    email,
    password
  };
  // Only include userName if input by user (optional)
  if (userName) {
    requestBody.userName = userName;
  }
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(requestBody)
  }); // call backend API to sign up, then set session user from response
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// test the login thunk action in browser console:
// store.dispatch(
//   sessionActions.login({
//     credential: "Demo-lition",
//     password: "password"
//   })
// )

// test the restoreUser thunk action in browser console:
// store.dispatch(sessionActions.restoreUser());

// test the signup thunk action in browser console:
// store.dispatch(
//   sessionActions.signup({
//     "firstName": "Neil",
//     "lastName": "Armstrong--Harris",
//     "email": "demo25@user.io",
//     "password": "Password2!",
//     "userName": "MoonLander-1970"
//   })
// )



export default sessionReducer;
