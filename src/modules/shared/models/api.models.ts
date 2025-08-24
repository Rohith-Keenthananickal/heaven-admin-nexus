export interface ApiResponse<T> {
    status: boolean;
    data: T;
    statusCode: number;
    errMessage?: string;
  
  }
  
  export interface HkResponse<T> {
    data: T;
    message?: string;
    status?: number;
    statusCode?: number;
    success?: boolean;
    errMessage?: string;
  }
  
  export interface HKPaginationResponse<T> {
    code: number;
    message: string;
    data: HKPaginatedWebData<T>;
  }
  
  export interface PaginatedResponse<T> {
    code: number;
    message: string;
    data: PaginatedWebData<T>;
  }
  
  export class HKPaginatedWebData<T> {
    list: T;
    recordsPerPage: number;
    totalRecords: number;
    page: number;
    totalPages: number;
  }
  
  export interface HkResponse1<T> {
    data: T;
    message: string;
    code: number;
  }
  
  export class PaginatedWebData<T> {
    list: T;
    recordsPerPage: number;
    totalRecords: number;
    page: number;
    totalPages: number;
  }