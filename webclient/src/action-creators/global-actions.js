/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import {
  UPDATE_CURRENT_USER,
  SHOW_IMAGE_UPLOAD_MODAL,
  HIDE_IMAGE_UPLOAD_MODAL,
  SET_IMAGE_ATTACHMENT_ID,
  SHOW_MODAL_TWAT_COMPOSER,
  HIDE_MODAL_TWAT_COMPOSER,
} from './action-types';

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

export function showModalTwatComposer() {
  return { type: SHOW_MODAL_TWAT_COMPOSER };
}

export function hideModalTwatComposer() {
  return { type: HIDE_MODAL_TWAT_COMPOSER };
}

export function showImageUploadModal() {
  return { type: SHOW_IMAGE_UPLOAD_MODAL };
}

export function hideImageUploadModal() {
  return { type: HIDE_IMAGE_UPLOAD_MODAL };
}

export function setImageAttachmentId(id) {
  return { type: SET_IMAGE_ATTACHMENT_ID, payload: id };
}
