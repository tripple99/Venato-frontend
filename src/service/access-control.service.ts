import type { PaginatedApiResponse } from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import type { IProfile } from "@/model/user.model";
import { AuthRole } from "@/model/auth.model";


class AccessControlService {
    private baseUrl:string = "/access";
   public async getAccessControl(page = 1, limit = 20): Promise<PaginatedApiResponse<IProfile>> {
        try {
            const response = await apiClient.get<PaginatedApiResponse<IProfile>>(this.baseUrl, {
              params: { page, limit },
            });
            return response.data;
        } catch (error) {
            handleAnyError(error);
            throw error;
        }
    }

    public async inviteAdminUser(email: string, fullname: string, role: AuthRole): Promise<IProfile> {
        try {
            const response = await apiClient.post<IProfile>("/admin/users", {
                email,
                fullname,
                role
            });
            return response.data;
        } catch (error) {
            handleAnyError(error);
            throw error;
        }
    }
}


const accessControlService = new AccessControlService();
export default accessControlService;