import { baseUrl } from "@/baseUrl";
import { LoginPayload, User } from "../models/auth.models";
import { api } from "@/modules/shared";
import { ApiResponse } from "@/modules/shared/models/api.models";
import { LoginResponse } from "../models/auth.models";
import { CURRENT_USER } from "@/modules/shared/models/common-models";

class AuthService {
    async login(payload: LoginPayload) : Promise<ApiResponse<LoginResponse>> {
        const response = await api.post(`${baseUrl}/api/v1/auth/login`, payload);
        return response.data;
    }

    getCurrentUser(): LoginResponse | null {
        try {
          const user = localStorage.getItem(CURRENT_USER);
          if (!user) return null;
          return JSON.parse(user);
        } catch (error) {
          console.error('Error getting current user:', error);
          return null;
        }
    }

    getCurrentUserId(): number | undefined {
        const user = this.getCurrentUser();
        return user?.user_id;
    }

    async getUserById(id: number): Promise<ApiResponse<User>> {
        const response = await api.get(`${baseUrl}/api/v1/user/${id}`);
        return response.data;
    }
}
export const authService = new AuthService();