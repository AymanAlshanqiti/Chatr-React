import axios from "axios";
import jwt_decode from "jwt-decode";

import * as actionTypes from "./actionTypes";

import { setErrors } from "./errors";

const instance = axios.create({
  baseURL: "https://api-chatr.herokuapp.com/"
});

const setAuthToken = token => {
  if (token) {
    localStorage.setItem("token", token); // Store user token in his browser's local storage
    axios.defaults.headers.common.Authorization = `jwt ${token}`;
  } else {
    localStorage.removeItem("token"); // Remove user token from his browser's local storage
    delete axios.defaults.headers.common.Authorization;
  }
};

export const checkForExpiredToken = () => {
  return dispatch => {
    // Get token
    const token = localStorage.getItem("token");

    if (token) {
      const currentTime = Date.now() / 1000;

      // Decode token and get user info
      const user = jwt_decode(token);

      console.log((user.exp - currentTime) / 60);

      // Check token expiration
      if (user.exp >= currentTime) {
        // Set auth token header
        setAuthToken(token);
        // Set user
        dispatch(setCurrentUser(user));
      } else {
        dispatch(logout());
      }
    }
  };
};

export const login = (userData, history) => {
  return async dispatch => {
    try {
      let response = await instance.post("/login/", userData);
      let token = response.data.token;
      let decodedUser = jwt_decode(token);
      setAuthToken(token);
      dispatch(setCurrentUser(decodedUser));
      dispatch({
        type: actionTypes.SET_ERRORS,
        payload: {}
      });
      // make sure to passe the history obj to the func
      history.push("/welcome");
    } catch (error) {
      dispatch(setErrors(error.response.data));
      console.error(error.response.data);
    }
  };
};

export const signup = (userData, history) => {
  return async dispatch => {
    try {
      let response = await instance.post("/signup/", userData);
      let token = response.data.token;
      let decodedUser = jwt_decode(token);
      setAuthToken(token);
      dispatch(setCurrentUser(decodedUser));
      dispatch({
        type: actionTypes.SET_ERRORS,
        payload: {}
      });
      // make sure to passe the history obj to the func
      history.push("/private");
    } catch (error) {
      dispatch(setErrors(error.response.data));
      console.error(error.response.data);
    }
  };
};

export const logout = () => {
  setAuthToken();
  return setCurrentUser();
};

const setCurrentUser = user => ({
  type: actionTypes.SET_CURRENT_USER,
  payload: user
});
