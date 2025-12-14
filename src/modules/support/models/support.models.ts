export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'ACTIVE' | 'INACTIVE';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketType = 'COMPLAINT' | 'INQUIRY' | 'REQUEST' | 'FEEDBACK';
export type Category = 'TECHNICAL_ISSUE' | 'ACCOUNT_ISSUE' | 'PAYMENT_ISSUE' | 'PROPERTY_ISSUE' | 'GUEST_COMPLAINT' | 'MAINTENANCE' | 'OTHER';
export type UserType = 'ALL' | 'GUEST' | 'STAFF';

export interface SupportTicket {
  id: number;
  issue: string;
  issue_code: string;
  type: TicketType;
  description: string;
  property_id: number;
  property_name: string;
  assigned_to_id: number;
  assigned_to_name: string;
  created_by_id: number;
  created_by_name: string;
  priority: Priority;
  status: TicketStatus;
  issue_status: IssueStatus;
  attachments: string[];
  activities_count: number;
  escalations_count: number;
  created_on: string;
  updated_at: string;
}

export interface SupportTicketActivity {
  id: number;
  ticket_id: number;
  activity_type: 'STATUS_CHANGE' | 'COMMENT' | 'ASSIGNMENT' | 'ESCALATION' | 'ATTACHMENT';
  description: string;
  created_by_name: string;
  created_at: string;
}

export interface SupportTicketComment {
  id: number;
  ticket_id: number;
  content: string;
  created_by_name: string;
  created_at: string;
}

export interface SupportTicketEscalation {
  id: number;
  ticket_id: number;
  escalated_to_name: string;
  reason: string;
  created_at: string;
}

export interface SupportTicketListResponse {
  status: string;
  data: SupportTicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface SupportTicketDetailResponse {
  status: string;
  data: SupportTicket;
  message: string;
}

export const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

export const categoryOptions = [
  { value: 'TECHNICAL_ISSUE', label: 'Technical Issue' },
  { value: 'ACCOUNT_ISSUE', label: 'Account Issue' },
  { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
  { value: 'PROPERTY_ISSUE', label: 'Property Issue' },
  { value: 'GUEST_COMPLAINT', label: 'Guest Complaint' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OTHER', label: 'Other' },
];

export const typeOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'GUEST', label: 'Guest' },
  { value: 'STAFF', label: 'Staff' },
];

export const issueStatusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

export const ticketTypeOptions = [
  { value: 'COMPLAINT', label: 'Complaint' },
  { value: 'INQUIRY', label: 'Inquiry' },
  { value: 'REQUEST', label: 'Request' },
  { value: 'FEEDBACK', label: 'Feedback' },
];