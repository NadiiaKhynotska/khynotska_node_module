export interface IQuery {
  page: string;
  limit: string;
  sortedBy: string;

  [key: string]: string | number;
}

export interface IPaginationResponse<T> {
  page: number;
  limit: number;
  itemsFound: number;
  data: T[];
}
