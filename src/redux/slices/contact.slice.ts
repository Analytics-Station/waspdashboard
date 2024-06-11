import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AppResponse,
  BulkImportFormData,
  ContactGroup,
} from '../../shared/models';
import { fetchBulkImportFormdata } from '../actions';

interface InitialState {
  loading: boolean;
  groups: ContactGroup[];
}

const initialState: InitialState = {
  loading: false,
  groups: [],
};

export const contactSlice = createSlice({
  name: 'contactSlice',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        fetchBulkImportFormdata.fulfilled,
        (state, action: PayloadAction<AppResponse<BulkImportFormData>>) => {
          if (action.payload) {
            const { contactGroups } = action.payload.message;
            state.groups = contactGroups.map(
              (group: any) => new ContactGroup(group)
            );
          }
        }
      )
      .addCase(fetchBulkImportFormdata.pending, (state) => {
        state.loading = true;
      });
  },
});

export const contactReducer = contactSlice.reducer;
