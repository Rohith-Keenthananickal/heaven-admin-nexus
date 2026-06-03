import { api } from "@/modules/shared";
import { baseUrl } from "@/baseUrl";
import { ApiResponse, PaginatedResponse } from "@/modules/shared/models/api.models";
import {
  CreateActivityPayload,
  CreateEscalationPayload,
  CreateIssuePayload,
  IssueAssignmentUpdatePayload,
  IssuePriorityUpdatePayload,
  IssueSearchPayload,
  IssueStatusUpdatePayload,
  SupportTicket,
  SupportTicketActivity,
  SupportTicketEscalation,
  UpdateEscalationPayload,
  UpdateIssuePayload,
} from "../models/support.models";

export interface PropertyOption {
  id: number;
  property_name: string;
  cover_image?: string | null;
}

export function isApiSuccess(status: unknown): boolean {
  return status === true || status === "success";
}

class SupportService {
  async listSupportTickets(payload: IssueSearchPayload): Promise<PaginatedResponse<SupportTicket>> {
    const response = await api.post<PaginatedResponse<SupportTicket>>(
      `${baseUrl}/api/v1/issues/search`,
      payload
    );
    return response.data;
  }

  async getSupportTicketById(id: number): Promise<ApiResponse<SupportTicket>> {
    const response = await api.get<ApiResponse<SupportTicket>>(`${baseUrl}/api/v1/issues/${id}`);
    return response.data;
  }

  async getSupportTicketActivities(id: number): Promise<ApiResponse<SupportTicketActivity[]>> {
    const response = await api.get<ApiResponse<SupportTicketActivity[]>>(
      `${baseUrl}/api/v1/issues/${id}/activities`
    );
    return response.data;
  }

  async getSupportTicketEscalations(id: number): Promise<ApiResponse<SupportTicketEscalation[]>> {
    const response = await api.get<ApiResponse<SupportTicketEscalation[]>>(
      `${baseUrl}/api/v1/issues/${id}/escalations`
    );
    return response.data;
  }

  async createSupportTicket(payload: CreateIssuePayload): Promise<ApiResponse<SupportTicket>> {
    const response = await api.post<ApiResponse<SupportTicket>>(`${baseUrl}/api/v1/issues/`, payload);
    return response.data;
  }

  async updateSupportTicket(id: number, payload: UpdateIssuePayload): Promise<ApiResponse<SupportTicket>> {
    const response = await api.put<ApiResponse<SupportTicket>>(`${baseUrl}/api/v1/issues/${id}`, payload);
    return response.data;
  }

  async deleteSupportTicket(id: number): Promise<ApiResponse<unknown>> {
    const response = await api.delete<ApiResponse<unknown>>(`${baseUrl}/api/v1/issues/${id}`);
    return response.data;
  }

  async updateIssueStatus(
    id: number,
    payload: IssueStatusUpdatePayload
  ): Promise<ApiResponse<SupportTicket>> {
    const response = await api.patch<ApiResponse<SupportTicket>>(
      `${baseUrl}/api/v1/issues/${id}/status?updated_by_id=${payload.updated_by_id}`,
      payload
    );
    return response.data;
  }

  async updateIssuePriority(
    id: number,
    payload: IssuePriorityUpdatePayload
  ): Promise<ApiResponse<SupportTicket>> {
    const response = await api.patch<ApiResponse<SupportTicket>>(
      `${baseUrl}/api/v1/issues/${id}/priority`,
      payload
    );
    return response.data;
  }

  async assignIssue(
    id: number,
    payload: IssueAssignmentUpdatePayload
  ): Promise<ApiResponse<SupportTicket>> {
    const response = await api.patch<ApiResponse<SupportTicket>>(
      `${baseUrl}/api/v1/issues/${id}/assign`,
      payload
    );
    return response.data;
  }

  async createActivity(
    issueId: number,
    payload: CreateActivityPayload
  ): Promise<ApiResponse<SupportTicketActivity>> {
    const response = await api.post<ApiResponse<SupportTicketActivity>>(
      `${baseUrl}/api/v1/issues/${issueId}/activities`,
      payload
    );
    return response.data;
  }

  async createEscalation(
    issueId: number,
    payload: CreateEscalationPayload
  ): Promise<ApiResponse<SupportTicketEscalation>> {
    const response = await api.post<ApiResponse<SupportTicketEscalation>>(
      `${baseUrl}/api/v1/issues/${issueId}/escalations`,
      payload
    );
    return response.data;
  }

  async updateEscalation(
    escalationId: number,
    payload: UpdateEscalationPayload
  ): Promise<ApiResponse<SupportTicketEscalation>> {
    const response = await api.patch<ApiResponse<SupportTicketEscalation>>(
      `${baseUrl}/api/v1/issues/escalations/${escalationId}`,
      payload
    );
    return response.data;
  }

  async searchProperties(page = 1, limit = 100): Promise<PropertyOption[]> {
    const response = await api.post<PaginatedResponse<PropertyOption[]>>(
      `${baseUrl}/api/v1/properties/search`,
      { page, limit }
    );
    const data = response.data?.data;
    if (!data) return [];
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      return (data as unknown as PropertyOption[][]).flat();
    }
    return Array.isArray(data) ? (data as unknown as PropertyOption[]) : [];
  }
}

export const supportService = new SupportService();
