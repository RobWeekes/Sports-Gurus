// frontend/src/store/session.js

// const { useState } = require("react");
import { csrfFetch } from "./csrf";


// action creators - to log in / log out
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const UPDATE_USER_PROFILE = "session/updateUserProfile";

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

// changed (user) to (profileData)
const updateUserProfile  = (profileData) => {
  return {
    type: UPDATE_USER_PROFILE,
    payload: profileData
  }
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    case UPDATE_USER_PROFILE:
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

// Get Session thunk action creator: calls GET /api/session
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// Log In thunk action creator: calls POST /api/session
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

// Sign Up thunk action creator: calls POST /api/users
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

// Log Out thunk action creator: calls POST /api/session
export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE"
  }); // call backend API to log out, then remove session user
  dispatch(removeUser());
  return response;
};

// Update Profile thunk creator: calls PATCH /api/users/profile
export const updateProfile = (userId, profileData) => async (dispatch) => {
  const response = await csrfFetch(`/api/users/${userId}/profile`, {
    method: "PUT",
    body: JSON.stringify(profileData)
  });

  const data = await response.json();
  dispatch(updateUserProfile(data.user));
  return data;
};


export default sessionReducer;


// Testing thunk actions: uncomment & ignore terminal:
// "105:1  error  "store" is not defined"
// "106:3  error  "sessionActions" is not defined"

// test the restoreUser thunk action in browser console:
// store.dispatch(sessionActions.restoreUser());

// test the login thunk action in browser console:
// store.dispatch(
//   sessionActions.login({
//     credential: "Demo-lition",
//     password: "password"
//   })
// )

// test signup thunk action w/ unique email/username:
// store.dispatch(
//   sessionActions.signup({
//     "firstName": "Neil",
//     "lastName": "Armstrong--Harris",
//     "email": "demo25@user.io",
//     "password": "Password2!",
//     "userName": "MoonLander-1970"
//   })
// )

// test the logout thunk action in browser:
// store.dispatch(sessionActions.logout())
