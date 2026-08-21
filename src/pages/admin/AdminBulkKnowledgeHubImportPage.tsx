import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  BLOG_TARGET_FIELDS,
  downloadImportReport,
  getAutoColumnMapping,
  parseBulkImportFile,
  readImportHistory,
  runBulkKnowledgeHubImport,
  saveImportHistory,
  validateBlogImportRows,
  type BlogImportOptions,
  type ImportColumnMapping,
  type ImportReport,
  type ParsedImportFile,
  type ImportValidationResult,
} from "@/lib/bulkProductImport";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Play, ShieldCheck, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { useToastContext } from "@/components/Layout";
import type { AdminBlogPost } from "@/types/admin";

const initialOptions: BlogImportOptions = {
  createNewArticles: true,
  updateExistingArticles: true,
  dryRun: true,
};

function formatValue(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function AdminBulkKnowledgeHubImportPage() {
  const { adminUser } = useAdminAuth();
  const [parsedFile, setParsedFile] = useState<ParsedImportFile | null>(null);
  const [mapping, setMapping] = useState<ImportColumnMapping>({});
  const [options, setOptions] = useState<BlogImportOptions>(initialOptions);
  const [validationSummary, setValidationSummary] = useState<null | {
    rowsToCreate: number;
    rowsToUpdate: number;
    rowsToSkip: number;
    errors: number;
    warnings: number;
  }>(null);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Upload an .xlsx, .xls, or .csv file to begin.");
  const [history, setHistory] = useState<ImportReport[]>(() => readImportHistory());

  const previewRows = useMemo(() => parsedFile?.rows.slice(0, 20) ?? [], [parsedFile]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !["xlsx", "xls", "csv"].includes(extension)) {
      setMessage("Please upload a supported .xlsx, .xls, or .csv file.");
      return;
    }

    setIsProcessing(true);
    setMessage(`Reading ${file.name}...`);

    try {
      const parsed = await parseBulkImportFile(file);
      setParsedFile(parsed);
      setMapping(getAutoColumnMapping(parsed.headers, "knowledgeHub"));
      setValidationSummary(null);
      setReport(null);
      setMessage(`Preview ready for ${parsed.rows.length} rows from ${parsed.sheetName}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to read the file.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleValidate() {
    if (!parsedFile) return;

    const { addToast } = useToastContext();
    addToast("Running Dry Run...", "info");

    setIsProcessing(true);
    setMessage("Validating rows against Knowledge Hub articles...");

    try {
      const blogsSnap = await getDocs(collection(db, "blogs"));
      const existingArticles = blogsSnap.docs.map((document) => {
        const rawArticle = document.data() as Omit<AdminBlogPost, "id">;
        return { id: document.id, ...rawArticle } as AdminBlogPost & { id: string };
      });

      const result = await validateBlogImportRows({
        rows: parsedFile.rows,
        mapping,
        options,
        existingArticles,
      });

      setValidationSummary(result.summary);
      setMessage(`Validation complete. ${result.summary.rowsToCreate} create, ${result.summary.rowsToUpdate} update, ${result.summary.rowsToSkip} skip.`);
      addToast("Dry Run completed successfully.", result.summary.errors || result.summary.warnings ? "info" : "success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Validation failed.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleImport() {
    if (!parsedFile) return;

    const { addToast } = useToastContext();
    addToast(options.dryRun ? "Running Dry Run..." : "Import started...", "info");

    setIsProcessing(true);
    setProgress(0);
    setMessage(options.dryRun ? "Running dry run without writes..." : "Importing articles into Knowledge Hub...");

    try {
      const result = await runBulkKnowledgeHubImport({
        rows: parsedFile.rows,
        mapping,
        options,
        adminEmail: adminUser?.email || "unknown-admin",
        onProgress: (percent, text) => {
          setProgress(percent);
          setMessage(text);
        },
      });

      setReport(result.report);
      if (!options.dryRun) {
        saveImportHistory(result.report);
        setHistory(readImportHistory());
      }
      setValidationSummary(result.validation.summary);
      setMessage(options.dryRun ? "Dry run completed. No Firestore writes were made." : "Import completed successfully.");
      if (result.report.rowsImported === 0) {
        addToast("No changes detected.", "info");
      } else if (result.report.failed || (result.report.warnings && result.report.warnings.length > 0)) {
        addToast(options.dryRun ? "Dry Run completed with warnings." : "Import completed with warnings.", "info");
      } else {
        addToast(options.dryRun ? "Dry Run completed successfully." : "Import completed successfully.", "success");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
      useToastContext().addToast("Import failed.", "error");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleOptionChange(field: keyof BlogImportOptions, value: boolean) {
    setOptions((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleMappingChange(field: string, header: string) {
    setMapping((current) => ({
      ...current,
      [field]: header || null,
    }));
  }

  return (
    <AdminLayout>
      <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg, #090f1e 0%, #101b38 100%)" }}>
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-3xl border border-white/10 p-6 shadow-2xl" style={{ background: "oklch(0.12 0.03 243 / 0.85)" }}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-400">Admin Workspace</p>
                <h1 className="mt-2 text-3xl font-black text-white">Bulk Knowledge Hub Import</h1>
                <p className="mt-2 max-w-2xl text-sm text-white/60">
                  Import Knowledge Hub articles from Excel or CSV with automatic field mapping, validation, dry-run support, and import history.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 font-semibold text-white">
                  <ShieldCheck size={16} className="text-orange-400" />
                  Preserves existing content and updates timestamps automatically
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-white/10 p-6" style={{ background: "oklch(0.12 0.03 243 / 0.85)" }}>
              <div className="flex items-center gap-3">
                <UploadCloud className="text-orange-400" />
                <h2 className="text-xl font-semibold text-white">1. Upload File</h2>
              </div>
              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center transition hover:border-orange-400/70" style={{ background: "rgba(255,255,255,0.04)" }}>
                <FileSpreadsheet size={36} className="text-orange-400" />
                <span className="mt-3 text-sm font-semibold text-white">Choose Excel or CSV file</span>
                <span className="mt-1 text-xs text-white/50">Supports .xlsx, .xls, and .csv</span>
                <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
              </label>

              <div className="mt-4 rounded-2xl border border-white/10 p-4 text-sm text-white/70" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 text-white">
                  <AlertCircle size={15} className="text-orange-400" />
                  <span>{message}</span>
                </div>
              </div>

              {parsedFile && (
                <>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">File</p>
                      <p className="mt-1 font-semibold text-white">{parsedFile.sourceFileName}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Sheet</p>
                      <p className="mt-1 font-semibold text-white">{parsedFile.sheetName}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Rows</p>
                      <p className="mt-1 font-semibold text-white">{parsedFile.rows.length}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">2. Map Columns</h3>
                      <span className="text-xs uppercase tracking-[0.2em] text-white/45">Auto-detected</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {BLOG_TARGET_FIELDS.map((field) => (
                        <div key={field} className="flex flex-col gap-2 rounded-xl border border-white/10 p-3 md:flex-row md:items-center md:justify-between">
                          <label className="text-sm font-medium text-white/80">{field}</label>
                          <select
                            value={mapping[field] ?? ""}
                            onChange={(event) => handleMappingChange(field, event.target.value)}
                            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                          >
                            <option value="">-- skip --</option>
                            {parsedFile.headers.map((header) => (
                              <option key={header} value={header}>
                                {header}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 p-6" style={{ background: "oklch(0.12 0.03 243 / 0.85)" }}>
                <div className="flex items-center gap-3">
                  <Play className="text-orange-400" />
                  <h2 className="text-xl font-semibold text-white">3. Import Options</h2>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {[
                    ["createNewArticles", "Create New Articles"],
                    ["updateExistingArticles", "Update Existing Articles"],
                    ["dryRun", "Dry Run Before Import"],
                  ].map(([key, label]) => {
                    const typedKey = key as keyof BlogImportOptions;
                    return (
                      <label key={key} className="flex items-center gap-2 rounded-xl border border-white/10 p-3 text-sm text-white/70" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <input
                          type="checkbox"
                          checked={Boolean(options[typedKey])}
                          onChange={(event) => handleOptionChange(typedKey, event.target.checked)}
                          className="rounded border-white/10 bg-transparent"
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleValidate}
                    disabled={!parsedFile || isProcessing}
                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ background: "oklch(0.18 0.04 243 / 0.9)" }}
                  >
                    Validate
                  </button>
                  <button
                    type="button"
                    onClick={handleImport}
                    disabled={!parsedFile || isProcessing}
                    className="rounded-xl border border-orange-500/40 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ background: "oklch(0.71 0.17 48 / 0.8)" }}
                  >
                    {options.dryRun ? "Run Dry Run" : "Import Articles"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 p-6" style={{ background: "oklch(0.12 0.03 243 / 0.85)" }}>
                <h2 className="text-xl font-semibold text-white">Validation Summary</h2>
                {validationSummary ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Create</p>
                      <p className="mt-1 text-2xl font-bold text-white">{validationSummary.rowsToCreate}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Update</p>
                      <p className="mt-1 text-2xl font-bold text-white">{validationSummary.rowsToUpdate}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Skip</p>
                      <p className="mt-1 text-2xl font-bold text-white">{validationSummary.rowsToSkip}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">Warnings / Errors</p>
                      <p className="mt-1 text-2xl font-bold text-white">{validationSummary.warnings} / {validationSummary.errors}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/55">Run validation to see how many articles will be created, updated, or skipped.</p>
                )}
              </div>
            </section>
          </div>

          {isProcessing && (
            <div className="rounded-3xl border border-white/10 p-6" style={{ background: "oklch(0.12 0.03 243 / 0.85)" }}>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-orange-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {report && (
            <div className="rounded-3xl border border-white/10 p-6" style={{ background: "oklch(0.12 0.03 243 / 0.85)" }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Import Report</h2>
                  <p className="mt-1 text-sm text-white/55">Created: {report.created} • Updated: {report.updated} • Skipped: {report.skipped} • Failed: {report.failed}</p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadImportReport(report)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <Download size={16} />
                  Download Report
                </button>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Created</p>
                  <p className="mt-1 text-2xl font-bold text-white">{report.created}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Updated</p>
                  <p className="mt-1 text-2xl font-bold text-white">{report.updated}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Skipped</p>
                  <p className="mt-1 text-2xl font-bold text-white">{report.skipped}</p>
                </div>
                <div className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Duration</p>
                  <p className="mt-1 text-2xl font-bold text-white">{Math.round(report.durationMs / 1000)}s</p>
                </div>
              </div>
            </div>
          )}

          {parsedFile && (
            <div className="rounded-3xl border border-white/10 p-6" style={{ background: "oklch(0.12 0.03 243 / 0.85)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Preview First 20 Rows</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-white/45">Live preview</span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-sm text-white/70">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-white/45">#</th>
                      {parsedFile.headers.map((header) => (
                        <th key={header} className="px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-white/45">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, index) => (
                      <tr key={`${index}-${row[parsedFile.headers[0] ?? ""]}`} style={{ background: "rgba(255,255,255,0.04)" }}>
                        <td className="rounded-l-xl px-3 py-2 text-white">{index + 1}</td>
                        {parsedFile.headers.map((header) => (
                          <td key={`${header}-${index}`} className="px-3 py-2 text-white/70">
                            {formatValue(row[header])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-white/10 p-6" style={{ background: "oklch(0.12 0.03 243 / 0.85)" }}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-orange-400" />
              <h2 className="text-xl font-semibold text-white">Recent Import History</h2>
            </div>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-white/55">No import runs saved yet. Imports will appear here after a successful run.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {history.map((item, index) => (
                  <div key={`${item.importDate}-${index}`} className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{item.adminEmail}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/45">{new Date(item.importDate).toLocaleString()}</p>
                    </div>
                    <p className="mt-2 text-sm text-white/60">
                      Created {item.created}, Updated {item.updated}, Skipped {item.skipped}, Failed {item.failed}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminBulkKnowledgeHubImportPage;
