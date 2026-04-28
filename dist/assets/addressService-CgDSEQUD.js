import { x as getDocs, y as collection, z as db, a7 as addDoc, a8 as updateDoc, a9 as serverTimestamp, aa as doc, ab as deleteDoc } from "./index-Cz7jK1U2.js";
function addressesRef(userId) {
  return collection(db, "users", userId, "addresses");
}
async function clearDefault(userId) {
  const snapshot = await getDocs(addressesRef(userId));
  const updates = snapshot.docs.filter((d) => d.data().isDefault).map((d) => updateDoc(d.ref, { isDefault: false }));
  await Promise.all(updates);
}
async function getUserAddresses(userId) {
  const snapshot = await getDocs(addressesRef(userId));
  const data = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() })
  );
  return data.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}
async function saveAddress(userId, address) {
  if (address.isDefault) {
    await clearDefault(userId);
  }
  const docRef = await addDoc(addressesRef(userId), {
    ...address,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateAddress(userId, addressId, data) {
  if (data.isDefault) {
    await clearDefault(userId);
  }
  await updateDoc(doc(db, "users", userId, "addresses", addressId), {
    ...data,
    updatedAt: serverTimestamp()
  });
}
async function deleteAddress(userId, addressId) {
  await deleteDoc(doc(db, "users", userId, "addresses", addressId));
}
export {
  deleteAddress as d,
  getUserAddresses as g,
  saveAddress as s,
  updateAddress as u
};
