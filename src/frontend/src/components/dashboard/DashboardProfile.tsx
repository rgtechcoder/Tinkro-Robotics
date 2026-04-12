import { getUserAddresses } from "@/lib/addressService";
import { getUserId } from "@/lib/firebase";
import { subscribeToUserOrders } from "@/lib/orderService";
import { Check, Mail, Pencil, Phone, Shield, User, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ProfileData {
  displayName: string;
  email: string;
  phone: string;
}

const LS_KEYS = {
  displayName: "tinkro_display_name",
  email: "tinkro_email",
  phone: "tinkro_phone",
  memberSince: "tinkro_member_since",
};

function loadProfile(): ProfileData {
  return {
    displayName: localStorage.getItem(LS_KEYS.displayName) ?? "",
    email: localStorage.getItem(LS_KEYS.email) ?? "",
    phone: localStorage.getItem(LS_KEYS.phone) ?? "",
  };
}

function saveProfile(data: ProfileData) {
  localStorage.setItem(LS_KEYS.displayName, data.displayName);
  localStorage.setItem(LS_KEYS.email, data.email);
  localStorage.setItem(LS_KEYS.phone, data.phone);
}

function getMemberSince(): string {
  let ms = localStorage.getItem(LS_KEYS.memberSince);
  if (!ms) {
    ms = new Date().toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
    localStorage.setItem(LS_KEYS.memberSince, ms);
  }
  return ms;
}

function getInitials(name: string): string {
  if (!name.trim()) return "TR";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium"
    >
      <Check size={14} /> {msg}
    </motion.div>
  );
}

function SkeletonProfile() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-white/10" />
        <div className="h-5 w-32 bg-white/10 rounded" />
        <div className="h-3 w-24 bg-white/10 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="h-16 bg-white/10 rounded-xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 bg-white/10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function DashboardProfile() {
  const [profile, setProfile] = useState<ProfileData>(loadProfile());
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(loadProfile());
  const [orderCount, setOrderCount] = useState(0);
  const [addressCount, setAddressCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const userId = getUserId();
  const memberSince = getMemberSince();

  useEffect(() => {
    let ready = { orders: false, addresses: false };
    function checkDone() {
      if (ready.orders && ready.addresses) setLoading(false);
    }

    const unsub = subscribeToUserOrders(userId, (orders) => {
      setOrderCount(orders.length);
      ready.orders = true;
      checkDone();
    });

    getUserAddresses(userId).then((addrs) => {
      setAddressCount(addrs.length);
      ready.addresses = true;
      checkDone();
    });

    return unsub;
  }, [userId]);

  function startEdit() {
    setDraft({ ...profile });
    setEditMode(true);
  }

  function cancelEdit() {
    setDraft({ ...profile });
    setEditMode(false);
  }

  function saveEdit() {
    saveProfile(draft);
    setProfile({ ...draft });
    setEditMode(false);
    setToast("Profile updated successfully!");
  }

  const initials = getInitials(profile.displayName);

  const fields: {
    key: keyof ProfileData;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    placeholder: string;
    type: string;
  }[] = [
    {
      key: "displayName",
      label: "Display Name",
      icon: User,
      placeholder: "Your full name",
      type: "text",
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      placeholder: "you@example.com",
      type: "email",
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      placeholder: "9876543210",
      type: "tel",
    },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your account details
          </p>
        </div>
        {!editMode && !loading && (
          <button
            type="button"
            data-ocid="profile-edit-btn"
            onClick={startEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-slate-300 text-sm hover:bg-white/20 hover:text-white transition-colors"
          >
            <Pencil size={13} /> Edit Profile
          </button>
        )}
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
          <SkeletonProfile />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 space-y-8"
        >
          {/* Avatar + name */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-orange-500 text-white text-2xl font-bold shadow-xl shadow-blue-500/20 select-none">
              {initials}
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">
                {profile.displayName || "Tinkro User"}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                Member since {memberSince}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-white">{orderCount}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total Orders</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-white">{addressCount}</p>
              <p className="text-xs text-slate-500 mt-0.5">Saved Addresses</p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            {fields.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.key} className="space-y-1">
                  <label
                    htmlFor={`profile-input-${f.key}`}
                    className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"
                  >
                    <Icon size={12} /> {f.label}
                  </label>
                  <input
                    id={`profile-input-${f.key}`}
                    data-ocid={`profile-input-${f.key}`}
                    type={f.type}
                    value={editMode ? draft[f.key] : profile[f.key]}
                    readOnly={!editMode}
                    placeholder={f.placeholder}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [f.key]: e.target.value }))
                    }
                    className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${
                      editMode
                        ? "border-white/10 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 text-white placeholder-slate-600"
                        : "border-white/10 text-slate-300 cursor-default"
                    } ${!profile[f.key] && !editMode ? "italic text-slate-600" : ""}`}
                  />
                  {!editMode && !profile[f.key] && (
                    <span className="sr-only">Not set</span>
                  )}
                </div>
              );
            })}

            {/* Account ID — read only */}
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Shield size={12} /> Account ID
              </p>
              <div
                id="profile-account-id"
                aria-label="Account ID"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-500 flex items-center gap-2"
              >
                <span className="flex-1 truncate">{userId}</span>
                <span className="text-xs text-slate-600 flex-shrink-0">
                  Read only
                </span>
              </div>
            </div>
          </div>

          {/* Edit mode buttons */}
          {editMode && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 pt-1"
            >
              <button
                type="button"
                data-ocid="profile-save-btn"
                onClick={saveEdit}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all"
              >
                <Check size={14} /> Save Changes
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                data-ocid="profile-cancel-btn"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-slate-300 text-sm hover:bg-white/20 transition-colors"
              >
                <X size={14} /> Cancel
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
