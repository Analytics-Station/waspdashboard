import { PaginationMeta } from './pagination.model';

export class ContactGroup {
  public id: number;
  public name: string;
  public createdAt: Date;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
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
