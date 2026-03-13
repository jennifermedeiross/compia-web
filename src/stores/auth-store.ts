import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Order } from "@/types";
import { api } from "@/api/mock-api";
import { Phone } from "lucide-react";

interface AuthStore {
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
  ) => Promise<boolean>;
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

      login: async (email, password) => {
        try {
          const user = await api.auth.login(email, password);

          set({
            user: {
              id: String(user.id),
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
            },
            isAuthenticated: true,
          });

          await get().loadOrders();

          return true;
        } catch {
          return false;
        }
      },

      register: async (name, email, password, phone) => {
        try {
          const user = await api.auth.register(name, email, password, phone);

          set({
            user: {
              id: String(user.id),
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
            },
            isAuthenticated: true,
            orders: [],
          });

          return true;
        } catch {
          return false;
        }
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          orders: [],
        }),

      loadOrders: async () => {
        try {
          const orders = await api.orders.list();

          set({ orders });
        } catch {
          set({ orders: [] });
        }
      },

      addOrder: (order) =>
        set({
          orders: [order, ...get().orders],
        }),
    }),
    { name: "compia-auth" },
  ),
);
