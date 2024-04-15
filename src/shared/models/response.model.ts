export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface AppResponse<T> {
  message: T;
  type: 'success' | 'error';
}
