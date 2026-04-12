import type { CartItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (
    product: Pick<CartItem, "productId" | "name" | "image" | "price">,
    qty: number,
  ) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
}

function computeDerived(items: CartItem[]) {
  return {
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product, qty) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.productId,
          );
          const updatedItems = existing
            ? state.items.map((i) =>
                i.productId === product.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i,
              )
            : [...state.items, { ...product, quantity: qty }];
          return { items: updatedItems, ...computeDerived(updatedItems) };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (i) => i.productId !== productId,
          );
          return { items: updatedItems, ...computeDerived(updatedItems) };
        });
      },

      updateQty: (productId, qty) => {
        set((state) => {
          const updatedItems =
            qty <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: qty } : i,
                );
          return { items: updatedItems, ...computeDerived(updatedItems) };
        });
      },

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: "tinkro-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const derived = computeDerived(state.items);
          state.total = derived.total;
          state.itemCount = derived.itemCount;
        }
      },
    },
  ),
);
