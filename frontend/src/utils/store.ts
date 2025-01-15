import { create } from "zustand";

interface User {
  userid: string;
  username: string;
  email: string;
}

interface UserStore {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));