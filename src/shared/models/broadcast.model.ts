import { PaginationMeta } from './pagination.model';

export class Broadcast {
  public id: number;
  public name: string;
  public templateId: string;
  public contacts: string[];
  public createdAt: Date;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.templateId = data.templateId ? data.templateId : null;
    this.contacts = data.contacts ? data.contacts : [];
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }
}

export class BroadcastResponse {
  public list: Broadcast[];
  public _meta: PaginationMeta;

  constructor(data: any) {
    this.list = data.list
      ? data.list.map((item: any) => new Broadcast(item))
      : [];
    this._meta = data._meta
      ? new PaginationMeta(data._meta)
      : new PaginationMeta({});
  }
}
