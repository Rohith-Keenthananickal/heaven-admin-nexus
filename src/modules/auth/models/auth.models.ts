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
  }


  export interface User {
    user_type: string
    phone_number: string
    full_name: string
    profile_image: string
    status: boolean
    updated_at: string
    id: number
    auth_provider: string
    email: string
    dob: string
    created_at: string
  }