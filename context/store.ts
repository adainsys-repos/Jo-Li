import { create } from "zustand";

export type storeTypes = {
  authToken: string;
  setAuthToken: (token: string) => string;
  updateJobs: string;
  setUpdateJobs: (token: string) => string;
};

export const useStore = create((set) => ({
  authToken: "",
  setAuthToken: (token: string) => set({ authToken: token }),
  updateJobs: false,
  setUpdateJobs: (token: boolean) => set({ updateJobs: token }),
  updateUsers: false,
  setUpdateUsers: (user: boolean) => set({ updateUsers: user }),
}));
