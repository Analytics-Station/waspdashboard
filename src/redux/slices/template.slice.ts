import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AppResponse,
  BroadcastTemplate,
  BroadcastTemplateDetailsResponse,
} from '../../shared/models';
import { fetchTemplateDetails } from '../actions';

interface InitialState {
  currentTemplate: BroadcastTemplate | null;
}

const initialState: InitialState = {
  currentTemplate: null,
};

export const templateSlice = createSlice({
  name: 'templateSlice',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchTemplateDetails.fulfilled,
        (
          state,
          action: PayloadAction<AppResponse<BroadcastTemplateDetailsResponse>>
        ) => {
          if (action.payload) {
            const { template } = action.payload.message;
            state.currentTemplate = new BroadcastTemplate(template);
          }
        }
      )
      .addCase(fetchTemplateDetails.pending, (state) => {
        state.currentTemplate = null;
      });
  },
});

export const templateReducer = templateSlice.reducer;
