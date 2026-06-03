import { baseUrl } from "@/baseUrl";
import { api } from "@/modules/shared";
import {
  CrmLead,
  CrmLeadFollowUp,
  CreateLeadPayload,
  UpdateLeadPayload,
  CreateFollowUpPayload,
  UpdateFollowUpPayload,
  LeadSearchPayload,
  LeadApiResponse,
  LeadSearchResponse,
  DeleteLeadResponse,
  DeleteFollowUpResponse,
} from "../models/atpLeads.models";

const CRM_BASE_URL = `${baseUrl}/api/v1/crm`;

class AtpLeadsService {
  // Lead CRUD Operations

  async createLead(payload: CreateLeadPayload): Promise<LeadApiResponse<CrmLead>> {
    const response = await api.post(`https://n8n.triphavenco.com/webhook/atp-lead`, payload);
    return response.data;
  }

  async getLeads(
    skip: number = 0,
    limit: number = 100,
    registration_status?: string
  ): Promise<LeadApiResponse<CrmLead[]>> {
    const params: Record<string, any> = { skip, limit };
    if (registration_status) {
      params.registration_status = registration_status;
    }
    const response = await api.get(`${CRM_BASE_URL}/leads`, { params });
    return response.data;
  }

  async searchLeads(payload: LeadSearchPayload): Promise<LeadSearchResponse> {
    const response = await api.post(`${CRM_BASE_URL}/leads/search`, payload);
    return response.data;
  }

  async getLeadById(leadPk: number): Promise<LeadApiResponse<CrmLead>> {
    const response = await api.get(`${CRM_BASE_URL}/leads/${leadPk}`);
    return response.data;
  }

  async getLeadByBusinessId(businessLeadId: string): Promise<LeadApiResponse<CrmLead>> {
    const response = await api.get(`${CRM_BASE_URL}/leads/by-lead-id/${businessLeadId}`);
    return response.data;
  }

  async updateLead(leadPk: number, payload: UpdateLeadPayload): Promise<LeadApiResponse<CrmLead>> {
    const response = await api.put(`${CRM_BASE_URL}/leads/${leadPk}`, payload);
    return response.data;
  }

  async updateLeadRegistrationStatus(
    leadPk: number,
    registration_status: string
  ): Promise<LeadApiResponse<CrmLead>> {
    const response = await api.patch(`${CRM_BASE_URL}/leads/${leadPk}/registration-status`, {
      registration_status,
    });
    return response.data;
  }

  async updateLeadCurrentStage(
    leadPk: number,
    current_stage: number
  ): Promise<LeadApiResponse<CrmLead>> {
    const response = await api.patch(`${CRM_BASE_URL}/leads/${leadPk}/current-stage`, {
      current_stage,
    });
    return response.data;
  }

  async deleteLead(leadPk: number): Promise<LeadApiResponse<DeleteLeadResponse>> {
    const response = await api.delete(`${CRM_BASE_URL}/leads/${leadPk}`);
    return response.data;
  }

  // Follow-up CRUD Operations

  async createFollowUp(
    leadPk: number,
    payload: CreateFollowUpPayload
  ): Promise<LeadApiResponse<CrmLeadFollowUp>> {
    const response = await api.post(`${CRM_BASE_URL}/leads/${leadPk}/followups`, payload);
    return response.data;
  }

  async getFollowUps(leadPk: number): Promise<LeadApiResponse<CrmLeadFollowUp[]>> {
    const response = await api.get(`${CRM_BASE_URL}/leads/${leadPk}/followups`);
    return response.data;
  }

  async getFollowUpById(
    leadPk: number,
    followupPk: number
  ): Promise<LeadApiResponse<CrmLeadFollowUp>> {
    const response = await api.get(`${CRM_BASE_URL}/leads/${leadPk}/followups/${followupPk}`);
    return response.data;
  }

  async updateFollowUp(
    leadPk: number,
    followupPk: number,
    payload: UpdateFollowUpPayload
  ): Promise<LeadApiResponse<CrmLeadFollowUp>> {
    const response = await api.put(
      `${CRM_BASE_URL}/leads/${leadPk}/followups/${followupPk}`,
      payload
    );
    return response.data;
  }

  async deleteFollowUp(
    leadPk: number,
    followupPk: number
  ): Promise<LeadApiResponse<DeleteFollowUpResponse>> {
    const response = await api.delete(`${CRM_BASE_URL}/leads/${leadPk}/followups/${followupPk}`);
    return response.data;
  }

  async markFollowUpCompleted(
    leadPk: number,
    followupPk: number,
    notes?: string
  ): Promise<LeadApiResponse<CrmLeadFollowUp>> {
    return this.updateFollowUp(leadPk, followupPk, {
      status: "COMPLETED",
      sent_at: new Date().toISOString(),
      notes,
    });
  }

  async markFollowUpFailed(
    leadPk: number,
    followupPk: number,
    notes?: string
  ): Promise<LeadApiResponse<CrmLeadFollowUp>> {
    return this.updateFollowUp(leadPk, followupPk, {
      status: "FAILED",
      notes,
    });
  }

  async markFollowUpSkipped(
    leadPk: number,
    followupPk: number,
    notes?: string
  ): Promise<LeadApiResponse<CrmLeadFollowUp>> {
    return this.updateFollowUp(leadPk, followupPk, {
      status: "SKIPPED",
      notes,
    });
  }
}

export const atpLeadsService = new AtpLeadsService();
