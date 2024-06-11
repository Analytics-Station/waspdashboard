import { createAsyncThunk } from '@reduxjs/toolkit';

import { makeRequest } from '../../shared/helpers';
import { BulkImportFormData, RequestMethod } from '../../shared/models';

export const fetchBulkImportFormdata = createAsyncThunk(
  'fetchBulkImportFormdata',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await makeRequest<null, BulkImportFormData>(
        `/contacts/bulk/formdata`,
        RequestMethod.GET,
        true
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
