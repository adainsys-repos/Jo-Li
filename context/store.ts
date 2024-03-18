import { create } from "zustand";

export type storeTypes = {
  authToken: String;
  setAuthToken: (token: string) => String;
  updateJobs: String;
  setUpdateJobs: (token: string) => String;
};

export const useStore = create((set) => ({
  authToken: "",
  setAuthToken: (token: string) => set({ authToken: token }),
  updateJobs: false,
  setUpdateJobs: (token: boolean) => set({ updateJobs: token }),
  updateUsers: false,
  setUpdateUsers: (user: boolean) => set({ updateUsers: user }),
}));
