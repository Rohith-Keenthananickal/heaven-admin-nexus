import { GetAllAreaCoordinatorsPayload } from "@/modules/atp/models/atp.models";
import { ApiResponse } from "@/modules/shared/models/api.models";
import { User } from "@/modules/auth/models/auth.models";
import { api } from "@/modules/shared";
import { baseUrl } from "@/baseUrl";

class HostService {

    async getAllHosts(payload : GetAllAreaCoordinatorsPayload) : Promise<ApiResponse<User>> {
        const response = await api.post(`${baseUrl}/api/v1/users/search`, payload);
        return response.data;
    }
    
    async getHostById(id : string) : Promise<ApiResponse<User>> {
        const response = await api.get(`${baseUrl}/api/v1/users/${id}`);
        return response.data;
    }
}

export default new HostService();