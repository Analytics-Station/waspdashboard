import { createAsyncThunk } from '@reduxjs/toolkit';

import { makeRequest } from '../../shared/helpers';
import { LoginRequest, LoginResponse, RequestMethod, ValidateResponse } from '../../shared/models';

export const loginWithEmail = createAsyncThunk(
  'loginWithEmail',
  async ({ email, password }: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await makeRequest<LoginRequest, LoginResponse>(
        '/auth/signin',
        RequestMethod.POST,
        false,
        {
          email,
          password,
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const validateToken = createAsyncThunk(
  'validateToken',
  async (data, { rejectWithValue }) => {
    try {
      const response = await makeRequest<null, ValidateResponse>(
        '/auth/validate',
        RequestMethod.GET,
        true
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
