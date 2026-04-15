import ClientLayout from "@/components/layout/ClientLayout";

import {createBrowserRouter} from "react-router-dom";

import AdminLayout from "@/components/layout/AdminLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import MarketLayout from "@/components/layout/MarketLayout";
import Dashboard from "@/pages/Admin/dashboard";
import ProductList from "@/pages/Admin/product-list";
import Product from "@/pages/Admin/products";
import {LoginForm} from "@/page/Auth/Login/Login";
import {SignUpForm} from "@/page/Auth/Register/Register";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import Settings from "@/pages/Admin/settings";
import { requireAuth } from "@/guards/auth.guard";
import { AuthRole } from "@/model/auth.model";
import VerifyOtpPage from "@/page/Auth/Otp/Otp";
import ForgotPasswordPage from "@/page/Auth/Forgot-Password/Forgot-Password";
import ResetPasswordPage from "@/page/Auth/Reset-Password/Reset-Password";

// User Pages
import UserDashboard from "@/pages/User/Dashboard";
import Inventory from "@/pages/User/Inventory";
import WatchList from "@/pages/User/WatchList";
import Alerts from "@/pages/User/Alerts";

// Super Admin Pages
import SuperAdminDashboard from "@/pages/SuperAdmin/Dashboard";
import MarketManagement from "@/pages/SuperAdmin/Market";
import AccessControl from "@/pages/SuperAdmin/Access";

export const router  = createBrowserRouter([
 {
  path:"/",
  element:<ClientLayout/>,
  children:[
    { index: true, element: <Home /> }
  ]
 },
 {
  path:'/auth',
  element:<AuthLayout/>,
  children:[
    {path:"register",element:<SignUpForm/>},
    {path:"login",element:<LoginForm />},
    {path:"forgot-password", element:<ForgotPasswordPage />},
    {path:"otp",element:<VerifyOtpPage/>},
    {path:"reset-password", element:<ResetPasswordPage />},

  ]
 },
 {
  path:"/markets",
  element:<MarketLayout />,
  children:[

  ]
 },
  {
    path: '/user',
    loader: requireAuth([AuthRole.User]),
    element: <AdminLayout />,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "watchlist", element: <WatchList /> },
      { path: "alerts", element: <Alerts /> },
    ],
  },
  {
    path: '/admin',
    loader: requireAuth([AuthRole.Admin]),
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <Product /> },
      { path: "product-list", element: <ProductList /> },
      { path: "settings", element: <Settings /> }
    ],
  },
  {
    path: '/superadmin',
    loader: requireAuth([AuthRole.superAdmin]),
    element: <AdminLayout />,
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: "market", element: <MarketManagement /> },
      { path: "access", element: <AccessControl /> },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  }


])