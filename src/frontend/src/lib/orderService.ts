// Firebase disabled temporarily — order service stubs
import type { Order } from "@/types";

export type SaveOrderData = Omit<Order, "id"> & {
  couponCode?: string;
  couponDiscount?: number;
};

export async function saveOrder(_order: SaveOrderData): Promise<string> {
  // Firebase offline — return a mock order ID
  return `mock-order-${Date.now()}`;
}

export async function getUserOrders(_userId: string): Promise<Order[]> {
  return [];
}

export function subscribeToUserOrders(
  _userId: string,
  callback: (orders: Order[]) => void,
): () => void {
  callback([]);
  return () => {};
}

export async function getOrderById(_orderId: string): Promise<Order | null> {
  return null;
}
