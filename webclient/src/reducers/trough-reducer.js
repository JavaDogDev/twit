import { UPDATE_TROUGH } from '../action-creators/action-types';

const initialState = {
  twats: [],
};

export default function troughReducer(previousState = initialState, action) {
  switch (action.type) {
    case UPDATE_TROUGH: return { twats: action.payload };
    default: return previousState;
  }
}
