import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
// Environment-based API URL configuration
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Debug logging for API configuration
if (import.meta.env.VITE_DEBUG === "true" || import.meta.env.DEV) {
  console.log("API Configuration:", {
    baseURL: BASE_URL,
    environment: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  });
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Increased from 10000ms to 30000ms (30 seconds)
  headers: {
    Accept: "application/json",
  },
  withCredentials: false, // Set to true if your API requires credentials
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_DEBUG === "true" || import.meta.env.DEV) {
      console.log("API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("venato-accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Enhanced error logging for debugging
    console.error("API Error Details:", {
      message: error.message,
      code: error.code,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers,
      },
      response: error.response
        ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        }
        : "No response received",
      request: error.request
        ? "Request was made but no response received"
        : "Request was not made",
    });

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;
      console.log("no network");
      try {
        const refreshToken = localStorage.getItem("venato-refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await apiClient.post("/auth/refresh", {
          token: refreshToken,
        });
        const { accessToken } = response.data.payload;

        localStorage.setItem("venato-accessToken", accessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("venato-accessToken");
        localStorage.removeItem("venato-refreshToken");
        useAuthStore.getState().logout();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API Types
export interface LoginRequest {
  email: string; // username or email
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  payload: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
  username: string;
}

// Network connectivity test
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     // Test basic connectivity to the server
//     await fetch(BASE_URL, {
//       method: "HEAD",
//       mode: "no-cors", // Avoid CORS issues for connectivity test
//     });
//     console.log("Server connectivity test passed");
//     return true;
//   } catch (error) {
//     console.error("Server connectivity test failed:", error);
//     return false;
//   }
// };

// API Functions
export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Test connectivity first in development
    // if (import.meta.env.DEV) {
    //   const isConnected = await testConnection();
    //   if (!isConnected) {
    //     console.warn(
    //       "Server connectivity test failed, but proceeding with login attempt...",
    //     );
    //   }
    // }
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post(
        "/auth/login",
        data,
      );
      toast.success(response.data.message);

      localStorage.setItem(
        "venato-accessToken",
        response.data.payload.accessToken,
      );
      localStorage.setItem(
        "venato-refreshToken",
        response.data.payload.refreshToken,
      );
      // const user = await userService.getUserProfile();
      // console.log(user,"User data");
      // useAuthStore.getState().setAuth(user);
      return response.data;
    } catch (error) {
      console.error(error);
      // useAuthStore.getState().setLoading(false);
      // handleAnyError(error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
      localStorage.removeItem("venato-accessToken");
      localStorage.removeItem("venato-refreshToken");
      // useAuthStore.getState().clearAuth();
      // useEmployerStore.getState().clearProfile();
      useAuthStore.getState().logout();
      window.location.replace("/auth/login");
      toast.success("logged successfully");
    } catch (error) {
      console.error(error);
      // handleAnyError(error);
      // useAuthStore.getState().clearAuth();
      // useEmployerStore.getState().clearProfile();
      localStorage.removeItem("venato-accessToken");
      localStorage.removeItem("venato-refreshToken");
      useAuthStore.getState().logout();
      window.location.replace("/auth/login");
      console.error("Logout error:", error);
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem("venato-accessToken");
      localStorage.removeItem("venato-refreshToken");
      localStorage.removeItem("venato-user");
      useAuthStore.getState().logout();
    }
  },

  refreshToken: async (token: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      "/auth/refresh",
      {
        token,
      },
    );
    localStorage.setItem(
      "venato-accessToken",
      response.data.payload.accessToken,
    );
    localStorage.setItem(
      "venato-refreshToken",
      response.data.payload.refreshToken,
    );
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<{ payload: User }> =
      await apiClient.get("/auth/profile");
    return response.data.payload;
  },
};

export default apiClient;
