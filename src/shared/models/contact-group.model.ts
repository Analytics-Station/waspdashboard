import { Contact } from './contact.model';
import { PaginationMeta } from './pagination.model';

export class ContactGroup {
  public id: number;
  public name: string;
  public createdAt: Date;
  public contactCount: number;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.contactCount = data.contactCount != null ? data.contactCount : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }
}

export class ContactGroupResponse {
  public list: ContactGroup[];
  public _meta: PaginationMeta;

  constructor(data: any) {
    this.list = data.list
      ? data.list.map((item: any) => new ContactGroup(item))
      : [];
    this._meta = data._meta
      ? new PaginationMeta(data._meta)
      : new PaginationMeta({});
  }
}

export class ContactGroupContactListResponse {
  public contacts: Contact[];

  constructor(data: any) {
    this.contacts = data.contacts
      ? data.contacts.map((item: any) => new Contact(item))
      : [];
  }
}
