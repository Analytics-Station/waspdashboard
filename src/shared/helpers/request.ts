import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { AppResponse, RequestMethod } from '../models';

const getAxiosRequest = (): AxiosInstance => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
};

export const makeRequest = async <RequestType, ResponseType>(
  URL: string,
  method: RequestMethod = RequestMethod.GET,
  data?: RequestType
): Promise<AppResponse<ResponseType>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: URL,
      data,
    };
    if (method === RequestMethod.GET) {
      config.params = data;
    }
    const response = await getAxiosRequest().request(config);
    return Promise.resolve(response.data);
  } catch (error) {
    const err = error as Error | AxiosError;
    let message = '';
    if (axios.isAxiosError(err) && err.response) {
      message = err.response.data['message'];
    } else {
      message = String(error);
    }
    return Promise.reject(message);
  }
};
