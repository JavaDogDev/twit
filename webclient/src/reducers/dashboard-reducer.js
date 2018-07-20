import { UPDATE_DASHBOARD_TROUGH } from '../action-creators/action-types';

const initialState = {
  twats: [],
};

export default function dashboardReducer(previousState = initialState, action) {
  switch (action.type) {
    case UPDATE_DASHBOARD_TROUGH: return { twats: action.payload };
    default: return previousState;
  }
}
