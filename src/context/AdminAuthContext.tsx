import type { AdminUser } from "@/types/admin";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AdminAuthContextValue {
  adminUser: AdminUser | null;
  adminRole: AdminUser["role"] | null;
  isLoading: boolean;
  seedError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function normalizeAdminRole(role: unknown): AdminUser["role"] | null {
  if (role === "superAdmin" || role === "super_admin") return "superAdmin";
  if (role === "admin" || role === "editor") return role;
  return null;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminRole, setAdminRole] = useState<AdminUser["role"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seedError, setSeedError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        // Fetch admin user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "adminusers", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as AdminUser;
            const role = normalizeAdminRole(data.role);
            if (role) {
              setAdminUser({ ...data, role });
              setAdminRole(role);
              setSeedError(null);
            } else {
              setAdminUser(null);
              setAdminRole(null);
              setSeedError("Not authorized as admin");
            }
          } else {
            setAdminUser(null);
            setAdminRole(null);
            setSeedError("Not authorized as admin");
          }
        } catch (err) {
          setAdminUser(null);
          setAdminRole(null);
          setSeedError("Failed to fetch admin user data");
        }
      } else {
        setAdminUser(null);
        setAdminRole(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setSeedError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;
      const userDoc = await getDoc(doc(db, "adminusers", user.uid));

      if (userDoc.exists()) {
        const data = userDoc.data() as AdminUser;
        const role = normalizeAdminRole(data.role);
        if (!role) {
          throw new Error("Not authorized as admin");
        }
        setAdminUser({ ...data, role });
        setAdminRole(role);
      } else {
        throw new Error("Not authorized as admin");
      }
      setIsLoading(false);
    } catch (err: any) {
      setSeedError(err.message || "Login failed");
      if (err.message === "Not authorized as admin") {
        await signOut(auth);
        setAdminUser(null);
        setAdminRole(null);
      }
      setIsLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setAdminUser(null);
    setAdminRole(null);
  };

  const contextValue: AdminAuthContextValue = {
    adminUser,
    adminRole,
    isLoading,
    seedError,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return ctx;
}
