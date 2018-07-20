import { SET_USER_PAGE_LOADING, UPDATE_USER_PAGE } from '../action-creators/action-types';

const initialState = {
  user: null,
  twats: [],
  isLoading: true,
};

export default function userPageReducer(previousState = initialState, action) {
  switch (action.type) {
    case SET_USER_PAGE_LOADING:
      return { isLoading: true };

    case UPDATE_USER_PAGE:
      return {
        user: action.payload.user,
        twats: action.payload.twats,
        isLoading: false,
      };

    default: return previousState;
  }
}
