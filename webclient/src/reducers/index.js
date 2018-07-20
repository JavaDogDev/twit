import { combineReducers } from 'redux';
import dashboardReducer from './dashboard-reducer';

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
});

export default rootReducer;
