/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { UPDATE_USER_PAGE, SET_USER_PAGE_LOADING } from './action-types';

/**
 * Creates an action which sorts and updates the content for UserPage
 * @param newContent the new User info and (unsorted) Twats from API
 */
function updateUserPage(user, twats) {
  const sortedTwats = twats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    type: UPDATE_USER_PAGE,
    payload: {
      user,
      twats: sortedTwats,
    },
  };
}

/* Starts async UserPage update. Dispatches updateUserPage when complete. */
export function updateUserPageAsync(username) {
  return dispatch => axios.get(`/api/users/${username}`)
    .then(res => Promise.all([res.data, axios.get(`/api/twats/by/${res.data.userId}`)]))
    .then(([user, res]) => dispatch(updateUserPage(user, res.data)))
    .catch(err => console.error(`Error getting data for UserPage: ${err}`));
}

/* Marks UserPage content as loading */
export function setUserPageLoading() {
  return { type: SET_USER_PAGE_LOADING };
}
