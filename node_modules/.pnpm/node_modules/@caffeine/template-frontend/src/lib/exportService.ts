import * as XLSX from "xlsx";

export interface ExportColumn {
  key: string;
  header: string;
}

export function exportToExcel(
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
): void {
  // Map data rows to header-keyed objects using column config
  const rows = data.map((item) => {
    const row: Record<string, unknown> = {};
    for (const col of columns) {
      row[col.header] = item[col.key] ?? "";
    }
    return row;
  });

  // Create worksheet from mapped rows
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: columns.map((c) => c.header),
  });

  // Auto-size columns based on header + data length
  const colWidths = columns.map((col) => {
    const maxDataLen = data.reduce((max, item) => {
      const val = String(item[col.key] ?? "");
      return Math.max(max, val.length);
    }, 0);
    return { wch: Math.max(col.header.length, maxDataLen) + 2 };
  });
  worksheet["!cols"] = colWidths;

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Trigger browser download
  const safeFilename = filename.endsWith(".xlsx")
    ? filename
    : `${filename}.xlsx`;
  XLSX.writeFile(workbook, safeFilename);
}
