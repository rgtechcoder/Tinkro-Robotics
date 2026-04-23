import { auth, db } from "@/lib/firebase";
import type { User } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export interface UserProfileRecord {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  city?: string;
  createdAt?: string;
  lastLoginAt?: string;
  isActive?: boolean;
}

export interface UserProfileInput {
  displayName?: string;
  phone?: string;
  city?: string;
}

export async function upsertUserProfile(
  user: User,
  input: UserProfileInput = {},
) {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);

  const displayName =
    input.displayName || user.displayName || user.email || "User";

  const baseData = {
    uid: user.uid,
    email: user.email ?? "",
    displayName,
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.city !== undefined ? { city: input.city } : {}),
    isActive: true,
  };

  if (!snapshot.exists()) {
    await setDoc(ref, {
      ...baseData,
      createdAt: serverTimestamp(),
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
    });
    return;
  }

  await updateDoc(ref, {
    ...baseData,
    lastLoginAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string) {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return snapshot.data() as UserProfileRecord;
}

export async function updateUserProfile(uid: string, data: UserProfileInput) {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    const email = auth.currentUser?.email ?? "";
    await setDoc(ref, {
      uid,
      email,
      ...(data.displayName !== undefined ? { displayName: data.displayName } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      isActive: true,
      createdAt: serverTimestamp(),
    });
    return;
  }
  await updateDoc(ref, {
    ...(data.displayName !== undefined ? { displayName: data.displayName } : {}),
    ...(data.phone !== undefined ? { phone: data.phone } : {}),
    ...(data.city !== undefined ? { city: data.city } : {}),
    lastLoginAt: serverTimestamp(),
  });
}

export function getCurrentUser() {
  return auth.currentUser;
}
