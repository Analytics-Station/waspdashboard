import parsePhoneNumber from 'libphonenumber-js';

import { PaginationMeta } from './pagination.model';

export class User {
  public id: string;
  public name: string;
  public email: string;
  public phone: string;
  public profilePic: string;
  public role: string;
  public createdAt: Date;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.email = data.email ? data.email : null;
    this.phone = data.phone ? data.phone : null;
    this.profilePic = data.profilePic ? data.profilePic : null;
    this.role = data.role ? data.role : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  getFormattedPhone() {
    if (!this.phone) {
      return 'No phone recorded';
    }
    const phoneNumber = parsePhoneNumber(this.phone);
    return phoneNumber ? phoneNumber.formatInternational() : this.phone;
  }

  getRole(): string {
    switch (this.role) {
      case 'superadmin':
        return 'Super administrator';
      default:
        return this.role;
    }
  }
}

export class UserResponse {
  public list: User[];
  public _meta: PaginationMeta;

  constructor(data: any) {
    this.list = data.list ? data.list.map((item: any) => new User(item)) : [];
    this._meta = data._meta
      ? new PaginationMeta(data._meta)
      : new PaginationMeta({});
  }
}
