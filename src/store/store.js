import {createStore, applyMiddleware} from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './reducers/index.js';
import {loadState, saveState} from '../utils/local-storage.js';

// Load persisted state from localStorage
const persistedState = loadState();

export const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(thunk)
);

// Save state to localStorage whenever it changes
store.subscribe(() => {
  saveState({
    employees: store.getState().employees,
    app: {
      language: store.getState().app.language,
      displayMode: store.getState().app.displayMode,
      pagination: store.getState().app.pagination,
    },
  });
});
