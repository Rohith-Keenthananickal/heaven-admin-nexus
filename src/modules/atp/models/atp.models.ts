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

  export interface GeoMapProperty {
    id: number
    property_name: string
    user_id: number
    latitude: number
    longitude: number
    address: string
  }

  export interface GeoMapATP {
    id: number
    full_name: string
    email: string
    phone_number: string
    profile_image: string
    atp_uuid: string
    latitude: number
    longitude: number
    district: string
    panchayat: string
    address_line1: string
    address_line2: string
    city: string
    state: string
    postal_code: string
    properties: GeoMapProperty[]
  }

  export interface GeoMapPayload {
    limit: number
    active_only: boolean
  }

  export interface GeoMapResponse {
    status: string
    data: GeoMapATP[]
    message: string
  }
  