import {
  UPDATE_CURRENT_USER,
  SHOW_IMAGE_UPLOAD_MODAL,
  HIDE_IMAGE_UPLOAD_MODAL,
  SHOW_MODAL_TWAT_COMPOSER,
  HIDE_MODAL_TWAT_COMPOSER,
  SET_IMAGE_ATTACHMENT_ID,
} from '../action-creators/action-types';

const initialState = {
  currentUser: {
    userId: '',
    username: '-',
    displayName: '-',
    bio: '...',
    following: [],
  },

  twatComposerOpen: false,
  imageUploadModalOpen: false,
  imageAttachmentId: null,
};

export default function globalReducer(previousState = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT_USER: return { ...previousState, currentUser: action.payload };
    case SHOW_IMAGE_UPLOAD_MODAL: return { ...previousState, imageUploadModalOpen: true };
    case HIDE_IMAGE_UPLOAD_MODAL: return { ...previousState, imageUploadModalOpen: false };
    case SET_IMAGE_ATTACHMENT_ID: return { ...previousState, imageAttachmentId: action.payload };
    case SHOW_MODAL_TWAT_COMPOSER: return { ...previousState, twatComposerOpen: true };
    case HIDE_MODAL_TWAT_COMPOSER: return { ...previousState, twatComposerOpen: false };
    default: return previousState;
  }
}
