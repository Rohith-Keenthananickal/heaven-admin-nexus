export class GetAllAreaCoordinatorsPayload {
    user_type: string[]
    page?: number
    search_query?: string
    date_filter?: DateFilter
    limit?: number
    status?: string[]
    approval_status?: string[]
  }
  
  export class DateFilter {
    from_date: number
    to_date: number
  }