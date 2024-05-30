import { Location, NavigateFunction } from 'react-router-dom';

import { makeRequest } from '../helpers';
import { LocalStorageItem, LoginResponse, RequestMethod, User } from '../models';

export class AuthService {
  public loggedUser: User = new User({});

  isUserLoggedIn = (): boolean => {
    const logged = localStorage.getItem(LocalStorageItem.Logged);
    return logged ? parseInt(logged) === 1 : false;
  };

  setUserLoggedIn = () => {
    localStorage.setItem(LocalStorageItem.Logged, '1');
  };

  getUserRole = (): number => {
    const userRole = localStorage.getItem(LocalStorageItem.Role);
    return userRole ? parseInt(userRole) : 0;
  };

  verifyToken = async (navigate: NavigateFunction, location: Location) => {
    const waspToken = localStorage.getItem(LocalStorageItem.Token);
    if (!waspToken) {
      this.logoutUser(navigate);
      return Promise.reject();
    }
    try {
      const response = await makeRequest<null, LoginResponse>(
        '/auth/validate',
        RequestMethod.GET,
        true
      );
      localStorage.setItem(LocalStorageItem.Token, response.message.token);
      this.setUserLoggedIn();
      this.loggedUser = new User(response.message.user);
      localStorage.setItem(
        LocalStorageItem.Role,
        this.loggedUser.role.toString()
      );
      return Promise.resolve(this.loggedUser);
    } catch (e) {
      this.logoutUser(navigate);
      return Promise.reject(e);
    }
  };

  logoutUser = async (navigate: NavigateFunction) => {
    localStorage.clear();
    navigate('/auth/signin');
  };
}
