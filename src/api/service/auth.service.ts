import {apiClient} from "../apiClient";
import {type LoginResponse} from "../apiModel/auth.model";

interface Login {
  email:string,
  password:string
}

interface Register {
  fullname:string,
  email:string,
  password:string
}

class AuthServiceClass {
  private path: string = '/auth';
  private apiClientInstance: apiClient;

  constructor() {
    // Initialize apiClient internally with default config
    this.apiClientInstance = new apiClient({
      accessToken: localStorage.getItem('accessToken') || undefined,
    });
  }

 async login(data:Login): Promise<LoginResponse> {
    const response = await this.apiClientInstance.post<Login, LoginResponse>(`${this.path}/login`, data);
    return response;
  }

  async register(data:Register): Promise<LoginResponse> {
    const response = await this.apiClientInstance.post<Register, LoginResponse>(`${this.path}`, data);
    return response;
  }
}

// Export a singleton instance - no instantiation needed by consumers
export const authService = new AuthServiceClass();

// Also export the class for type purposes if needed
export {AuthServiceClass as AuthService};
  // async logout(): Promise<> {
  //   const response = await this.apiClient.post(`${this.path}/logout`);
  //   return response;
  // }

