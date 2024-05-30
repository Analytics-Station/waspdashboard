import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LocalStorageItem } from '../../shared/models';
import { loginWithEmail, validateToken } from '../actions';

interface SnackbarData {
  show: boolean;
  message: string;
  type: AlertColor | undefined;
}

interface InitialState {
  loading: boolean;
  snackbarData: SnackbarData;
}

const initialState: InitialState = {
  loading: false,
  snackbarData: {
    show: false,
    message: '',
    type: 'info',
  },
};

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    changeLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSnackbarData: (state, action: PayloadAction<SnackbarData>) => {
      state.snackbarData = action.payload;
    },
    resetSnackbar: (state) => {
      state.snackbarData = initialState.snackbarData;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loginWithEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginWithEmail.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(loginWithEmail.rejected, (state, action) => {
      state.loading = false;
      state.snackbarData = {
        show: true,
        message: `${action.payload}`,
        type: 'error',
      };
    });

    builder.addCase(validateToken.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(validateToken.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(validateToken.rejected, (state, action) => {
      state.loading = false;
      state.snackbarData = {
        show: true,
        message: `${action.payload}`,
        type: 'error',
      };
      localStorage.removeItem(LocalStorageItem.TOKEN);
    });
  },
});

export const { changeLoadingStatus, setSnackbarData, resetSnackbar } =
  appSlice.actions;

export const appReducer = appSlice.reducer;
