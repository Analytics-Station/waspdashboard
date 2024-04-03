import { makeRequest } from '../helpers';
import { LocalStorageItem, LoginResponse, User } from '../models';

let loggedUser: User | null = null;
export class AuthService {
  getLoggedUser = (): User | null => {
    return loggedUser;
  };

  isUserLoggedIn = (): boolean => {
    const logged = localStorage.getItem(LocalStorageItem.Logged);
    return logged ? parseInt(logged) === 1 : false;
  };

  setUserLoggedIn = (user?: User) => {
    localStorage.setItem(LocalStorageItem.Logged, '1');
    if (user) {
      loggedUser = user;
    }
  };

  verifyToken = async () => {
    const waspToken = localStorage.getItem(LocalStorageItem.Token);

    if (!waspToken) {
      localStorage.removeItem(LocalStorageItem.Logged);
      return Promise.reject();
    }

    try {
      const response = await makeRequest<null, LoginResponse>('/auth/validate');
      localStorage.setItem(LocalStorageItem.Token, response.message.token);
      loggedUser = new User(response.message.user);
      this.setUserLoggedIn(loggedUser);
      return Promise.resolve(loggedUser);
    } catch (e) {
      this.logoutUser();
      return Promise.reject(e);
    }
  };

  logoutUser = async () => {
    localStorage.clear();
    return Promise.resolve();
  };
}
