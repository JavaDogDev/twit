import { combineReducers } from 'redux';
import globalReducer from './global-reducer';
import dashboardReducer from './dashboard-reducer';
import userPageReducer from './user-page-reducer';

const rootReducer = combineReducers({
  global: globalReducer,
  dashboard: dashboardReducer,
  userPage: userPageReducer,
});

export default rootReducer;
