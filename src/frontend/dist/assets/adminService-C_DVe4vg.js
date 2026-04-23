import { aI as onSnapshot, aJ as collection, aK as updateDoc, aL as doc, aM as deleteDoc, aN as db, aO as addDoc, aj as ref, al as uploadBytes, am as getDownloadURL, aP as httpsCallable, aQ as query, aR as where, aS as getDocs, aT as deleteObject, aU as serverTimestamp, an as getStorage, aV as functions } from "./index-BSySFNaW.js";
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
function subscribeToEnquiries(callback) {
  return onSnapshot(collection(db, "enquiries"), (snap) => {
    const data = snap.docs.map((docSnap) => {
      const raw = { id: docSnap.id, ...docSnap.data() };
      return normalizeDates(raw, ["createdAt", "respondedAt"]);
    });
    callback(data);
  });
}
async function updateEnquiry(id, data) {
  await updateDoc(doc(db, "enquiries", id), data);
}
async function deleteEnquiry(id) {
  await deleteDoc(doc(db, "enquiries", id));
}
function subscribeToAllOrders(callback) {
  return onSnapshot(collection(db, "orders"), (snap) => {
    const data = snap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    callback(data);
  });
}
async function updateOrderStatus(id, status, trackingId, estimatedDelivery) {
  const payload = { status };
  if (trackingId !== void 0) payload.trackingId = trackingId || null;
  if (estimatedDelivery !== void 0)
    payload.estimatedDelivery = estimatedDelivery || null;
  await updateDoc(doc(db, "orders", id), payload);
}
function subscribeToBlogPosts(callback) {
  return onSnapshot(collection(db, "blogs"), (snap) => {
    const data = snap.docs.map((doc2) => {
      const raw = { id: doc2.id, ...doc2.data() };
      return normalizeDates(raw, [
        "createdAt",
        "publishedAt",
        "scheduledAt",
        "updatedAt"
      ]);
    });
    callback(data);
  });
}
async function addBlogPost(data) {
  const docRef = await addDoc(collection(db, "blogs"), {
    ...data,
    views: 0,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateBlogPost(id, data) {
  await updateDoc(doc(db, "blogs", id), data);
}
async function deleteBlogPost(id) {
  await deleteDoc(doc(db, "blogs", id));
}
function subscribeToUsers(callback) {
  return onSnapshot(collection(db, "users"), (snap) => {
    const data = snap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    callback(data);
  });
}
async function updateUser(uid, data) {
  await updateDoc(doc(db, "users", uid), data);
}
async function getUserOrders(uid) {
  const q = query(collection(db, "orders"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
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
const toIsoString = (value) => value && typeof value === "object" && "toDate" in value ? value.toDate().toISOString() : value;
const normalizeDates = (data, keys) => {
  const next = { ...data };
  keys.forEach((key) => {
    if (key in next && next[key]) {
      next[key] = toIsoString(next[key]);
    }
  });
  return next;
};
const storage = getStorage();
async function uploadBlogImage(file, postId) {
  const storageRef = ref(
    storage,
    `blogs/${postId}/${Date.now()}_${file.name}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
function subscribeToCoupons(callback) {
  return onSnapshot(collection(db, "coupons"), (snap) => {
    const data = snap.docs.map((doc2) => {
      const raw = { id: doc2.id, ...doc2.data() };
      return normalizeDates(raw, ["createdAt", "expiresAt"]);
    });
    callback(data);
  });
}
async function addCoupon(data) {
  const docRef = await addDoc(collection(db, "coupons"), {
    ...data,
    usedCount: 0,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateCoupon(id, data) {
  await updateDoc(doc(db, "coupons", id), data);
}
async function deleteCoupon(id) {
  await deleteDoc(doc(db, "coupons", id));
}
function subscribeToBanners(callback) {
  return onSnapshot(collection(db, "banners"), (snap) => {
    const data = snap.docs.map((doc2) => {
      const raw = { id: doc2.id, ...doc2.data() };
      return normalizeDates(raw, [
        "createdAt",
        "scheduledFrom",
        "scheduledTo"
      ]);
    });
    callback(data);
  });
}
async function addBanner(data) {
  const docRef = await addDoc(collection(db, "banners"), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateBanner(id, data) {
  await updateDoc(doc(db, "banners", id), data);
}
async function deleteBanner(id) {
  await deleteDoc(doc(db, "banners", id));
}
async function uploadBannerImage(file, bannerId) {
  const storageRef = ref(
    storage,
    `banners/${bannerId}/${Date.now()}_${file.name}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
function subscribeToMedia(callback) {
  return onSnapshot(collection(db, "media"), (snap) => {
    const data = snap.docs.map((doc2) => {
      const raw = { id: doc2.id, ...doc2.data() };
      return normalizeDates(raw, ["uploadedAt"]);
    });
    callback(data);
  });
}
async function uploadMedia(file) {
  const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document";
  const docRef = await addDoc(collection(db, "media"), {
    filename: file.name,
    url,
    storagePath: storageRef.fullPath,
    size: file.size,
    type,
    mimeType: file.type,
    tags: [],
    alt: "",
    uploadedAt: serverTimestamp()
  });
  return {
    id: docRef.id,
    filename: file.name,
    url,
    storagePath: storageRef.fullPath,
    size: file.size,
    type,
    mimeType: file.type,
    tags: [],
    alt: "",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function updateMedia(id, data) {
  await updateDoc(doc(db, "media", id), data);
}
async function deleteMedia(id, storagePath) {
  await deleteDoc(doc(db, "media", id));
  if (storagePath) {
    await deleteObject(ref(storage, storagePath));
  }
}
function subscribeToShippingRules(callback) {
  return onSnapshot(collection(db, "shippingRules"), (snap) => {
    const data = snap.docs.map((doc2) => {
      const raw = { id: doc2.id, ...doc2.data() };
      return normalizeDates(raw, ["createdAt"]);
    });
    callback(data);
  });
}
async function addShippingRule(data) {
  const docRef = await addDoc(collection(db, "shippingRules"), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateShippingRule(id, data) {
  await updateDoc(doc(db, "shippingRules", id), data);
}
async function deleteShippingRule(id) {
  await deleteDoc(doc(db, "shippingRules", id));
}
function subscribeToEmailTemplates(callback) {
  return onSnapshot(collection(db, "emailTemplates"), (snap) => {
    const data = snap.docs.map((doc2) => {
      const raw = { id: doc2.id, ...doc2.data() };
      return normalizeDates(raw, ["createdAt", "updatedAt"]);
    });
    callback(data);
  });
}
async function addEmailTemplate(data) {
  const docRef = await addDoc(collection(db, "emailTemplates"), {
    ...data,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}
async function updateEmailTemplate(id, data) {
  await updateDoc(doc(db, "emailTemplates", id), {
    ...data,
    updatedAt: serverTimestamp()
  });
}
async function deleteEmailTemplate(id) {
  await deleteDoc(doc(db, "emailTemplates", id));
}
async function sendPromoEmail(payload) {
  const fn = httpsCallable(functions, "sendPromoEmail");
  const res = await fn(payload);
  return res.data;
}
export {
  deleteCoupon as A,
  addCoupon as B,
  subscribeToEnquiries as C,
  updateEnquiry as D,
  deleteEnquiry as E,
  subscribeToUsers as F,
  updateUser as G,
  sendPromoEmail as H,
  getUserOrders as I,
  subscribeToMedia as J,
  uploadMedia as K,
  updateMedia as L,
  deleteMedia as M,
  subscribeToShippingRules as N,
  updateShippingRule as O,
  deleteShippingRule as P,
  addShippingRule as Q,
  subscribeToEmailTemplates as R,
  updateEmailTemplate as S,
  addEmailTemplate as T,
  deleteEmailTemplate as U,
  subscribeToAllOrders as a,
  subscribeToProducts as b,
  subscribeToCategories as c,
  deleteProduct as d,
  addProduct as e,
  updateCategory as f,
  deleteCategory as g,
  addCategory as h,
  updateOrderStatus as i,
  subscribeToLabSetups as j,
  updateLabSetup as k,
  deleteLabSetup as l,
  addLabSetup as m,
  subscribeToBlogPosts as n,
  updateBlogPost as o,
  deleteBlogPost as p,
  addBlogPost as q,
  uploadBlogImage as r,
  subscribeToCoupons as s,
  subscribeToBanners as t,
  updateProduct as u,
  addBanner as v,
  updateBanner as w,
  uploadBannerImage as x,
  deleteBanner as y,
  updateCoupon as z
};
