import { PaginationMeta } from './pagination.model';

export class BroadcastTemplateVariable {
  public id: number;
  public name: string;
  public value: string;
  public createdAt: Date;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.value = data.value ? data.value : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }
}

export class BroadcastTemplateVariableResponse {
  public list: BroadcastTemplateVariable[];
  public _meta: PaginationMeta;

  constructor(data: any) {
    this.list = data.list
      ? data.list.map((item: any) => new BroadcastTemplateVariable(item))
      : [];
    this._meta = data._meta
      ? new PaginationMeta(data._meta)
      : new PaginationMeta({});
  }
}
