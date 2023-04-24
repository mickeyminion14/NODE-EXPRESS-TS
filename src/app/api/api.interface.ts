export interface ListingResult {
  pageIndex: number;
  pageSize: number;
  total: number;
  data: any[];
}

export interface IListData {
  pageIndex: number;
  pageSize: number;
  searchText?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
export interface PaginateOptions {
  pageIndex: number;
  pageSize: number;
}
