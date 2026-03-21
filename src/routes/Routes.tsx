import ClientLayout from "@/components/layout/ClientLayout";

import {createBrowserRouter} from "react-router-dom";

import AdminLayout from "@/components/layout/AdminLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import MarketLayout from "@/components/layout/MarketLayout";
import Dashboard from "@/pages/Admin/dashboard";
import ProductList from "@/pages/Admin/product-list";
import Product from "@/pages/Admin/products";
import LogIn from "@/pages/auths/Log-In";
import SignUp from "@/pages/auths/Sign-up";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Admin/settings";

export const router  = createBrowserRouter([
 {
  path:"/",
  element:<ClientLayout/>,
  children:[
    { index: true, element: <Home /> }
  ]
 },
 {
  path:'/auths',
  element:<AuthLayout/>,
  children:[
    {path:"sign-up",element:<SignUp/>},
    {path:"login",element:<LogIn />}
  ]
 },
 {
  path:"/markets",
  element:<MarketLayout />,
  children:[

  ]
 },
 {
  path:'/admin',
  element:<AdminLayout/>,
  children:[
    {index:true,element:<Dashboard />},
    {path:'products',element:<Product/>},
    {path:"product-list",element:<ProductList/>},
    {path:"settings",element:<Settings/>}
  ],
 },
 {
    path: "*",
    element: <NotFound />,
  }


])