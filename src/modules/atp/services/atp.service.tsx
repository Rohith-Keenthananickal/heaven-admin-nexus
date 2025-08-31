import { baseUrl } from "@/baseUrl";
import { GetAllAreaCoordinatorsPayload } from "../models/atp.models";
import { api } from "@/modules/shared";
import { User } from "@/modules/auth/models/auth.models";
import { ApiResponse } from "@/modules/shared/models/api.models";

class AtpService {

    async getAllAreaCoordinators(payload : GetAllAreaCoordinatorsPayload) : Promise<ApiResponse<User>> {
        const response = await api.post(`${baseUrl}/api/v1/users/search`, payload);
        return response.data;
    }
}

export default new AtpService();