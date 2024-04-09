export class PaginationMeta {
  public total: number;
  public perPage: number;
  public currentPage: number;

  constructor(data: any) {
    this.total = data.total != null ? data.total : 0;
    this.perPage = data.perPage != null ? data.perPage : 10;
    this.currentPage = data.currentPage != null ? data.currentPage : 1;
  }
}
