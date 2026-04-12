import { r as reactExports, j as jsxRuntimeExports, $ as useComposedRefs, G as Check, i as cn, m as motion, a0 as Search, A as AnimatePresence, P as Package, l as Badge, o as ue, a1 as Skeleton, a2 as Layers, X, a3 as ref, a4 as storage, a5 as uploadBytes, a6 as getDownloadURL } from "./index-O-oxzsBJ.js";
import { A as AdminLayout } from "./AdminLayout-DnmFTD6u.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction, D as Dialog, h as DialogContent, i as DialogHeader, j as DialogTitle } from "./dialog-Doq3vSOq.js";
import { P as Primitive, u as useControllableState, c as composeEventHandlers, a as createContextScope } from "./index-IUus9vKR.js";
import { u as usePrevious, a as useSize } from "./index-DszSdnxd.js";
import { P as Presence } from "./index-Cu6viimg.js";
import { I as Input } from "./input-CA2Kh0PP.js";
import { L as Label } from "./label-CaWhKRKy.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-D6lSXJPm.js";
import { S as Switch } from "./switch-zaxM8ZEj.js";
import { T as Textarea } from "./textarea-1JrWIcUD.js";
import { a as subscribeToProducts, b as subscribeToCategories, d as deleteProduct, u as updateProduct, c as addProduct } from "./adminService-CrzWrGgp.js";
import { u as useForm } from "./index.esm-BlSMmrQ4.js";
import { P as Plus } from "./plus-DaZED7tD.js";
import { P as Pencil } from "./pencil-B8gfMpCg.js";
import { T as Trash2 } from "./trash-2-CTLSMskq.js";
import { L as LoaderCircle } from "./loader-circle-DqdZu0w_.js";
import { I as ImagePlus } from "./image-plus-DKdodqpC.js";
import "./external-link-0xBpMtII.js";
import "./ticket-DhyR_LGt.js";
import "./index-CSV6Uy9i.js";
import "./chevron-up-Id0BodQe.js";
import "./index-ljXxS_F9.js";
var CHECKBOX_NAME = "Checkbox";
var [createCheckboxContext] = createContextScope(CHECKBOX_NAME);
var [CheckboxProviderImpl, useCheckboxContext] = createCheckboxContext(CHECKBOX_NAME);
function CheckboxProvider(props) {
  const {
    __scopeCheckbox,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = "on",
    // @ts-expect-error
    internal_do_not_use_render
  } = props;
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: CHECKBOX_NAME
  });
  const [control, setControl] = reactExports.useState(null);
  const [bubbleInput, setBubbleInput] = reactExports.useState(null);
  const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
  const isFormControl = control ? !!form || !!control.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    true
  );
  const context = {
    checked,
    disabled,
    setChecked,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
    required,
    defaultChecked: isIndeterminate(defaultChecked) ? false : defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CheckboxProviderImpl,
    {
      scope: __scopeCheckbox,
      ...context,
      children: isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children
    }
  );
}
var TRIGGER_NAME = "CheckboxTrigger";
var CheckboxTrigger = reactExports.forwardRef(
  ({ __scopeCheckbox, onKeyDown, onClick, ...checkboxProps }, forwardedRef) => {
    const {
      control,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput
    } = useCheckboxContext(TRIGGER_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setControl);
    const initialCheckedStateRef = reactExports.useRef(checked);
    reactExports.useEffect(() => {
      const form = control == null ? void 0 : control.form;
      if (form) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        form.addEventListener("reset", reset);
        return () => form.removeEventListener("reset", reset);
      }
    }, [control, setChecked]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        "aria-required": required,
        "data-state": getState(checked),
        "data-disabled": disabled ? "" : void 0,
        disabled,
        value,
        ...checkboxProps,
        ref: composedRefs,
        onKeyDown: composeEventHandlers(onKeyDown, (event) => {
          if (event.key === "Enter") event.preventDefault();
        }),
        onClick: composeEventHandlers(onClick, (event) => {
          setChecked((prevChecked) => isIndeterminate(prevChecked) ? true : !prevChecked);
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })
      }
    );
  }
);
CheckboxTrigger.displayName = TRIGGER_NAME;
var Checkbox$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeCheckbox,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...checkboxProps
    } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CheckboxProvider,
      {
        __scopeCheckbox,
        checked,
        defaultChecked,
        disabled,
        required,
        onCheckedChange,
        name,
        form,
        value,
        internal_do_not_use_render: ({ isFormControl }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxTrigger,
            {
              ...checkboxProps,
              ref: forwardedRef,
              __scopeCheckbox
            }
          ),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CheckboxBubbleInput,
            {
              __scopeCheckbox
            }
          )
        ] })
      }
    );
  }
);
Checkbox$1.displayName = CHECKBOX_NAME;
var INDICATOR_NAME = "CheckboxIndicator";
var CheckboxIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeCheckbox, forceMount, ...indicatorProps } = props;
    const context = useCheckboxContext(INDICATOR_NAME, __scopeCheckbox);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(context.checked) || context.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            "data-state": getState(context.checked),
            "data-disabled": context.disabled ? "" : void 0,
            ...indicatorProps,
            ref: forwardedRef,
            style: { pointerEvents: "none", ...props.style }
          }
        )
      }
    );
  }
);
CheckboxIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "CheckboxBubbleInput";
var CheckboxBubbleInput = reactExports.forwardRef(
  ({ __scopeCheckbox, ...props }, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput
    } = useCheckboxContext(BUBBLE_INPUT_NAME, __scopeCheckbox);
    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        input.indeterminate = isIndeterminate(checked);
        setChecked.call(input, isIndeterminate(checked) ? false : checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);
    const defaultCheckedRef = reactExports.useRef(isIndeterminate(checked) ? false : checked);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: defaultChecked ?? defaultCheckedRef.current,
        required,
        disabled,
        name,
        value,
        form,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
CheckboxBubbleInput.displayName = BUBBLE_INPUT_NAME;
function isFunction(value) {
  return typeof value === "function";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Checkbox$1,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CheckboxIndicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}
function ImageUploadZone({
  images,
  onAdd,
  onRemove
}) {
  const inputRef = reactExports.useRef(null);
  const [dragging, setDragging] = reactExports.useState(false);
  function handleFiles(files) {
    if (!files) return;
    const remaining = 5 - images.length;
    const accepted = [];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        ue.error(`${file.name}: only JPEG, PNG, or WebP allowed`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        ue.error(`${file.name} exceeds 5 MB limit`);
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length > 0) onAdd(accepted);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "aria-label": "Upload product images",
        disabled: images.length >= 5,
        onDragOver: (e) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: (e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        },
        onClick: () => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.click();
        },
        "data-ocid": "product-image-upload-zone",
        className: "relative w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-200 h-28 text-sm select-none outline-none focus-visible:ring-2",
        style: {
          borderColor: dragging ? "oklch(0.71 0.17 48 / 0.7)" : "oklch(0.30 0.05 243 / 0.6)",
          background: dragging ? "oklch(0.71 0.17 48 / 0.05)" : "oklch(0.14 0.03 243 / 0.4)",
          boxShadow: dragging ? "0 0 18px oklch(0.71 0.17 48 / 0.15)" : "none",
          opacity: images.length >= 5 ? 0.4 : 1,
          cursor: images.length >= 5 ? "not-allowed" : "pointer"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { size: 22, style: { color: "oklch(0.55 0.08 243)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.60 0.05 243)" }, children: images.length >= 5 ? "Max 5 images reached" : "Click or drag to upload images" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.40 0.04 243)", fontSize: "11px" }, children: "JPEG · PNG · WebP · max 5 MB each" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              type: "file",
              multiple: true,
              accept: "image/jpeg,image/png,image/webp",
              className: "hidden",
              onChange: (e) => handleFiles(e.target.files)
            }
          )
        ]
      }
    ),
    images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2", children: images.map((img) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative group rounded-lg overflow-hidden aspect-square",
        style: { background: "oklch(0.14 0.03 243)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img.preview,
              alt: "",
              className: "w-full h-full object-cover"
            }
          ),
          img.progress > 0 && img.progress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-3/4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-white/20 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full transition-all duration-200",
                style: {
                  width: `${img.progress}%`,
                  background: "linear-gradient(90deg, oklch(0.71 0.17 48), oklch(0.76 0.16 72))"
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white text-center mt-1", children: [
              Math.round(img.progress),
              "%"
            ] })
          ] }) }),
          img.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-red-900/70 text-[10px] text-red-300 p-1 text-center", children: img.error }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                onRemove(img.id);
              },
              "aria-label": "Remove image",
              className: "absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-500",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10, className: "text-white" })
            }
          )
        ]
      },
      img.id
    )) })
  ] });
}
function MultiCategorySelector({
  categories,
  selectedIds,
  onChange
}) {
  function toggle(id) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }
  if (categories.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 py-3 text-center", children: "No categories yet — create categories first" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "rounded-xl overflow-y-auto max-h-44",
      style: {
        background: "oklch(0.13 0.03 243 / 0.6)",
        border: "1px solid oklch(0.26 0.05 243 / 0.5)"
      },
      children: categories.map((cat) => {
        const checked = selectedIds.includes(cat.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: `cat-check-${cat.id}`,
            className: "flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/[0.03] transition-colors border-b last:border-b-0",
            style: { borderColor: "oklch(0.22 0.04 243 / 0.4)" },
            "data-ocid": `category-checkbox-${cat.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  checked,
                  onCheckedChange: () => toggle(cat.id),
                  id: `cat-check-${cat.id}`,
                  className: "border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                cat.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: cat.imageUrl,
                    alt: "",
                    className: "h-5 w-5 rounded object-cover shrink-0"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-5 w-5 rounded shrink-0 flex items-center justify-center",
                    style: { backgroundColor: `${cat.color || "#2E6DA4"}22` },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-2 w-2 rounded-full",
                        style: { backgroundColor: cat.color || "#2E6DA4" }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white/80 truncate", children: cat.name })
              ] }),
              checked && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-orange-400 font-medium shrink-0", children: "Selected" })
            ]
          },
          cat.id
        );
      })
    }
  );
}
function ProductFormModal({
  open,
  onClose,
  editProduct,
  categories
}) {
  const isEdit = !!editProduct;
  const [saving, setSaving] = reactExports.useState(false);
  const [imageUploads, setImageUploads] = reactExports.useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = reactExports.useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      discount: 0,
      tagsRaw: "",
      isActive: true
    }
  });
  const isActive = watch("isActive");
  const tagsRaw = watch("tagsRaw");
  reactExports.useEffect(() => {
    if (open && editProduct) {
      reset({
        name: editProduct.name,
        sku: editProduct.sku,
        description: editProduct.description,
        price: editProduct.price,
        originalPrice: editProduct.originalPrice ?? 0,
        stock: editProduct.stock,
        discount: editProduct.discount ?? 0,
        tagsRaw: (editProduct.tags ?? []).join(", "),
        isActive: editProduct.isActive
      });
      const existingIds = Array.isArray(editProduct.categoryIds) && editProduct.categoryIds.length > 0 ? editProduct.categoryIds : editProduct.categoryId ? [editProduct.categoryId] : [];
      setSelectedCategoryIds(existingIds);
      const existingImages = (editProduct.images ?? []).map(
        (url) => ({
          id: url,
          file: new File([], ""),
          preview: url,
          progress: 100,
          url,
          error: null
        })
      );
      setImageUploads(existingImages);
    } else if (open && !editProduct) {
      reset();
      setSelectedCategoryIds([]);
      setImageUploads([]);
    }
  }, [open, editProduct, reset]);
  function handleAddFiles(files) {
    const newUploads = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      url: null,
      error: null
    }));
    setImageUploads((prev) => [...prev, ...newUploads]);
  }
  function handleRemoveImage(id) {
    setImageUploads((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed == null ? void 0 : removed.preview.startsWith("blob:"))
        URL.revokeObjectURL(removed.preview);
      return prev.filter((img) => img.id !== id);
    });
  }
  async function uploadPendingImages(productId, uploads) {
    const results = [];
    for (const img of uploads) {
      if (img.url && !img.preview.startsWith("blob:")) {
        results.push(img.url);
        continue;
      }
      const storageRef = ref(
        storage,
        `products/${productId}/${Date.now()}_${img.file.name}`
      );
      await uploadBytes(storageRef, img.file);
      const downloadURL = await getDownloadURL(storageRef);
      results.push(downloadURL);
    }
    return results;
  }
  async function onSubmit(values) {
    var _a;
    setSaving(true);
    try {
      const productId = (editProduct == null ? void 0 : editProduct.id) ?? crypto.randomUUID();
      const imageUrls = await uploadPendingImages(productId, imageUploads);
      const tags = values.tagsRaw ? values.tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
      const selectedCategories = categories.filter(
        (c) => selectedCategoryIds.includes(c.id)
      );
      const primaryCategoryId = selectedCategoryIds[0] ?? "";
      const primaryCategoryName = ((_a = selectedCategories[0]) == null ? void 0 : _a.name) ?? "";
      const payload = {
        name: values.name,
        sku: values.sku,
        description: values.description,
        price: Number(values.price),
        originalPrice: Number(values.originalPrice),
        categoryId: primaryCategoryId,
        category: primaryCategoryName,
        categoryIds: selectedCategoryIds,
        stock: Number(values.stock),
        discount: Number(values.discount),
        tags,
        isActive: values.isActive,
        images: imageUrls,
        image: imageUrls[0] ?? "",
        badge: Number(values.discount) > 0 ? `${values.discount}% OFF` : "",
        rating: (editProduct == null ? void 0 : editProduct.rating) ?? 0,
        reviews: (editProduct == null ? void 0 : editProduct.reviews) ?? 0,
        inStock: Number(values.stock) > 0
      };
      if (isEdit && editProduct) {
        await updateProduct(editProduct.id, payload);
        ue.success("Product updated");
      } else {
        await addProduct(payload);
        ue.success("Product added successfully");
      }
      onClose();
    } catch (err) {
      ue.error("Failed to save product. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl",
      style: {
        background: "linear-gradient(180deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
        border: "1px solid oklch(0.25 0.05 243 / 0.5)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DialogHeader,
          {
            className: "px-6 pt-6 pb-4 border-b",
            style: { borderColor: "oklch(0.22 0.05 243 / 0.4)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-display font-bold text-white", children: isEdit ? "Edit Product" : "Add New Product" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSubmit(onSubmit),
            className: "px-6 pb-6 pt-5 space-y-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "Product Name *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      ...register("name", {
                        required: "Required",
                        minLength: { value: 2, message: "Min 2 chars" }
                      }),
                      placeholder: "e.g. Arduino Starter Kit",
                      "data-ocid": "product-form-name",
                      className: "h-10 text-sm",
                      style: {
                        background: "oklch(0.15 0.03 243 / 0.7)",
                        border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                        color: "white"
                      }
                    }
                  ),
                  errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-400", children: errors.name.message })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "SKU *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      ...register("sku", { required: "Required" }),
                      placeholder: "e.g. ARD-STR-001",
                      "data-ocid": "product-form-sku",
                      className: "h-10 text-sm",
                      style: {
                        background: "oklch(0.15 0.03 243 / 0.7)",
                        border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                        color: "white"
                      }
                    }
                  ),
                  errors.sku && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-400", children: errors.sku.message })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "Description *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    ...register("description", { required: "Required" }),
                    placeholder: "Describe this product...",
                    rows: 3,
                    "data-ocid": "product-form-description",
                    className: "text-sm resize-none",
                    style: {
                      background: "oklch(0.15 0.03 243 / 0.7)",
                      border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                      color: "white"
                    }
                  }
                ),
                errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-400", children: errors.description.message })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "Price ₹ *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      step: 0.01,
                      ...register("price", { required: "Required", min: 0 }),
                      placeholder: "999",
                      "data-ocid": "product-form-price",
                      className: "h-10 text-sm",
                      style: {
                        background: "oklch(0.15 0.03 243 / 0.7)",
                        border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                        color: "white"
                      }
                    }
                  ),
                  errors.price && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-400", children: errors.price.message })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "Original Price ₹" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      step: 0.01,
                      ...register("originalPrice"),
                      placeholder: "1299",
                      "data-ocid": "product-form-original-price",
                      className: "h-10 text-sm",
                      style: {
                        background: "oklch(0.15 0.03 243 / 0.7)",
                        border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                        color: "white"
                      }
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "Categories" }),
                  selectedCategoryIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-orange-400", children: [
                    selectedCategoryIds.length,
                    " selected"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MultiCategorySelector,
                  {
                    categories,
                    selectedIds: selectedCategoryIds,
                    onChange: setSelectedCategoryIds
                  }
                ),
                selectedCategoryIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 pt-1", children: selectedCategoryIds.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  if (!cat) return null;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                      style: {
                        background: `${cat.color || "#2E6DA4"}22`,
                        color: cat.color || "#2E6DA4",
                        border: `1px solid ${cat.color || "#2E6DA4"}44`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 9 }),
                        cat.name
                      ]
                    },
                    id
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "Stock *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      ...register("stock", { required: "Required", min: 0 }),
                      placeholder: "50",
                      "data-ocid": "product-form-stock",
                      className: "h-10 text-sm",
                      style: {
                        background: "oklch(0.15 0.03 243 / 0.7)",
                        border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                        color: "white"
                      }
                    }
                  ),
                  errors.stock && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-red-400", children: errors.stock.message })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "Discount %" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 0,
                      max: 100,
                      ...register("discount", { min: 0, max: 100 }),
                      placeholder: "0",
                      "data-ocid": "product-form-discount",
                      className: "h-10 text-sm",
                      style: {
                        background: "oklch(0.15 0.03 243 / 0.7)",
                        border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                        color: "white"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: "Tags" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      ...register("tagsRaw"),
                      placeholder: "arduino, beginner, stem",
                      "data-ocid": "product-form-tags",
                      className: "h-10 text-sm",
                      style: {
                        background: "oklch(0.15 0.03 243 / 0.7)",
                        border: "1px solid oklch(0.28 0.05 243 / 0.6)",
                        color: "white"
                      }
                    }
                  )
                ] })
              ] }),
              tagsRaw && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: tagsRaw.split(",").filter((t) => t.trim()).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-2 py-0.5 rounded-full text-xs font-medium",
                  style: {
                    background: "oklch(0.45 0.12 243 / 0.2)",
                    color: "oklch(0.75 0.10 195)",
                    border: "1px solid oklch(0.45 0.12 243 / 0.3)"
                  },
                  children: tag.trim()
                },
                tag.trim()
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 p-3 rounded-xl",
                  style: {
                    background: "oklch(0.14 0.03 243 / 0.5)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.4)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        id: "is-active",
                        checked: isActive,
                        onCheckedChange: (v) => setValue("isActive", v),
                        "data-ocid": "product-form-active-toggle"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "is-active",
                        className: "text-sm text-white/70 cursor-pointer",
                        children: [
                          "Product is",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-semibold",
                              style: {
                                color: isActive ? "oklch(0.75 0.18 142)" : "oklch(0.55 0.05 243)"
                              },
                              children: isActive ? "Active" : "Inactive"
                            }
                          )
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-white/60 uppercase tracking-widest", children: [
                  "Product Images",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case text-white/30 font-normal", children: "(up to 5)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ImageUploadZone,
                  {
                    images: imageUploads,
                    onAdd: handleAddFiles,
                    onRemove: handleRemoveImage
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "submit",
                  disabled: saving,
                  "data-ocid": "product-form-submit",
                  className: "w-full h-11 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 disabled:opacity-60 mt-2",
                  style: {
                    background: "linear-gradient(135deg, oklch(0.71 0.17 48) 0%, oklch(0.76 0.16 72) 100%)",
                    boxShadow: saving ? "none" : "0 0 18px oklch(0.71 0.17 48 / 0.35)"
                  },
                  children: [
                    saving && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }),
                    saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  ) });
}
const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5"];
function ProductSkeletonRows() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: SKELETON_IDS.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: ["10w-10", "36", "24", "28", "16", "12", "16-full", "16"].map(
    (w, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: `h-${j === 0 ? "10 w-10" : `4 w-${w}`} rounded${w.includes("full") ? "-full" : ""}`,
        style: { background: "oklch(0.20 0.04 243 / 0.5)" }
      }
    ) }, w)
  ) }, id)) });
}
function AdminProductsPage() {
  const [products, setProducts] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("all");
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const unsub = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    const unsub = subscribeToCategories(setCategories);
    return unsub;
  }, []);
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? "").toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (categoryFilter === "all") return true;
    const ids = Array.isArray(p.categoryIds) && p.categoryIds.length > 0 ? p.categoryIds : p.categoryId ? [p.categoryId] : [];
    return ids.includes(categoryFilter);
  });
  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }
  function openEdit(product) {
    setEditTarget(product);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      ue.success("Product deleted");
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete product. Please try again.");
    } finally {
      setDeleting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        className: "space-y-6",
        "data-ocid": "admin-products-page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-white", children: "Products" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "mt-0.5 text-sm",
                  style: { color: "oklch(0.55 0.04 243)" },
                  children: loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""} total`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: openAdd,
                "data-ocid": "add-product-btn",
                className: "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shrink-0",
                style: {
                  background: "linear-gradient(135deg, oklch(0.71 0.17 48) 0%, oklch(0.76 0.16 72) 100%)",
                  boxShadow: "0 0 18px oklch(0.71 0.17 48 / 0.3)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                  "Add Product"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Search,
                {
                  size: 14,
                  className: "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none",
                  style: { color: "oklch(0.50 0.05 243)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Search by name or SKU...",
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  "data-ocid": "product-search",
                  className: "w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none transition-all duration-200",
                  style: {
                    background: "oklch(0.14 0.03 243 / 0.8)",
                    border: "1px solid oklch(0.26 0.05 243 / 0.5)",
                    color: "white"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  "data-ocid": "product-category-filter",
                  className: "h-10 w-full sm:w-48 text-sm",
                  style: {
                    background: "oklch(0.14 0.03 243 / 0.8)",
                    border: "1px solid oklch(0.26 0.05 243 / 0.5)",
                    color: "white"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All categories" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                SelectContent,
                {
                  style: {
                    background: "oklch(0.14 0.04 243)",
                    border: "1px solid oklch(0.25 0.05 243 / 0.5)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "text-white/80", children: "All Categories" }),
                    categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectItem,
                      {
                        value: cat.id,
                        className: "text-white/80",
                        children: cat.name
                      },
                      cat.id
                    ))
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-2xl overflow-hidden",
              style: {
                background: "oklch(0.12 0.04 243 / 0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid oklch(0.22 0.05 243 / 0.4)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "tr",
                    {
                      style: {
                        borderBottom: "1px solid oklch(0.22 0.05 243 / 0.4)"
                      },
                      children: [
                        "Image",
                        "Name",
                        "SKU",
                        "Categories",
                        "Price",
                        "Stock",
                        "Status",
                        "Actions"
                      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "th",
                        {
                          className: "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest",
                          style: { color: "oklch(0.48 0.05 243)" },
                          children: h
                        },
                        h
                      ))
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductSkeletonRows, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: filtered.map((product, i) => {
                    const productCatIds = Array.isArray(product.categoryIds) && product.categoryIds.length > 0 ? product.categoryIds : product.categoryId ? [product.categoryId] : [];
                    const productCats = productCatIds.map((id) => categories.find((c) => c.id === id)).filter(Boolean);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.tr,
                      {
                        initial: { opacity: 0, y: 8 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0 },
                        transition: { delay: i * 0.04, duration: 0.25 },
                        className: "group transition-all duration-150",
                        style: {
                          borderBottom: "1px solid oklch(0.18 0.04 243 / 0.5)"
                        },
                        onMouseEnter: (e) => {
                          e.currentTarget.style.background = "oklch(0.16 0.04 243 / 0.4)";
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.style.background = "";
                        },
                        "data-ocid": `product-row-${product.id}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0",
                              style: {
                                background: "oklch(0.18 0.04 243 / 0.6)"
                              },
                              children: product.image ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "img",
                                {
                                  src: product.image,
                                  alt: product.name,
                                  className: "w-full h-full object-cover"
                                }
                              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Package,
                                {
                                  size: 16,
                                  style: { color: "oklch(0.45 0.06 243)" }
                                }
                              )
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-white truncate", children: product.name }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xs font-mono",
                              style: { color: "oklch(0.65 0.08 195)" },
                              children: product.sku || "—"
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 max-w-[160px]", children: productCats.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                            productCats.slice(0, 2).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium truncate max-w-[80px]",
                                style: {
                                  background: `${cat.color || "#2E6DA4"}22`,
                                  color: cat.color || "#2E6DA4",
                                  border: `1px solid ${cat.color || "#2E6DA4"}44`
                                },
                                children: cat.name
                              },
                              cat.id
                            )),
                            productCats.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px]",
                                style: { color: "oklch(0.55 0.05 243)" },
                                children: [
                                  "+",
                                  productCats.length - 2
                                ]
                              }
                            )
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.45 0.04 243)" }, children: "—" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-white", children: [
                              "₹",
                              product.price.toLocaleString()
                            ] }),
                            product.originalPrice > product.price && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "ml-1.5 text-xs line-through",
                                style: { color: "oklch(0.50 0.04 243)" },
                                children: [
                                  "₹",
                                  product.originalPrice.toLocaleString()
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "text-xs font-semibold",
                              style: {
                                color: product.stock > 10 ? "oklch(0.75 0.18 142)" : product.stock > 0 ? "oklch(0.76 0.16 72)" : "oklch(0.60 0.22 25)"
                              },
                              children: product.stock
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: product.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              "data-ocid": `product-status-active-${product.id}`,
                              className: "text-[10px] font-semibold px-2 py-0.5 rounded-full border-0",
                              style: {
                                background: "oklch(0.25 0.08 142 / 0.3)",
                                color: "oklch(0.75 0.18 142)",
                                border: "1px solid oklch(0.50 0.14 142 / 0.3)"
                              },
                              children: "Active"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              "data-ocid": `product-status-inactive-${product.id}`,
                              className: "text-[10px] font-semibold px-2 py-0.5 rounded-full border-0",
                              style: {
                                background: "oklch(0.22 0.03 243 / 0.5)",
                                color: "oklch(0.50 0.04 243)",
                                border: "1px solid oklch(0.30 0.04 243 / 0.4)"
                              },
                              children: "Inactive"
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => openEdit(product),
                                "data-ocid": `product-edit-${product.id}`,
                                className: "p-2 rounded-lg transition-all duration-150 hover:bg-blue-500/15 hover:text-blue-400",
                                style: { color: "oklch(0.55 0.06 243)" },
                                "aria-label": `Edit ${product.name}`,
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                onClick: () => setDeleteTarget(product),
                                "data-ocid": `product-delete-${product.id}`,
                                className: "p-2 rounded-lg transition-all duration-150 hover:bg-red-500/15 hover:text-red-400",
                                style: { color: "oklch(0.55 0.06 243)" },
                                "aria-label": `Delete ${product.name}`,
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                              }
                            )
                          ] }) })
                        ]
                      },
                      product.id
                    );
                  }) }) })
                ] }) }),
                !loading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.96 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { duration: 0.3 },
                    className: "py-20 flex flex-col items-center justify-center gap-4",
                    "data-ocid": "products-empty-state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-16 h-16 rounded-2xl flex items-center justify-center",
                          style: {
                            background: "oklch(0.16 0.04 243 / 0.5)",
                            border: "1px solid oklch(0.25 0.05 243 / 0.4)"
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { size: 28, style: { color: "oklch(0.50 0.08 243)" } })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-white", children: search || categoryFilter !== "all" ? "No matching products" : "No products yet" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "p",
                          {
                            className: "text-sm",
                            style: { color: "oklch(0.50 0.04 243)" },
                            children: search || categoryFilter !== "all" ? "Try a different search or filter" : "Add your first product to get started."
                          }
                        )
                      ] }),
                      !search && categoryFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          type: "button",
                          onClick: openAdd,
                          "data-ocid": "empty-add-product-btn",
                          className: "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 mt-2",
                          style: {
                            background: "linear-gradient(135deg, oklch(0.71 0.17 48) 0%, oklch(0.76 0.16 72) 100%)",
                            boxShadow: "0 0 16px oklch(0.71 0.17 48 / 0.25)"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                            "Add Product"
                          ]
                        }
                      )
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormModal,
      {
        open: modalOpen,
        onClose: closeModal,
        editProduct: editTarget,
        categories
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (v) => !v && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          AlertDialogContent,
          {
            style: {
              background: "linear-gradient(180deg, oklch(0.12 0.04 243) 0%, oklch(0.10 0.03 250) 100%)",
              border: "1px solid oklch(0.25 0.05 243 / 0.5)",
              color: "white"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-white", children: "Delete Product?" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { style: { color: "oklch(0.60 0.04 243)" }, children: [
                  "Are you sure you want to delete",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-white", children: deleteTarget == null ? void 0 : deleteTarget.name }),
                  "? This action cannot be undone."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogCancel,
                  {
                    "data-ocid": "delete-cancel-btn",
                    style: {
                      background: "oklch(0.18 0.04 243 / 0.6)",
                      border: "1px solid oklch(0.28 0.05 243 / 0.5)",
                      color: "white"
                    },
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  AlertDialogAction,
                  {
                    onClick: handleDelete,
                    disabled: deleting,
                    "data-ocid": "delete-confirm-btn",
                    className: "flex items-center gap-2",
                    style: {
                      background: "oklch(0.45 0.22 25)",
                      color: "white",
                      border: "none"
                    },
                    children: [
                      deleting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
                      "Delete Product"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  AdminProductsPage as default
};
