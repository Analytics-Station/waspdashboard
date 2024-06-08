import { createAsyncThunk } from '@reduxjs/toolkit';

import { makeRequest } from '../../shared/helpers';
import {
  BroadcastTemplateDetailsResponse,
  RequestMethod,
} from '../../shared/models';

export const fetchTemplateDetails = createAsyncThunk(
  'fetchTemplateDetails',
  async (templateId: string, { rejectWithValue }) => {
    try {
      const response = await makeRequest<
        null,
        BroadcastTemplateDetailsResponse
      >(`/broadcast-templates/${templateId}`, RequestMethod.GET, true);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkTemplateName = createAsyncThunk(
  'checkTemplateName',
  async (templateName: string, { rejectWithValue }) => {
    try {
      const response = await makeRequest<
        null,
        BroadcastTemplateDetailsResponse
      >(
        `/broadcast-templates/search?name=${templateName}`,
        RequestMethod.GET,
        true
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
