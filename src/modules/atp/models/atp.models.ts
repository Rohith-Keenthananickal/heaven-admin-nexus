export class GetAllAreaCoordinatorsPayload {
    user_type: ['ADMIN' | 'AREA_COORDINATOR' | 'HOST' | 'GUEST']
    page?: number
    search_query?: string
    date_filter?: DateFilter
    limit?: number
    status?: ['ACTIVE' | 'BLOCKED' | 'DELETED']
    approval_status?: string[]
  }
  
  export class DateFilter {
    from_date: number
    to_date: number
  }

  export class UpdateApprovalStatusPayload {
    approval_status: 'PENDING' | 'APPROVED' | 'REJECTED'
    rejection_reason: string
  }

  export class UpdateUserStatusPayload {
    status: 'ACTIVE' | 'BLOCKED' | 'DELETED'
  }
  