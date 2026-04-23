import {
  deleteAddress,
  getUserAddresses,
  saveAddress,
  updateAddress,
} from "@/lib/addressService";
import type { Address } from "@/types";
import { Check, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useUserAuth } from "@/context/UserAuthContext";

type FormData = Omit<Address, "id">;

const EMPTY_FORM: FormData = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
];

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

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 animate-pulse space-y-3">
      <div className="h-4 w-1/2 bg-white/10 rounded" />
      <div className="h-3 w-3/4 bg-white/10 rounded" />
      <div className="h-3 w-2/3 bg-white/10 rounded" />
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  error?: string;
  optional?: boolean;
  onChange: (v: string) => void;
}

function FormField({
  id,
  label,
  value,
  placeholder,
  error,
  optional,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs text-slate-400 font-medium">
        {label} {optional && <span className="text-slate-600">(optional)</span>}
      </label>
      <input
        id={id}
        data-ocid={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:ring-1 transition-colors ${
          error
            ? "border-red-500/60 focus:border-red-400 focus:ring-red-500/30"
            : "border-white/10 focus:border-orange-500/60 focus:ring-orange-500/20"
        }`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface AddressFormProps {
  initial?: FormData;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function AddressForm({
  initial = EMPTY_FORM,
  onSave,
  onCancel,
  saving,
}: AddressFormProps) {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function validate(): boolean {
    const required: (keyof FormData)[] = [
      "name",
      "phone",
      "line1",
      "city",
      "state",
      "pincode",
    ];
    const errs: typeof errors = {};
    for (const k of required) {
      if (!String(form[k]).trim()) errs[k] = "Required";
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode))
      errs.pincode = "Enter a valid 6-digit pincode";
    if (form.phone && !/^\d{10}$/.test(form.phone))
      errs.phone = "Enter a valid 10-digit phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(form);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/5 border border-orange-500/30 p-5 space-y-4"
    >
      <p className="text-sm font-semibold text-white">
        {initial === EMPTY_FORM ? "Add New Address" : "Edit Address"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField
          id="address-input-name"
          label="Full Name"
          value={form.name}
          placeholder="John Doe"
          error={errors.name}
          onChange={(v) => set("name", v)}
        />
        <FormField
          id="address-input-phone"
          label="Phone Number"
          value={form.phone}
          placeholder="9876543210"
          error={errors.phone}
          onChange={(v) => set("phone", v)}
        />
        <FormField
          id="address-input-line1"
          label="Address Line 1"
          value={form.line1}
          placeholder="House / Flat / Street"
          error={errors.line1}
          onChange={(v) => set("line1", v)}
        />
        <FormField
          id="address-input-line2"
          label="Address Line 2"
          value={form.line2 ?? ""}
          placeholder="Area / Locality"
          optional
          onChange={(v) => set("line2", v)}
        />
        <FormField
          id="address-input-city"
          label="City"
          value={form.city}
          placeholder="Mumbai"
          error={errors.city}
          onChange={(v) => set("city", v)}
        />
        <div className="space-y-1">
          <label
            htmlFor="address-input-state"
            className="text-xs text-slate-400 font-medium"
          >
            State
          </label>
          <select
            id="address-input-state"
            data-ocid="address-input-state"
            value={form.state}
            onChange={(e) => set("state", e.target.value)}
            className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 transition-colors ${
              errors.state
                ? "border-red-500/60 focus:border-red-400 focus:ring-red-500/30"
                : "border-white/10 focus:border-orange-500/60 focus:ring-orange-500/20"
            }`}
          >
            <option value="" className="bg-slate-900">
              Select state
            </option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s} className="bg-slate-900">
                {s}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-xs text-red-400">{errors.state}</p>
          )}
        </div>
        <FormField
          id="address-input-pincode"
          label="Pincode"
          value={form.pincode}
          placeholder="400001"
          error={errors.pincode}
          onChange={(v) => set("pincode", v)}
        />
      </div>
      <label
        htmlFor="address-input-isDefault"
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          id="address-input-isDefault"
          data-ocid="address-input-isDefault"
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
          className="accent-orange-500"
        />
        <span className="text-sm text-slate-300">Set as default address</span>
      </label>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          data-ocid="address-save-btn"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-full bg-white/10 text-slate-300 text-sm hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

export function DashboardAddresses() {
  const { user } = useUserAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setAddresses([]);
      return;
    }
    const data = await getUserAddresses(user.uid);
    setAddresses(data);
  }, [user?.uid]);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  async function handleAdd(data: FormData) {
    if (!user?.uid) return;
    setSaving(true);
    await saveAddress(user.uid, data as Omit<Address, "id">);
    await reload();
    setSaving(false);
    setShowAddForm(false);
    setToast("Address saved successfully!");
  }

  async function handleEdit(id: string, data: FormData) {
    if (!user?.uid) return;
    setSaving(true);
    await updateAddress(
      user.uid,
      id,
      data as Partial<Omit<Address, "id">>,
    );
    await reload();
    setSaving(false);
    setEditId(null);
    setToast("Address updated!");
  }

  async function handleDelete(id: string) {
    if (!user?.uid) return;
    await deleteAddress(user.uid, id);
    await reload();
    setConfirmDeleteId(null);
    setToast("Address removed.");
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Addresses</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your saved delivery addresses
          </p>
        </div>
        <button
          type="button"
          data-ocid="addresses-add-btn"
          onClick={() => {
            setShowAddForm(true);
            setEditId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAddForm && (
          <AddressForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
            saving={saving}
          />
        )}
      </AnimatePresence>

      {/* Address grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : addresses.length === 0 && !showAddForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="addresses-empty-state"
          className="flex flex-col items-center py-16 text-center rounded-2xl bg-white/5 border border-white/10"
        >
          <MapPin size={48} className="text-slate-600 mb-4" />
          <p className="text-white font-semibold text-lg">No saved addresses</p>
          <p className="text-slate-400 text-sm mt-1">
            Add your first address to speed up checkout.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3 relative"
              >
                {editId === addr.id ? (
                  <AddressForm
                    initial={{
                      name: addr.name,
                      phone: addr.phone,
                      line1: addr.line1,
                      line2: addr.line2 ?? "",
                      city: addr.city,
                      state: addr.state,
                      pincode: addr.pincode,
                      isDefault: addr.isDefault,
                    }}
                    onSave={(data) => handleEdit(addr.id, data)}
                    onCancel={() => setEditId(null)}
                    saving={saving}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-white font-semibold text-sm">
                            {addr.name}
                          </p>
                          {addr.isDefault && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs border border-orange-500/30">
                              <Star size={10} /> Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {addr.phone}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          data-ocid={`address-edit-${addr.id}`}
                          onClick={() => {
                            setEditId(addr.id);
                            setShowAddForm(false);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          data-ocid={`address-delete-${addr.id}`}
                          onClick={() => setConfirmDeleteId(addr.id)}
                          className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {addr.line1}
                      {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city},{" "}
                      {addr.state} – {addr.pincode}
                    </p>
                  </>
                )}

                {/* Delete confirm */}
                <AnimatePresence>
                  {confirmDeleteId === addr.id && editId !== addr.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 rounded-2xl bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4"
                    >
                      <p className="text-white text-sm font-medium text-center">
                        Remove this address?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          data-ocid={`address-confirm-delete-${addr.id}`}
                          onClick={() => handleDelete(addr.id)}
                          className="px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-500 transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-4 py-1.5 rounded-full bg-white/10 text-slate-300 text-xs hover:bg-white/20 transition-colors"
                        >
                          <X size={12} className="inline" /> Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
