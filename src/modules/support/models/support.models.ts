export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'ESCALATED' | 'CLOSED';
export type TicketType = 'COMPLAINT' | 'SUPPORT';
export type IssueSource = 'INTERNAL_UI' | 'EXTERNAL_WEBSITE';
export type EscalationLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';

export interface SupportTicket {
  id: number;
  issue: string;
  issue_code: string;
  type: TicketType;
  description?: string | null;
  property_id?: number | null;
  property_name?: string | null;
  assigned_to_id?: number | null;
  assigned_to_name?: string | null;
  created_by_id: number;
  created_by_name?: string | null;
  priority: Priority;
  status: TicketStatus;
  issue_status: IssueStatus;
  source?: IssueSource;
  attachments?: string[] | null;
  email?: string | null;
  phone?: string | null;
  activities_count: number;
  escalations_count: number;
  created_on: string;
  updated_at: string;
}

export interface SupportTicketEscalation {
  id: number;
  issue_id: number;
  escalation_level: EscalationLevel;
  reason?: string | null;
  notes?: string | null;
  escalated_by_id: number;
  escalated_by_name?: string | null;
  escalated_to_id: number;
  escalated_to_name?: string | null;
  resolved: boolean;
  resolved_at?: string | null;
  resolved_by_id?: number | null;
  resolved_by_name?: string | null;
  created_at: string;
  updated_at: string;
}

export const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export const listTypeFilterOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'SUPPORT', label: 'Support' },
  { value: 'COMPLAINT', label: 'Complaint' },
];

export const issueStatusOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'ESCALATED', label: 'Escalated' },
  { value: 'CLOSED', label: 'Closed' },
];

export const ticketTypeOptions = [
  { value: 'COMPLAINT', label: 'Complaint' },
  { value: 'SUPPORT', label: 'Support' },
];

export const escalationLevelOptions = [
  { value: 'LEVEL_1', label: 'Level 1' },
  { value: 'LEVEL_2', label: 'Level 2' },
  { value: 'LEVEL_3', label: 'Level 3' },
];

export interface CreateIssuePayload {
  issue: string;
  type: TicketType;
  description?: string | null;
  property_id?: number | null;
  assigned_to_id?: number | null;
  priority?: Priority;
  attachments?: string[] | null;
  email?: string | null;
  phone?: string | null;
  created_by_id: number;
  issue_status?: IssueStatus;
  source?: IssueSource;
}

export interface UpdateIssuePayload {
  issue?: string | null;
  type?: TicketType | null;
  description?: string | null;
  property_id?: number | null;
  assigned_to_id?: number | null;
  status?: TicketStatus | null;
  issue_status?: IssueStatus | null;
  priority?: Priority | null;
  attachments?: string[] | null;
  email?: string | null;
  phone?: string | null;
  source?: IssueSource | null;
}

export interface IssueSearchPayload {
  page?: number;
  limit?: number;
  type?: TicketType | null;
  status?: TicketStatus | null;
  issue_status?: IssueStatus | null;
  priority?: Priority | null;
  created_by_id?: number | null;
  assigned_to_id?: number | null;
  property_id?: number | null;
  issue?: string | null;
  source?: IssueSource | null;
}

export interface SupportTicketActivity {
  activity_type: ActivityType;
  description?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  activity_metadata?: Record<string, unknown> | null;
  id: number;
  issue_id: number;
  performed_by_id: number;
  performed_by_name?: string | null;
  created_at: string;
}

export interface CreateActivityPayload {
  activity_type: ActivityType;
  description?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  activity_metadata?: Record<string, unknown> | null;
  performed_by_id: number;
}

export interface IssueStatusUpdatePayload {
  issue_status: IssueStatus;
  description?: string | null;
  updated_by_id: number;
}

export interface IssuePriorityUpdatePayload {
  priority: Priority;
}

export interface IssueAssignmentUpdatePayload {
  assigned_to_id?: number | null;
}

export interface CreateEscalationPayload {
  escalation_level: EscalationLevel;
  reason?: string | null;
  notes?: string | null;
  escalated_by_id: number;
  escalated_to_id: number;
}

export interface UpdateEscalationPayload {
  resolved?: boolean | null;
  notes?: string | null;
  resolved_by_id?: number | null;
}

export enum ActivityType {
  CREATED = "CREATED",
  STATUS_CHANGED = "STATUS_CHANGED",
  ASSIGNED = "ASSIGNED",
  UPDATED = "UPDATED",
  COMMENT_ADDED = "COMMENT_ADDED",
  ESCALATED = "ESCALATED",
  ATTACHMENT_ADDED = "ATTACHMENT_ADDED",
  PRIORITY_CHANGED = "PRIORITY_CHANGED",
  CLOSED = "CLOSED",
  REOPENED = "REOPENED",
}
