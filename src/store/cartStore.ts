import type { CartItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (
    product: Pick<
      CartItem,
      | "productId"
      | "name"
      | "image"
      | "price"
      | "variantId"
      | "variantLabel"
      | "packQty"
    >,
    qty: number,
  ) => void;
  removeItem: (productId: string) => void;
  decrementItem: (productId: string, variantId?: string) => void;
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
              // Match existing by productId + variantId (if provided) so different pack variants are separate cart lines
              const existing = state.items.find((i) => {
                if (product.variantId) {
                  return i.productId === product.productId && i.variantId === product.variantId;
                }
                return i.productId === product.productId && !i.variantId;
              });
              const updatedItems = existing
                ? state.items.map((i) =>
                    (i.productId === product.productId && (product.variantId ? i.variantId === product.variantId : !i.variantId))
                      ? { ...i, quantity: i.quantity + qty }
                      : i,
                  )
                : [...state.items, { ...product, quantity: qty } as any];
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

      decrementItem: (productId, variantId) => {
        set((state) => {
          const matchesItem = (item: CartItem) =>
            item.productId === productId &&
            (variantId ? item.variantId === variantId : !item.variantId);
          const updatedItems = state.items
            .map((item) =>
              matchesItem(item)
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0);
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
