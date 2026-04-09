import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { IProfile } from "@/model/user.model";

// 1. Split State and Actions for better type safety
interface AuthState {
  user: IProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (user: IProfile, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<IProfile>) => void;
}

// 2. Combine them for the store type
type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      setAuth: (user, token) => 
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        }),

      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "auth-store",
      // 3. Partialize ensures we only persist DATA, not the functions
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // Optional: Explicitly use localStorage
      storage: createJSONStorage(() => localStorage), 
    }
  )
);