import { PaginationMeta } from './pagination.model';

export class Organisation {
  public id: string;
  public name: string;
  public phoneId: string;
  public waId: string;
  public appId: string;
  public verified: boolean;
  public createdAt: Date;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.phoneId = data.phoneId ? data.phoneId : null;
    this.waId = data.waId ? data.waId : null;
    this.appId = data.appId ? data.appId : null;
    this.verified = data.verified != null ? data.verified : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }
}

export class OrganisationResponse {
  public list: Organisation[];
  public _meta: PaginationMeta;

  constructor(data: any) {
    this.list = data.list
      ? data.list.map((item: any) => new Organisation(item))
      : [];
    this._meta = data._meta
      ? new PaginationMeta(data._meta)
      : new PaginationMeta({});
  }
}
