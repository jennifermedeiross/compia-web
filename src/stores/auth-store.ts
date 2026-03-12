import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Order } from "@/types";
import { api } from "@/api/mock-api";

interface AuthStore {
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;

  loadOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      orders: [],
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        await new Promise((r) => setTimeout(r, 800));

        const isAdmin = email === "admin@compia.com";

        set({
          user: {
            id: isAdmin ? "admin-1" : "user-1",
            name: isAdmin ? "Administrador" : "João Silva",
            email,
            role: isAdmin ? "ADMIN" : "CUSTOMER",
          },
          isAuthenticated: true,
        });

        await get().loadOrders();

        return true;
      },

      register: async (name: string, email: string, _password: string) => {
        await new Promise((r) => setTimeout(r, 800));

        set({
          user: { id: "user-" + Date.now(), name, email, role: "CUSTOMER" },
          isAuthenticated: true,
          orders: [],
        });

        return true;
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          orders: [],
        }),

      loadOrders: async () => {
        const orders = await api.orders.list();
        set({ orders });
      },

      addOrder: (order) =>
        set({
          orders: [order, ...get().orders],
        }),
    }),
    { name: "compia-auth" },
  ),
);
