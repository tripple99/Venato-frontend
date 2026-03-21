export type AuthRole = {
    User : "user",
    Admin : "admin",
    superAdmin : "superadmin" 
}

export type AllowedMarkets = {
    Default : '',
    Charanchi : "Charanchi",
    Ajiwa :"Ajiwa",
    Dawanau : "Dawanau",
}

export type OauthProvider = {
    Google : "google",
    Twitter : "twitter",
    Facebook : "facebook"

}

  
export interface IAuth{
    fullname:string,
    email:string,
    password:string,
    userRole:AuthRole,
    allowedMarkets:AllowedMarkets,
    sessionToken:string | null,
    refreshToken:string | null,
    isActive?: boolean;
    lastActive?: Date;
    provider:OauthProvider;
}