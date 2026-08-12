import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminSession {
  id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "admin";
}

interface AdminSessionState {
  isAuthenticated: boolean;
  admin: AdminSession | null;
  login: (admin: AdminSession) => void;
  logout: () => void;
}

export const useAdminSessionStore = create<AdminSessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      login: (admin) => set({ isAuthenticated: true, admin }),
      logout: () => set({ isAuthenticated: false, admin: null }),
    }),
    { name: "aurora-admin-session" }
  )
);
