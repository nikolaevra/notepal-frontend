import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from './types';

const ROOT_URL = 'http://ec2-35-169-227-105.compute-1.amazonaws.com';

export function loginUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/auth/login`)
      .then(response => {
        dispatch({ type: AUTH_USER });

        localStorage.setItem('token', response.data.token);

        browserHistory.push('/home');
      })
      .catch((error) => {
        console.log("Login Error Data: ", error);
        
        dispatch(authError('Bad Login Info'));
      });
  }
}

export function signupUser({ username, email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/auth/signup`, { username, email, password })
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/home');
      })
      .catch(response => dispatch(authError(response.data.error)));
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}
