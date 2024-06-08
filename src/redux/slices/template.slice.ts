import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AppResponse,
  BroadcastTemplate,
  BroadcastTemplateDetailsResponse,
} from '../../shared/models';
import { checkTemplateName, fetchTemplateDetails } from '../actions';

interface InitialState {
  loading: boolean;
  nameValid: boolean | null;
  currentTemplate: BroadcastTemplate | null;
}

const initialState: InitialState = {
  currentTemplate: null,
  loading: false,
  nameValid: null,
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

    builder
      .addCase(checkTemplateName.pending, (state) => {
        state.nameValid = null;
        state.loading = true;
      })
      .addCase(checkTemplateName.fulfilled, (state) => {
        state.nameValid = true;
        state.loading = false;
      })
      .addCase(checkTemplateName.rejected, (state) => {
        state.nameValid = false;
        state.loading = false;
      });
  },
});

export const templateReducer = templateSlice.reducer;
