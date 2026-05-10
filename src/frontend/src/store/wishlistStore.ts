import type { WishlistItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
  addItem: (product: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

function computeDerived(items: WishlistItem[]) {
  return { itemCount: items.length };
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      addItem: (product) => {
        set((state) => {
          if (state.items.some((i) => i.productId === product.productId)) {
            return state;
          }
          const updatedItems = [...state.items, product];
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

      toggleItem: (product) => {
        const exists = get().items.some(
          (i) => i.productId === product.productId,
        );
        if (exists) {
          get().removeItem(product.productId);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),

      clearWishlist: () => set({ items: [], itemCount: 0 }),
    }),
    {
      name: "tinkro-wishlist",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const derived = computeDerived(state.items);
          state.itemCount = derived.itemCount;
        }
      },
    },
  ),
);
