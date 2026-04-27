import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { AuthRole } from "@/model/auth.model";
import { useAuthStore } from "../store/authStore";

import type { IProfile } from "@/model/user.model";
// 1. Define the shape of your persisted data so we can parse it safely
interface PersistedState {
  state: {
    isAuthenticated: boolean;
    user: IProfile;
  };
}

export const requireAuth =
  (allowedRoles?: AuthRole[]) =>
  async ({ request }: LoaderFunctionArgs) => {
    let { isAuthenticated, user } = useAuthStore.getState();

    if (!isAuthenticated) {
      try {
        const parsed: PersistedState = JSON.parse(
          localStorage.getItem("venato-accessToken")!,
        );
        isAuthenticated = parsed.state.isAuthenticated;
        user = parsed.state.user;
      } catch (e) {
        throw redirect("/auth/login");
      }
    }

    if (!isAuthenticated || !user) {
      const params = new URLSearchParams();
      params.set("from", new URL(request.url).pathname);
      throw redirect(`/auth/login?${params.toString()}`);
    }

    if (allowedRoles && !user.roles?.includes(allowedRoles[0])) {
      throw redirect("/unauthorized");
    }

    return null;
  };
