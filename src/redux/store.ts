import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import {
  appReducer,
  authReducer,
  contactReducer,
  templateReducer,
} from './slices';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  template: templateReducer,
  contact: contactReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
