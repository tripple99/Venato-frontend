import { apiClient } from "./apiClient";
import { AuthService } from "./service/auth.service";

// Create a singleton instance of apiClient
const apiClientInstance = new apiClient({
  accessToken: localStorage.getItem('accessToken') || undefined,
});

// Export pre-configured service instances
export const authService = new AuthService();

// Export the apiClient instance if needed directly
export default apiClientInstance;
