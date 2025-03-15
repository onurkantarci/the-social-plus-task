import { create } from "zustand";
import { User } from "../types";

interface UsersState {
  selectedUser: User | null;
  users: User[];

  setUsers: (users: User[]) => void;
  setSelectedUser: (user: User) => void;
}

export const useUsersStore = create<UsersState>()((set) => ({
  selectedUser: null,
  users: [],
  setUsers: (newUsers: User[]) => set({ users: newUsers }),
  setSelectedUser: (newUser: User) => set({ selectedUser: newUser }),
}));
