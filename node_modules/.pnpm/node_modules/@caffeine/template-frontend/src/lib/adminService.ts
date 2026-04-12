// import type {
//   AdminBanner,
//   AdminBlogPost,
//   AdminCategory,
//   AdminCoupon,
//   AdminEmailTemplate,
//   AdminEnquiry,
//   AdminLabSetup,
//   AdminMedia,
//   AdminOrder,
//   AdminProduct,
//   AdminShippingRule,
//   AdminUser,
//   AdminUserRecord,
//   DashboardStats,
// } from "@/types/admin";
// import type { OrderStatus } from "@/types/index";
// import { auth, db } from "@/lib/firebase";
// import {
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   User as FirebaseUser,
// } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   onSnapshot,
//   collection,
//   query,
//   where,
// } from "firebase/firestore";

// // ─── Auth ───────────────────────────────────────────────────────────────

// export async function ensureDefaultAdmin(): Promise<void> {
//   // Optionally implement admin seeding logic here
// }

// export async function adminLogin(email: string, password: string): Promise<AdminUser> {
//   const cred = await signInWithEmailAndPassword(auth, email, password);
//   const user = cred.user;
//   const userDoc = await getDoc(doc(db, "adminusers", user.uid));
//   if (!userDoc.exists()) {
//     throw new Error("Not authorized as admin");
//   }
//   return userDoc.data() as AdminUser;
// }

// export async function adminLogout(): Promise<void> {
//   await signOut(auth);
// }

// export function subscribeToAdminAuth(
//   callback: (user: AdminUser | null) => void,
// ): () => void {
//   const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
//     if (user) {
//       const userDoc = await getDoc(doc(db, "adminusers", user.uid));
//       if (userDoc.exists()) {
//         callback(userDoc.data() as AdminUser);
//       } else {
//         callback(null);
//       }
//     } else {
//       callback(null);
//     }
//   });
//   return unsubscribe;
// }

// // ─── Products ─────────────────────────────────────────────────────────────────

// export function subscribeToProducts(
//   callback: (products: AdminProduct[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addProduct(
//   _product: Omit<AdminProduct, "id" | "createdAt">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateProduct(
//   _id: string,
//   _data: Partial<Omit<AdminProduct, "id">>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteProduct(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// // ─── Categories ───────────────────────────────────────────────────────────────

// export function subscribeToCategories(
//   callback: (categories: AdminCategory[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addCategory(
//   _category: Omit<AdminCategory, "id" | "createdAt">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateCategory(
//   _id: string,
//   _data: Partial<Omit<AdminCategory, "id">>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteCategory(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function uploadCategoryImage(
//   _file: File,
//   _categoryId: string,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// // ─── Orders ───────────────────────────────────────────────────────────────────

// export function subscribeToAllOrders(
//   callback: (orders: AdminOrder[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function updateOrderStatus(
//   _id: string,
//   _status: OrderStatus | "processing",
//   _trackingId?: string,
//   _estimatedDelivery?: string,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// // ─── Lab Setups ───────────────────────────────────────────────────────────────

// export function subscribeToLabSetups(
//   callback: (setups: AdminLabSetup[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addLabSetup(
//   _setup: Omit<AdminLabSetup, "id" | "createdAt">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateLabSetup(
//   _id: string,
//   _data: Partial<Omit<AdminLabSetup, "id">>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteLabSetup(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// // ─── Dashboard Stats ──────────────────────────────────────────────────────────

// export function subscribeToDashboardStats(
//   callback: (stats: DashboardStats) => void,
// ): () => void {
//   const days = Array.from({ length: 7 }, (_, i) => {
//     const d = new Date();
//     d.setDate(d.getDate() - (6 - i));
//     return d.toISOString().split("T")[0];
//   });
//   callback({
//     totalOrders: 0,
//     totalRevenue: 0,
//     totalUsers: 0,
//     totalProducts: 0,
//     recentOrders: [],
//     revenueByDay: days.map((date) => ({ date, amount: 0 })),
//     ordersByDay: days.map((date) => ({ date, count: 0 })),
//     usersByDay: days.map((date) => ({ date, count: 0 })),
//   });
//   return () => {};
// }

// // ─── Coupons ──────────────────────────────────────────────────────────────────

// export function subscribeToCoupons(
//   callback: (coupons: AdminCoupon[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addCoupon(
//   _data: Omit<AdminCoupon, "id" | "createdAt" | "usedCount">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateCoupon(
//   _id: string,
//   _data: Partial<AdminCoupon>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteCoupon(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// // ─── Users ────────────────────────────────────────────────────────────────────

// export function subscribeToUsers(
//   callback: (users: AdminUserRecord[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export const subscribeToAllUsers = subscribeToUsers;

// export async function updateUser(
//   _uid: string,
//   _data: Partial<AdminUserRecord>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function getUserOrders(_uid: string): Promise<AdminOrder[]> {
//   return [];
// }

// // ─── Blog / CMS ───────────────────────────────────────────────────────────────

// export function subscribeToBlogPosts(
//   callback: (posts: AdminBlogPost[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addBlogPost(
//   _data: Omit<AdminBlogPost, "id" | "createdAt" | "views">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateBlogPost(
//   _id: string,
//   _data: Partial<AdminBlogPost>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteBlogPost(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function uploadBlogImage(
//   _file: File,
//   _postId: string,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// // ─── Banners ──────────────────────────────────────────────────────────────────

// export function subscribeToBanners(
//   callback: (banners: AdminBanner[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addBanner(
//   _data: Omit<AdminBanner, "id" | "createdAt">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateBanner(
//   _id: string,
//   _data: Partial<AdminBanner>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteBanner(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function uploadBannerImage(
//   _file: File,
//   _bannerId: string,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// // ─── Enquiries ────────────────────────────────────────────────────────────────

// export function subscribeToEnquiries(
//   callback: (enquiries: AdminEnquiry[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addEnquiry(
//   _data: Omit<AdminEnquiry, "id" | "createdAt">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateEnquiry(
//   _id: string,
//   _data: Partial<AdminEnquiry>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteEnquiry(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// // ─── Media Library ────────────────────────────────────────────────────────────

// export function subscribeToMedia(
//   callback: (media: AdminMedia[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function uploadMedia(_file: File): Promise<AdminMedia> {
//   throw new Error("Firebase disabled");
// }

// export async function updateMedia(
//   _id: string,
//   _data: Partial<AdminMedia>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteMedia(
//   _id: string,
//   _storagePath: string,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// // ─── Shipping Rules ───────────────────────────────────────────────────────────

// export function subscribeToShippingRules(
//   callback: (rules: AdminShippingRule[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addShippingRule(
//   _data: Omit<AdminShippingRule, "id" | "createdAt">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateShippingRule(
//   _id: string,
//   _data: Partial<AdminShippingRule>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteShippingRule(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// // ─── Email Templates ──────────────────────────────────────────────────────────

// export function subscribeToEmailTemplates(
//   callback: (templates: AdminEmailTemplate[]) => void,
// ): () => void {
//   callback([]);
//   return () => {};
// }

// export async function addEmailTemplate(
//   _data: Omit<AdminEmailTemplate, "id" | "createdAt">,
// ): Promise<string> {
//   throw new Error("Firebase disabled");
// }

// export async function updateEmailTemplate(
//   _id: string,
//   _data: Partial<AdminEmailTemplate>,
// ): Promise<void> {
//   throw new Error("Firebase disabled");
// }

// export async function deleteEmailTemplate(_id: string): Promise<void> {
//   throw new Error("Firebase disabled");
// }














import type {
  AdminBanner,
  AdminBlogPost,
  AdminCategory,
  AdminCoupon,
  AdminEmailTemplate,
  AdminEnquiry,
  AdminLabSetup,
  AdminMedia,
  AdminOrder,
  AdminProduct,
  AdminShippingRule,
  AdminUser,
  AdminUserRecord,
  DashboardStats,
} from "@/types/admin";

import type { OrderStatus } from "@/types/index";

import { auth, db } from "@/lib/firebase";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// ================= AUTH =================

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;

  const userDoc = await getDoc(doc(db, "adminusers", user.uid));

  if (!userDoc.exists()) {
    throw new Error("Not authorized as admin");
  }

  return userDoc.data() as AdminUser;
}

export async function adminLogout(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAdminAuth(callback: (user: AdminUser | null) => void) {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "adminusers", user.uid));
      callback(userDoc.exists() ? (userDoc.data() as AdminUser) : null);
    } else {
      callback(null);
    }
  });
}

// ================= PRODUCTS =================

export function subscribeToProducts(callback: (products: AdminProduct[]) => void) {
  return onSnapshot(collection(db, "products"), (snap) => {
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data as AdminProduct[]);
  });
}

export async function addProduct(product: any) {
  const docRef = await addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: any) {
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}

// ================= CATEGORIES =================

export function subscribeToCategories(callback: (data: AdminCategory[]) => void) {
  return onSnapshot(collection(db, "categories"), (snap) => {
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data as AdminCategory[]);
  });
}

export async function addCategory(category: any) {
  const docRef = await addDoc(collection(db, "categories"), {
    ...category,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, data: any) {
  await updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string) {
  await deleteDoc(doc(db, "categories", id));
}

// ================= ORDERS =================

export function subscribeToAllOrders(callback: (orders: AdminOrder[]) => void) {
  return onSnapshot(collection(db, "orders"), (snap) => {
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data as AdminOrder[]);
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus | "processing"
) {
  await updateDoc(doc(db, "orders", id), { status });
}

// ================= BLOG =================

// export function subscribeToBlogPosts(callback: (posts: AdminBlogPost[]) => void) {
//   return onSnapshot(collection(db, "blogs"), (snap) => {
//     const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     callback(data as AdminBlogPost[]);
//   });
// }

// export async function addBlogPost(data: any) {
//   const docRef = await addDoc(collection(db, "blogs"), {
//     ...data,
//     createdAt: serverTimestamp(),
//   });
//   return docRef.id;
// }

// export async function updateBlogPost(id: string, data: any) {
//   await updateDoc(doc(db, "blogs", id), data);
// }

// export async function deleteBlogPost(id: string) {
//   await deleteDoc(doc(db, "blogs", id));
// }

// ================= USERS =================

export function subscribeToUsers(callback: (users: AdminUserRecord[]) => void) {
  return onSnapshot(collection(db, "users"), (snap) => {
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data as AdminUserRecord[]);
  });
}

// ================= DASHBOARD =================

export function subscribeToDashboardStats(callback: (stats: DashboardStats) => void) {
  callback({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [],
    revenueByDay: [],
    ordersByDay: [],
    usersByDay: [],
  });
  return () => {};
}
// ================= LAB SETUP =================

// 🔁 realtime fetch
export function subscribeToLabSetups(callback: (data: AdminLabSetup[]) => void) {
  return onSnapshot(collection(db, "labSetups"), (snap) => {
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data as AdminLabSetup[]);
  });
}

// ➕ add
export async function addLabSetup(data: any) {
  const docRef = await addDoc(collection(db, "labSetups"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ✏ update
export async function updateLabSetup(id: string, data: any) {
  await updateDoc(doc(db, "labSetups", id), data);
}

// ❌ delete
export async function deleteLabSetup(id: string) {
  await deleteDoc(doc(db, "labSetups", id));
}

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export async function uploadCategoryImage(file: File) {
  const storageRef = ref(storage, `categories/${Date.now()}_${file.name}`);
  
  await uploadBytes(storageRef, file);
  
  const url = await getDownloadURL(storageRef);
  return url;
}