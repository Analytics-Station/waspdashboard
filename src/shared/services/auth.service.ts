import { makeRequest } from '../helpers';
import { LocalStorageItem, LoginResponse, User } from '../models';

export class AuthService {
  loggedUser: User | null = null;

  isUserLoggedIn = (): boolean => {
    const logged = localStorage.getItem(LocalStorageItem.Logged);
    return logged ? parseInt(logged) === 1 : false;
  };

  setUserLoggedIn = (user?: User) => {
    localStorage.setItem(LocalStorageItem.Logged, '1');
    if (user) {
      this.loggedUser = user;
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
      this.loggedUser = new User(response.message.user);
      return Promise.resolve(this.loggedUser);
    } catch (e) {
      this.logoutUser();
      return Promise.reject(e);
    }
  };

  logoutUser = () => {
    localStorage.clear();
  };
}
