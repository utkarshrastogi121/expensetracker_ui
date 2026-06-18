import { createStore, combineReducers } from 'redux';
import { uiReducer } from './uiSlice';

const rootReducer = combineReducers({
  ui: uiReducer,
});

export const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
