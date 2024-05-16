import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
} from 'axios';

import { AppResponse, LocalStorageItem, RequestMethod } from '../models';

const getAxiosRequest = (): AxiosInstance => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
};

export const makeRequest = async <RequestType, ResponseType>(
  URL: string,
  method: RequestMethod = RequestMethod.GET,
  validate = true,
  data?: RequestType,
  headers?: AxiosHeaders
): Promise<AppResponse<ResponseType>> => {
  try {
    let newHeaders = new AxiosHeaders({});
    if (headers) {
      newHeaders = headers;
    }
    const token = localStorage.getItem(LocalStorageItem.Token);
    if (validate && token) {
      newHeaders.set('Authorization', `${token}`);
    }
    const config: AxiosRequestConfig = {
      method,
      url: URL,
      data,
      headers,
    };
    if (method === RequestMethod.GET) {
      config.params = data;
    }
    const response = await getAxiosRequest().request(config);
    return Promise.resolve(response.data as AppResponse<ResponseType>);
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
