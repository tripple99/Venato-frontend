import { AuthRole } from "@/model/auth.model";
import type { IAuth } from "@/types/auth.types";


export interface IProfile extends IAuth{
  image?:string,
  fullname:string,
  username?:string,
  uid:string,
  roles?:AuthRole,
  userMarket?:string[],

}
 