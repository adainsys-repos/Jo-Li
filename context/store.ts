import { create } from "zustand";

export type storeTypes = {
  authToken: String;
  setAuthToken: (token: string) => String;
};

export const useStore = create((set) => ({
  authToken: "",
  setAuthToken: (token: string) => set({ authToken: token }),
}));
