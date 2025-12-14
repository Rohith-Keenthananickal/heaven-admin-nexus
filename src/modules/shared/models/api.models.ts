export interface ApiResponse<T> {
    status: boolean;
    data: T;
    statusCode: number;
    errMessage?: string;
  
  }

  
  
  export interface PaginatedResponse<T> {
    status: string
    data: T[]
    pagination: Pagination
  }

  // export class PaginatedWebData<T> {
  //   list: T;
  //   recordsPerPage: number;
  //   totalRecords: number;
  //   page: number;
  //   totalPages: number;
  // }

  export interface Pagination {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
  