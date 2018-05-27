/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { UPDATE_TROUGH } from './action-types';

/**
 * Creates an action which sorts and updates the Trough contents
 * @param newContent the new (unsorted) trough contents returned from API
 */
function updateTrough(newContent) {
  const sortedContents = newContent.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    type: UPDATE_TROUGH,
    payload: sortedContents,
  };
}

/* Starts async Trough update. Dispatches updateTrough when complete. */
export function refreshTroughAsync() {
  return dispatch => axios.get('/api/twats/trough')
    .then(res => dispatch(updateTrough(res.data.twats)))
    .catch(err => console.log(`Error getting Twats from followed users: ${err}`));
}
