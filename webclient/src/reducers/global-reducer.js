import { UPDATE_CURRENT_USER } from '../action-creators/action-types';

const initialState = {
  currentUser: {
    userId: '',
    username: '-',
    displayName: '-',
    bio: '...',
    following: [],
  },
};

export default function globalReducer(previousState = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT_USER: return { currentUser: action.payload };
    default: return previousState;
  }
}
