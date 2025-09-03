export class LoginPayload {
    auth_provider?: string
    email?: string
    phone_number?: string
    password?: string
    google_token?: string
    otp?: string
}


export interface LoginResponse {
    access_token: string
    token_type: string
    expires_in: number
    user_id: number
    user_type: string
    full_name: string
    user: User
  }


  // export interface User {
  //   user_type: string
  //   phone_number: string
  //   full_name: string
  //   profile_image: string
  //   status: boolean
  //   updated_at: string
  //   id: number
  //   auth_provider: string
  //   email: string
  //   dob: string
  //   created_at: string
  // }


  export class User {
    id: number
    auth_provider: string
    user_type: string
    email: string
    phone_number: string
    full_name: string
    dob: string
    profile_image: string
    status: string
    created_at: string
    updated_at: string
    guest_profile: GuestProfile
    host_profile: HostProfile
    area_coordinator_profile: AreaCoordinatorProfile
  }
  
  export interface GuestProfile {
    passport_number: string
    nationality: string
    preferences: Preferences
    id: number
  }
  
  export interface Preferences {
    additionalProp1: AdditionalProp1
  }
  
  export interface AdditionalProp1 {
    additionalProp1: string
  }
  
  export interface HostProfile {
    license_number: string
    experience_years: number
    company_name: string
    id: number
  }
  
  export interface AreaCoordinatorProfile {
    region: string
    assigned_properties: number
    approval_status: string
    approval_date: string
    approved_by: number
    rejection_reason: string
    id_proof_type: string
    id_proof_number: string
    pancard_number: string
    passport_size_photo: string
    id_proof_document: string
    address_proof_document: string
    district: string
    panchayat: string
    address_line1: string
    address_line2: string
    city: string
    state: string
    postal_code: string
    latitude: number
    longitude: number
    emergency_contact: string
    emergency_contact_name: string
    emergency_contact_relationship: string
    id: number
    bank_details: BankDetails
  }
  
  export interface BankDetails {
    bank_name: string
    account_holder_name: string
    account_number: string
    ifsc_code: string
    branch_name: string
    branch_code: string
    account_type: string
    bank_passbook_image: string
    cancelled_cheque_image: string
    id: number
    area_coordinator_id: number
    is_verified: boolean
    created_at: string
    updated_at: string
  }
  
  export interface Pagination {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
  