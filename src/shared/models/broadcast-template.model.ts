import { PaginationMeta } from './pagination.model';

export class BroadcastTemplate {
  public id: number;
  public name: string;
  public content: string;
  public createdAt: Date;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.content = data.content ? data.content : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }
}

export class BroadcastTemplateResponse {
  public list: BroadcastTemplate[];
  public _meta: PaginationMeta;

  constructor(data: any) {
    this.list = data.list
      ? data.list.map((item: any) => new BroadcastTemplate(item))
      : [];
    this._meta = data._meta
      ? new PaginationMeta(data._meta)
      : new PaginationMeta({});
  }
}
