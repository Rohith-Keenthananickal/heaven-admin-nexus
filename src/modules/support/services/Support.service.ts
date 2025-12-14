import { api } from "@/modules/shared";
import { baseUrl } from "@/baseUrl";
import { ApiResponse, PaginatedResponse } from "@/modules/shared/models/api.models";
import { ListSupportTicketsPayload, SupportTicket, SupportTicketActivity } from "../models/support.models";

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
}
export const supportService = new SupportService();