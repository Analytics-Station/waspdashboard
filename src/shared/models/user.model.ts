import parsePhoneNumber from 'libphonenumber-js';

export class User {
  public id: string;
  public name: string;
  public email: string;
  public phone: string;
  public profilePic: string;
  public role: string;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.email = data.email ? data.email : null;
    this.phone = data.phone ? data.phone : null;
    this.profilePic = data.profilePic ? data.profilePic : null;
    this.role = data.role ? data.role : null;
  }

  getFormattedPhone() {
    if (!this.phone) {
      return 'No phone recorded';
    }
    const phoneNumber = parsePhoneNumber(this.phone);
    return phoneNumber ? phoneNumber.formatInternational() : this.phone;
  }
}
