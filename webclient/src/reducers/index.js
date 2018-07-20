import { combineReducers } from 'redux';
import dashboardReducer from './dashboard-reducer';
import userPageReducer from './user-page-reducer';

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  userPage: userPageReducer,
});

export default rootReducer;
