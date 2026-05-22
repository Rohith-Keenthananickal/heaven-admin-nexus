import { api } from "@/modules/shared";
import { baseUrl } from "@/baseUrl";
import { ApiResponse, PaginatedResponse } from "@/modules/shared/models/api.models";
import { CreateIssuePayload, ListSupportTicketsPayload, SupportTicket, SupportTicketActivity } from "../models/support.models";

export interface PropertyOption {
  id: number;
  property_name: string;
  cover_image?: string | null;
}

class SupportService {
    
    async listSupportTickets(payload: ListSupportTicketsPayload) : Promise<PaginatedResponse<SupportTicket[]>> {
        try {
        const response = await api.post<PaginatedResponse<SupportTicket[]>>(`${baseUrl}/api/v1/issues/search`, payload);
            return response.data;
        } catch (error) {
            console.error('Error listing support tickets:', error);
            throw error;
        }
    }

    async getSupportTicketById(id: number) : Promise<ApiResponse<SupportTicket>> {
        try {
            const response = await api.get<ApiResponse<SupportTicket>>(`${baseUrl}/api/v1/issues/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting support ticket by id:', error);
            throw error;
        }
    }

    async getSupportTicketActivities(id: number) : Promise<ApiResponse<SupportTicketActivity[]>> {
        try {
            const response = await api.get<ApiResponse<SupportTicketActivity[]>>(`${baseUrl}/api/v1/issues/${id}/activities`);
            return response.data;
        } catch (error) {
            console.error('Error getting support ticket activities:', error);
            throw error;
        }
    }

    async createSupportTicket(payload: CreateIssuePayload): Promise<ApiResponse<SupportTicket>> {
        try {
            const response = await api.post<ApiResponse<SupportTicket>>(`${baseUrl}/api/v1/issues/`, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating support ticket:', error);
            throw error;
        }
    }

    async searchProperties(page = 1, limit = 100): Promise<PropertyOption[]> {
        try {
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
        } catch (error) {
            console.error('Error searching properties:', error);
            throw error;
        }
    }
}
export const supportService = new SupportService();