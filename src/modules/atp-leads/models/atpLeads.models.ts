// ATP Leads Module Models - Based on CRM API Documentation

export type LeadRegistrationStatus = 'PENDING' | 'REGISTERED';

export type FollowUpChannel = 'WHATSAPP' | 'EMAIL' | 'SMS';

export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED' | 'FAILED';

export interface CrmLeadFollowUp {
  id: number;
  lead_id: number;
  step_order: number;
  channel: FollowUpChannel;
  scheduled_at: string;
  sent_at: string | null;
  status: FollowUpStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CrmLead {
  id: number;
  lead_id: string;
  name: string;
  email: string;
  phone: string;
  registration_status: LeadRegistrationStatus;
  current_stage: number | null;
  notes: string | null;
  followups: CrmLeadFollowUp[];
  created_at: string;
  updated_at: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone: string;
  lead_id?: string;
  registration_status?: LeadRegistrationStatus;
  current_stage?: number | null;
  notes?: string;
  followups?: CreateFollowUpPayload[];
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  registration_status?: LeadRegistrationStatus;
  current_stage?: number | null;
  notes?: string;
}

export interface CreateFollowUpPayload {
  step_order: number;
  channel: FollowUpChannel;
  scheduled_at: string;
  sent_at?: string | null;
  status?: FollowUpStatus;
  notes?: string;
}

export interface UpdateFollowUpPayload {
  step_order?: number;
  channel?: FollowUpChannel;
  scheduled_at?: string;
  sent_at?: string | null;
  status?: FollowUpStatus;
  notes?: string;
}

export interface LeadSearchPayload {
  page: number;
  limit: number;
  registration_status?: LeadRegistrationStatus;
  lead_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  current_stage?: number;
}

export interface LeadApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface LeadSearchResponse {
  status: string;
  data: CrmLead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface DeleteLeadResponse {
  lead_id: number;
  business_lead_id: string;
}

export interface DeleteFollowUpResponse {
  followup_id: number;
  lead_id: number;
}
