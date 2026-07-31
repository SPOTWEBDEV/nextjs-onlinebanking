import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currentUser } from "@/lib/mock-data";
import type { User } from "@/lib/types";

interface SessionState {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: () => set({ isAuthenticated: true, user: currentUser }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    { name: "aurora-session" }
  )
);

interface TransferWizardState {
  fromAccountId: string | null;
  beneficiaryId: string | null;
  amount: number;
  note: string;
  step: "form" | "authorise" | "success";
  setDraft: (draft: Partial<Omit<TransferWizardState, "setDraft" | "reset" | "goTo">>) => void;
  goTo: (step: TransferWizardState["step"]) => void;
  reset: () => void;
}

export const useTransferWizard = create<TransferWizardState>((set) => ({
  fromAccountId: null,
  beneficiaryId: null,
  amount: 0,
  note: "",
  step: "form",
  setDraft: (draft) => set(draft),
  goTo: (step) => set({ step }),
  reset: () => set({ fromAccountId: null, beneficiaryId: null, amount: 0, note: "", step: "form" }),
}));

interface UiState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
