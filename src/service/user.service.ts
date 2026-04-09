import apiClient from "@/api/api-client";
import type { ApiResponse } from "@/model/api";
import { toast } from "sonner";
import type { IProfile } from "@/model/user.model";
import { useAuthStore } from "@/store/authStore";

class UserService {
  private baseApiUrl: string = "/profile";



  public async getMyProfile(): Promise<ApiResponse<IProfile>> {
    try {
      const response = await apiClient.get<ApiResponse<IProfile>>(
        `${this.baseApiUrl}/me`,
      );
      useAuthStore.setState((state) => ({
        user: {
          ...state.user,
          ...response.data.payload,
        },
      }));
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
      throw error;
    }
  }

  public async updateProfile(
    payload: Partial<IProfile>,
  ): Promise<ApiResponse<IProfile>> {
    try {
      const response = await apiClient.put<ApiResponse<IProfile>>(
        `${this.baseApiUrl}/me`,
        payload,
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
      throw error;
    }
  }

  public async uploadUserAvater(
    payload: File,
  ): Promise<ApiResponse<IProfile>> {
    const formData = new FormData();
    formData.append("file", payload);

    try {
      const response = await apiClient.post<ApiResponse<IProfile>>(
        `${this.baseApiUrl}/me/photo`,
        formData,
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
      throw error;
    }
  }
}

const userService = new UserService();

export default userService;
