import { aa as onSnapshot, ab as collection, ac as deleteDoc, ad as doc, ae as updateDoc, af as db, ag as addDoc, ah as serverTimestamp, a7 as getStorage } from "./index-O-oxzsBJ.js";
function subscribeToProducts(callback) {
  return onSnapshot(collection(db, "products"), (snap) => {
    const data = snap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    callback(data);
  });
}
async function addProduct(product) {
  const docRef = await addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateProduct(id, data) {
  await updateDoc(doc(db, "products", id), data);
}
async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}
function subscribeToCategories(callback) {
  return onSnapshot(collection(db, "categories"), (snap) => {
    const data = snap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    callback(data);
  });
}
async function addCategory(category) {
  const docRef = await addDoc(collection(db, "categories"), {
    ...category,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateCategory(id, data) {
  await updateDoc(doc(db, "categories", id), data);
}
async function deleteCategory(id) {
  await deleteDoc(doc(db, "categories", id));
}
function subscribeToAllOrders(callback) {
  return onSnapshot(collection(db, "orders"), (snap) => {
    const data = snap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    callback(data);
  });
}
async function updateOrderStatus(id, status) {
  await updateDoc(doc(db, "orders", id), { status });
}
function subscribeToLabSetups(callback) {
  return onSnapshot(collection(db, "labSetups"), (snap) => {
    const data = snap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    callback(data);
  });
}
async function addLabSetup(data) {
  const docRef = await addDoc(collection(db, "labSetups"), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateLabSetup(id, data) {
  await updateDoc(doc(db, "labSetups", id), data);
}
async function deleteLabSetup(id) {
  await deleteDoc(doc(db, "labSetups", id));
}
getStorage();
export {
  subscribeToProducts as a,
  subscribeToCategories as b,
  addProduct as c,
  deleteProduct as d,
  updateCategory as e,
  deleteCategory as f,
  addCategory as g,
  updateOrderStatus as h,
  subscribeToLabSetups as i,
  updateLabSetup as j,
  deleteLabSetup as k,
  addLabSetup as l,
  subscribeToAllOrders as s,
  updateProduct as u
};
