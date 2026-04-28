import { useMemo, useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithGoogle,
  updateProfile,
} from "../lib/firebase";
import { useNavigate } from "@tanstack/react-router";
import { upsertUserProfile } from "@/lib/userService";

export default function LoginPage() {
  const navigate = useNavigate();
  const initialMode = useMemo(() => {
    const mode = new URLSearchParams(window.location.search).get("mode");
    return mode === "signup" ? "signup" : "login";
  }, []);
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const cred = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password,
        );
        await upsertUserProfile(cred.user, {
          displayName: form.name,
          phone: form.phone,
          city: form.city,
        });
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password,
        );
        if (form.name.trim()) {
          await updateProfile(cred.user, { displayName: form.name.trim() });
        }
        await upsertUserProfile(cred.user, {
          displayName: form.name,
          phone: form.phone,
          city: form.city,
        });
      }
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    try {
      const cred = await signInWithGoogle();
      await upsertUserProfile(cred.user);
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold">
            {mode === "login" ? "Login to Tinkro" : "Create your account"}
          </h2>
          <p className="text-sm text-gray-500">
            {mode === "login"
              ? "Welcome back! Please login to continue."
              : "Sign up to access your dashboard and orders."}
          </p>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {mode === "signup" && (
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {mode === "signup" && (
          <>
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="city"
              type="text"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </>
        )}
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
              ? "Login"
              : "Sign Up"}
        </button>
        <div className="text-center text-sm text-gray-500">
          {mode === "login" ? "New here?" : "Already have an account?"} {" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-gray-500">or</span>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.23-1.4 3.6-5.27 3.6-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.03.77 3.73 1.43l2.54-2.47C16.1 4.6 14.23 3.6 12.17 3.6 6.97 3.6 2.83 7.74 2.83 12.94s4.14 9.34 9.34 9.34c5.38 0 8.93-3.77 8.93-9.1 0-.61-.07-1.08-.15-1.48z" />
            </svg>
            Login with Google
          </button>
        </div>
      </form>
    </div>
  );
}
