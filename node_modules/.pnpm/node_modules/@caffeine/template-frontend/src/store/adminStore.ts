import { create } from "zustand";

interface AdminStore {
  currentSection: string;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentSection: (section: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  currentSection: "dashboard",
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentSection: (section) => set({ currentSection: section }),
}));
