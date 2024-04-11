import { Location, NavigateFunction } from 'react-router-dom';

import { makeRequest } from '../helpers';
import { LocalStorageItem, LoginResponse, User } from '../models';

export class AuthService {
  isUserLoggedIn = (): boolean => {
    const logged = localStorage.getItem(LocalStorageItem.Logged);
    return logged ? parseInt(logged) === 1 : false;
  };

  setUserLoggedIn = () => {
    localStorage.setItem(LocalStorageItem.Logged, '1');
  };

  verifyToken = async (navigate: NavigateFunction, location: Location) => {
    const waspToken = localStorage.getItem(LocalStorageItem.Token);
    if (!waspToken) {
      this.logoutUser(navigate);
      return Promise.reject();
    }
    try {
      const response = await makeRequest<null, LoginResponse>('/auth/validate');
      localStorage.setItem(LocalStorageItem.Token, response.message.token);
      this.setUserLoggedIn();
      if (this.isAuthRoute(location.pathname)) {
        navigate('/');
      }
      return Promise.resolve(new User(response.message.user));
    } catch (e) {
      this.logoutUser(navigate);
      return Promise.reject(e);
    }
  };

  isAuthRoute = (route: string) => {
    const routeChunks = route.split('/');
    return routeChunks.length > 1 && routeChunks[1] === 'auth';
  };

  logoutUser = async (navigate: NavigateFunction) => {
    localStorage.clear();
    navigate('/auth/signin');
  };
}
