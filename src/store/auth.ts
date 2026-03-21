import {create} from "zustand"
import {persist} from "zustand/middleware"
import {type IAuth } from "@/types/auth.types"

interface Auth{
  user:IAuth | null,
  token: string|null,
  isAuthenticated:boolean,
  login:(data:IAuth)=>void,
  logout:(sessionToken:string)=>void,
  updateUser:(data:Partial<IAuth>)=>void
}


export const authStore = create<Auth>()(
  persist(
       (set,get)=>({
          user:null,
          isAuthenticated:false,
          token:"",
          login:(data:IAuth)=>{
            localStorage.setItem("sessionToken",data.sessionToken)
            set({user:data,token:data.sessionToken ,isAuthenticated:true})
          },
          logout:(token:string)=>{
            localStorage.removeItem("sessionToken")
            set({user:null,token:"",isAuthenticated:false})
          },
          updateUser:(data:Partial<IAuth>)=>{
            const currentUser = get().user

            if(currentUser){
              set({user:{...currentUser,...data}})
            }
          }
       }),
       {
        name:"auth-store",
        partialize:(state)=>({
          user:state.user,
          token:state.token,
          isAuthenticated:state.isAuthenticated
        })
       }

  )
)