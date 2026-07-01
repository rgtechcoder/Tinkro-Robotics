import type { Order } from "@/types";
import { db, functions } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export type SaveOrderData = Omit<Order, "id" | "createdAt"> & {
  createdAt?: string;
};

const toIsoString = (value: unknown) =>
  value && typeof value === "object" && "toDate" in value
    ? (value as { toDate: () => Date }).toDate().toISOString()
    : value;

const normalizeDates = <T>(data: T, keys: Array<keyof T>) => {
  const next = { ...(data as unknown as Record<string, unknown>) };
  keys.forEach((key) => {
    if (key in next && next[key as string]) {
      next[key as string] = toIsoString(next[key as string]);
    }
  });
  return next as unknown as T;
};

export async function saveOrder(order: SaveOrderData): Promise<string> {
  const docRef = await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  const data = snap.docs.map((docSnap) => {
    const raw = { id: docSnap.id, ...docSnap.data() } as Order;
    return normalizeDates(raw, ["createdAt"]);
  });
  return data.sort((a, b) =>
    new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime(),
  );
}

export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void,
): () => void {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((docSnap) => {
      const raw = { id: docSnap.id, ...docSnap.data() } as Order;
      return normalizeDates(raw, ["createdAt"]);
    });
    const sorted = data.sort((a, b) =>
      new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime(),
    );
    callback(sorted);
  });
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, "orders", orderId));
  if (!snap.exists()) return null;
  const raw = { id: snap.id, ...snap.data() } as Order;
  return normalizeDates(raw, ["createdAt"]);
}

export async function hasUserRedeemedCoupon(
  userId: string,
  couponId: string,
): Promise<boolean> {
  const redemptionId = `${couponId}_${userId}`;
  const snap = await getDoc(doc(db, "couponRedemptions", redemptionId));
  return snap.exists();
}

export async function cancelOrder(orderId: string): Promise<void> {
  const cancelOrderFn = httpsCallable(functions, "cancelOrder");
  try {
    await cancelOrderFn({ orderId });
  } catch (error) {
    console.warn("cancelOrder callable failed, falling back to direct order update", error);
    await updateDoc(doc(db, "orders", orderId), {
      status: "cancelled",
    });
  }
}
