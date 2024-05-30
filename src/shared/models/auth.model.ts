import { User } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

// export class LoginResponse {
//   public token: string;
//   public user: User;

//   constructor(data: any) {
//     this.token = data.token ? data.token : null;
//     this.user = data.user ? new User(data.user) : new User({});
//   }
// }

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ValidateResponse {
  user: User;
}
