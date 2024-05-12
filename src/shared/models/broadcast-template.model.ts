import { PaginationMeta } from './pagination.model';
import { BroadcastTemplateVariable } from './template-variable.model';

export class BroadcastTemplate {
  public id: number;
  public name: string;
  public components: any;
  public language: string;
  public category: string;
  public status: string;
  public whatsappId: string;
  public createdAt: Date;

  constructor(data: any) {
    this.id = data.id ? data.id : null;
    this.name = data.name ? data.name : null;
    this.components = data.components ? data.components : null;
    this.language = data.language ? data.language : null;
    this.category = data.category ? data.category : null;
    this.status = data.status ? data.status : null;
    this.whatsappId = data.whatsappId ? data.whatsappId : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  getStatusColor() {
    if (this.status === 'APPROVED') {
      return 'success';
    } else if (this.status === 'REJECTED') {
      return 'error';
    }
    return 'info';
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

export class BroadcastTemplateFormdata {
  public variables: BroadcastTemplateVariable[];

  constructor(data: any) {
    this.variables = data.variables
      ? data.variables.map((item: any) => new BroadcastTemplateVariable(item))
      : [];
  }
}
