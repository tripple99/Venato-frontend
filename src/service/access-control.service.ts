import type { PaginatedApiResponse } from "@/model/api";
import apiClient from "@/api/api-client";
import { handleAnyError } from "@/handlers/GlobalErrorHandler";
import type { IProfile } from "@/model/user.model";


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
}


const accessControlService = new AccessControlService();
export default accessControlService;