import type { Address } from "@/types";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

function addressesRef(userId: string) {
  return collection(db, "users", userId, "addresses");
}

async function clearDefault(userId: string) {
  const snapshot = await getDocs(addressesRef(userId));
  const updates = snapshot.docs
    .filter((d) => d.data().isDefault)
    .map((d) => updateDoc(d.ref, { isDefault: false }));
  await Promise.all(updates);
}

export async function getUserAddresses(userId: string): Promise<Address[]> {
  const snapshot = await getDocs(addressesRef(userId));
  const data = snapshot.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Omit<Address, "id">) }) as Address,
  );
  return data.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}

export async function saveAddress(
  userId: string,
  address: Omit<Address, "id">,
): Promise<string> {
  if (address.isDefault) {
    await clearDefault(userId);
  }
  const docRef = await addDoc(addressesRef(userId), {
    ...address,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  data: Partial<Omit<Address, "id">>,
): Promise<void> {
  if (data.isDefault) {
    await clearDefault(userId);
  }
  await updateDoc(doc(db, "users", userId, "addresses", addressId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAddress(
  userId: string,
  addressId: string,
): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "addresses", addressId));
}
