import type { Order } from "@/types";
import { create } from "zustand";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,

  setOrders: (orders) => set({ orders }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentOrder: (currentOrder) => set({ currentOrder }),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),
}));
