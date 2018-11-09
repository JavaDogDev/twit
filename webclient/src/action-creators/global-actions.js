/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { UPDATE_CURRENT_USER } from './action-types';

function updateCurrentUser(user) {
  return {
    type: UPDATE_CURRENT_USER,
    payload: user,
  };
}

/* Starts async dashboard-trough update. Dispatches updateDashboardTrough when complete. */
export function updateCurrentUserAsync() {
  return dispatch => axios.get('/api/users/current')
    .then(res => dispatch(updateCurrentUser(res.data)))
    .catch(err => console.error(`Error getting current user:\n\t${err}`));
}
