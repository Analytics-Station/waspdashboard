import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppResponse, LocalStorageItem, LoginResponse, User, ValidateResponse } from '../../shared/models';
import { loginWithEmail, validateToken } from '../actions';

interface InitialState {
  isTokenValidated: boolean;
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: InitialState = {
  isTokenValidated: false,
  isLoggedIn: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem(LocalStorageItem.TOKEN, action.payload);
    },
    setIsTokenValidated: (state, action: PayloadAction<boolean>) => {
      state.isTokenValidated = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem(LocalStorageItem.TOKEN);
      state.user = null;
      state.isLoggedIn = false;
    },
  },

  extraReducers: (builder) => {
    // login with password

    builder.addCase(
      loginWithEmail.fulfilled,
      (state, action: PayloadAction<AppResponse<LoginResponse>>) => {
        if (action.payload) {
          const { token, user } = action.payload.message;
          localStorage.setItem(LocalStorageItem.TOKEN, token);
          state.user = new User(user);
          state.isLoggedIn = true;
        }
      }
    );

    // validate token
    builder.addCase(
      validateToken.fulfilled,
      (state, action: PayloadAction<AppResponse<ValidateResponse>>) => {
        if (action.payload) {
          const { user } = action.payload.message;
          state.user = new User(user);
          state.isTokenValidated = true;
          state.isLoggedIn = true;
        }
      }
    );

    builder.addCase(validateToken.rejected, (state, action) => {
      if (action.payload) {
        state.isTokenValidated = true;
      }
    });
  },
});

export const { setToken, setIsTokenValidated, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
