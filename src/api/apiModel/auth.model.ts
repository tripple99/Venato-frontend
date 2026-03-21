
export interface LoginResponse{
  status: string;
  message: string;
  data: LoginData;
}

export interface LoginData{
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse{
  status: string;
  message: string;
  data: string;
}

// export interface ResponseData{

// }

export interface LoginRequest{
  email: string;
  password: string;
}

export interface RegisterRequest{
  email: string;
  password: string;
  fullname: string;
}

