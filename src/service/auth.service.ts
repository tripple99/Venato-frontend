import apiClient, {authAPI} from "@/api/api-client";
import {toast} from "sonner";

import {handleAnyError} from "@/handlers/GlobalErrorHandler";
import type {Login, SignUp} from "@/model/auth.model";
// import {useAuthStore} from "@/store/useAuth.store";
import userService from "./user.service";
import { useAuthStore } from "@/store/authStore";
import type { IProfile } from "@/model/user.model";
import { OtpPurpose } from "@/model/auth.model";

interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  payload: T;
}

interface OtpPayload {
  email: string;
  purpose: OtpPurpose;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

// interface SendMagicLinkPayload {
//   identifier: string;
// }



class AuthService {
  private baseApiUrl: string = "/auth";

  public async register(
    payload: SignUp,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}`, payload);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async login(
    payload: Login,
  ): Promise<IProfile & { message?: string }> {
    try {
      const response = await authAPI.login(payload);
      const userProfile = await userService.getMyProfile();
      useAuthStore
        .getState().setAuth(userProfile.payload, response.payload.accessToken);

        return { ...userProfile.payload, message: response.message };

    } catch (error: any) {
        handleAnyError(error);
      throw error;
    }

  }

  public async forgotPassword(
    email: string,
  ): Promise<ApiResponse<{ resetToken: string }>> {
    try {
      const response = await apiClient.post<
        ApiResponse<{ resetToken: string }>
      >(`${this.baseApiUrl}/forgot-password`, {email});
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  // public async getProfile(): Promise<ApiResponse<UserProfile>> {
  //   try {
  //     const response = await apiClient.get<ApiResponse<UserProfile>>(
  //       `${this.baseApiUrl}/profile`
  //     );
  //     toast.success(response.data.message);
  //     return response.data;
  //   } catch (error: any) {
  //     handleAnyError(error)
  //     throw error;
  //   }
  // }

  public async resetPassword(payload: {
    password: string;
    confirmPassword: string;
    resetToken: string;
  }): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      const response = await apiClient.patch<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}/reset-password`, payload);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async sendOtp(
    otpPayload: OtpPayload,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}/resend-otp`, otpPayload);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async verifyOtp(
    verifyOtpPayload: VerifyOtpPayload,
  ): Promise<ApiResponse<{ resetToken: string }>> {
    try {
      const response = await apiClient.post<
        ApiResponse<{ resetToken: string }>
      >(`${this.baseApiUrl}/validate-Otp`, verifyOtpPayload);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async sendMagicLink(
    sendMagicLinkPayload: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}/magic-link`, {email:sendMagicLinkPayload});
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async verifyMagicLink(
    token: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}/magic-link/verify`, token);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async mfaSetUp(): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  > {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}/mfa/setup`);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async mfaVerify(
    token: string,
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}/mfa/verify`, token);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async logout(): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  > {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}/logout`);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }

  public async refreshToken(): Promise<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  > {
    try {
      const response = await apiClient.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${this.baseApiUrl}/refresh-token`);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      handleAnyError(error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
