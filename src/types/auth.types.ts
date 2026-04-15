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
    _id:string,
    fullname:string,
    email:string,
    password:string,
    userRole:string,
    allowedMarkets:string[],
    sessionToken:string | null,
    refreshToken:string | null,
    isActive?: boolean;
    lastActive?: Date;
    provider:OauthProvider;
}