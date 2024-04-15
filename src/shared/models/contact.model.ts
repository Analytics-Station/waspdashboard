import { PaginationMeta } from './pagination.model';

export class Contact {
  public id: number;
  public name: string;
  public phone: string;
  public broadcast: boolean;
  public createdAt: Date;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.phone = data.phone ? data.phone : null;
    this.broadcast = data.broadcast != null ? data.broadcast : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }
}

export class ContactResponse {
  public list: Contact[];
  public _meta: PaginationMeta;

  constructor(data: any) {
    this.list = data.list
      ? data.list.map((item: any) => new Contact(item))
      : [];
    this._meta = data._meta
      ? new PaginationMeta(data._meta)
      : new PaginationMeta({});
  }
}

export class ProcessContactResponse {
  public contacts: Contact[];

  constructor(data: any) {
    this.contacts = data.contacts
      ? data.contacts.map((item: any) => new Contact(item))
      : [];
  }
}
