/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { UPDATE_DASHBOARD_TROUGH } from './action-types';

/**
 * Creates an action which sorts and updates the Trough contents for Dashboard page
 * @param newContent the new (unsorted) trough contents returned from API
 */
function updateDashboardTrough(newContent) {
  const sortedContents = newContent.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    type: UPDATE_DASHBOARD_TROUGH,
    payload: sortedContents,
  };
}

/* Starts async dashboard-trough update. Dispatches updateDashboardTrough when complete. */
export function refreshDashboardTroughAsync() {
  return dispatch => axios.get('/api/twats/dashboard-trough')
    .then(res => dispatch(updateDashboardTrough(res.data.twats)))
    .catch(err => console.log(`Error refreshing Dashboard's Trough: ${err}`));
}
