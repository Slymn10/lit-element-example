import { combineReducers } from 'redux';
import employeesReducer from './employees-reducer.js';
import appReducer from './app-reducer.js';
import routeReducer from './route-reducer.js';

const rootReducer = combineReducers({
  employees: employeesReducer,
  app: appReducer,
  route: routeReducer
});

export default rootReducer;