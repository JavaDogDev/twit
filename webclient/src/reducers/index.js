import { combineReducers } from 'redux';
import troughReducer from './trough-reducer';

const rootReducer = combineReducers({
  trough: troughReducer,
});

export default rootReducer;
