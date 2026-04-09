export interface SignUp {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Login {
  email: string;
  password: string;
}

export enum AuthRole{
    User = "user",
    Admin = "admin",
    superAdmin = "superadmin" 
}

export enum AllowedMarkets{
    Default = '',
    Charanchi = "Charanchi",
    Ajiwa = "Ajiwa",
    Dawanau = "Dawanau",
}