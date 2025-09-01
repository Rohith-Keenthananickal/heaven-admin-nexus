import { baseUrl } from "@/baseUrl";
import { GetAllAreaCoordinatorsPayload, UpdateApprovalStatusPayload, UpdateUserStatusPayload } from "../models/atp.models";
import { api } from "@/modules/shared";
import { User } from "@/modules/auth/models/auth.models";
import { ApiResponse } from "@/modules/shared/models/api.models";

class AtpService {

    async getAllAreaCoordinators(payload : GetAllAreaCoordinatorsPayload) : Promise<ApiResponse<User>> {
        const response = await api.post(`${baseUrl}/api/v1/users/search`, payload);
        return response.data;
    }

    async getAreaCoordinatorById(id : string) : Promise<ApiResponse<User>> {
        const response = await api.get(`${baseUrl}/api/v1/users/${id}`);
        return response.data;
    }

    async updateApprovalStatus(id : string, payload : UpdateApprovalStatusPayload) : Promise<ApiResponse<User>> {
        const response = await api.patch(`${baseUrl}/api/v1/users/${id}/approval`, payload);
        return response.data;
    }

    async updateUserStatus(id : string, payload : UpdateUserStatusPayload) : Promise<ApiResponse<User>> {
        const response = await api.patch(`${baseUrl}/api/v1/users/${id}/status`, payload);
        return response.data;
    }
}

export default new AtpService();