import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Order } from "@/types";

const LOGO_URL = "/assets/brand/logo.png";
const BRAND_NAME = "TINKRO";

const COMPANY_INFO = {
  name: "TINKRO",
  address1: "1408/4 Nanda Nagar, Indore",
  address2: "Indore, Madhya Pradesh - 452010",
  email: "hello@tinkro.in",
  phone: "+91-9644525429",
  gst: "23BNYPG2236A1ZB",
};

const GST_RATE = 0.18;

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function formatCurrency(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function amountInWords(amount: number) {
  const num = Math.round(amount);
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const toWords = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return `${tens[Math.floor(n / 10)]}${n % 10 ? " " + ones[n % 10] : ""}`;
    if (n < 1000)
      return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? " " + toWords(n % 100) : ""}`;
    if (n < 100000)
      return `${toWords(Math.floor(n / 1000))} Thousand${n % 1000 ? " " + toWords(n % 1000) : ""}`;
    if (n < 10000000)
      return `${toWords(Math.floor(n / 100000))} Lakh${n % 100000 ? " " + toWords(n % 100000) : ""}`;
    return `${toWords(Math.floor(n / 10000000))} Crore${n % 10000000 ? " " + toWords(n % 10000000) : ""}`;
  };

  return `${toWords(num)} Rupees Only`;
}

export async function generateInvoicePdf(order: Order) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const logoData = await fetchAsDataUrl(LOGO_URL);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 40;
  let cursorY = 30;

  // Page border
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(1.5);
  doc.rect(18, 18, pageWidth - 36, pageHeight - 36);
  doc.setLineWidth(1);

  // Logo on white background
  if (logoData) {
    doc.addImage(logoData, "PNG", marginX, cursorY, 72, 42);
  }

  // Navy strip only under TAX INVOICE
  const stripY = cursorY + 46;
  doc.setFillColor(18, 24, 38);
  doc.roundedRect(marginX, stripY, pageWidth - marginX * 2, 30, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("TAX INVOICE", pageWidth / 2, stripY + 20, { align: "center" });
  doc.setTextColor(0, 0, 0);

  cursorY = stripY + 40;

  const orderSuffix = order.id ? order.id.slice(-6).toUpperCase() : "XXXXXX";
  const dateKey = new Date(order.createdAt).toISOString().slice(0, 10).replace(/-/g, "");
  const invoiceId = order.invoiceNumber || `TKR-${dateKey}-${orderSuffix}`;
  const orderId = `TKR-${dateKey}${orderSuffix}`;

  // Boxes grid
  const boxGap = 20;
  const boxWidth = (pageWidth - marginX * 2 - boxGap) / 2;
  const boxTitleHeight = 16;
  const boxPadding = 12;

  const fromY = cursorY + 32;
  doc.setFontSize(9);

  const drawBoxTitle = (x: number, y: number, title: string) => {
    doc.setFillColor(245, 245, 245);
    doc.rect(x, y, boxWidth, boxTitleHeight, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(title, x + 8, y + 12);
  };

  const drawBoxBorder = (x: number, y: number, height: number) => {
    doc.setDrawColor(230, 230, 230);
    doc.rect(x, y, boxWidth, height);
  };

  // FROM (brand name only)
  drawBoxTitle(marginX, fromY, "TINKRO");
  drawBoxBorder(marginX, fromY, 104);
  doc.setFont("helvetica", "normal");
  doc.text(COMPANY_INFO.address1, marginX + boxPadding, fromY + 30);
  doc.text(COMPANY_INFO.address2, marginX + boxPadding, fromY + 44);
  doc.text(`Email: ${COMPANY_INFO.email}`, marginX + boxPadding, fromY + 58);
  doc.text(`Phone: ${COMPANY_INFO.phone}`, marginX + boxPadding, fromY + 72);
  doc.text(`GST: ${COMPANY_INFO.gst}`, marginX + boxPadding, fromY + 86);

  // INVOICE DETAILS
  const detailsX = marginX + boxWidth + boxGap;
  drawBoxTitle(detailsX, fromY, "INVOICE DETAILS");
  drawBoxBorder(detailsX, fromY, 104);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoiceId}`, detailsX + boxPadding, fromY + 30);
  doc.text(`Order ID: ${orderId}`, detailsX + boxPadding, fromY + 44);
  doc.text(`Date: ${formatDate(order.createdAt)}`, detailsX + boxPadding, fromY + 58);
  doc.text(`Payment ID: ${order.razorpayPaymentId || "—"}`, detailsX + boxPadding, fromY + 72);
  doc.text(`Status: COMPLETED`, detailsX + boxPadding, fromY + 86);

  // Bill to + Ship to
  const addressY = fromY + 120;
  drawBoxTitle(marginX, addressY, "BILL TO");
  drawBoxBorder(marginX, addressY, 92);

  const shipX = marginX + boxWidth + boxGap;
  drawBoxTitle(shipX, addressY, "SHIP TO");
  drawBoxBorder(shipX, addressY, 92);

  const customerName = order.customerName || order.address?.name || "Customer";
  const customerEmail = order.customerEmail || "";
  const addressLine = order.address
    ? `${order.address.line1}${order.address.line2 ? ", " + order.address.line2 : ""}`
    : "";
  const cityLine = order.address
    ? `${order.address.city}, ${order.address.state} ${order.address.pincode}`
    : "";
  const phoneLine = order.address?.phone ? `Phone: ${order.address.phone}` : "";

  doc.setFont("helvetica", "normal");
  doc.text(customerName, marginX + boxPadding, addressY + 30);
  if (addressLine) doc.text(addressLine, marginX + boxPadding, addressY + 44);
  if (cityLine) doc.text(cityLine, marginX + boxPadding, addressY + 58);
  if (customerEmail) doc.text(`Email: ${customerEmail}`, marginX + boxPadding, addressY + 72);
  if (phoneLine) doc.text(phoneLine, marginX + boxPadding, addressY + 86);

  doc.text(customerName, shipX + boxPadding, addressY + 30);
  if (addressLine) doc.text(addressLine, shipX + boxPadding, addressY + 44);
  if (cityLine) doc.text(cityLine, shipX + boxPadding, addressY + 58);

  // Items table
  const tableY = addressY + 104;
  const taxableAmount = Math.max(0, order.subtotal - order.discount);
  const shippingCharge = Number(order.shippingCharge || 0);
  const baseAmount = taxableAmount / (1 + GST_RATE);
  const taxAmount = taxableAmount - baseAmount;

  const rows = order.items.map((item, index) => {
    const lineTotal = item.price * item.quantity;
    const lineBaseTotal = lineTotal / (1 + GST_RATE);
    const unitBasePrice = lineBaseTotal / item.quantity;
    const lineTax = lineTotal - lineBaseTotal;
    return [
      String(index + 1),
      item.name,
      String(item.quantity),
      formatCurrency(unitBasePrice),
      formatCurrency(lineTax),
      formatCurrency(lineTotal),
    ];
  });

  autoTable(doc, {
    startY: tableY,
    head: [["S.No", "Description", "Qty", "Unit Price", "Tax", "Total"]],
    body: rows,
    styles: { fontSize: 9, cellPadding: 6, textColor: [33, 37, 41] },
    headStyles: { fillColor: [246, 115, 22], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [252, 252, 252] },
    columnStyles: {
      0: { cellWidth: 34, halign: "center" },
      2: { cellWidth: 40, halign: "center" },
      3: { cellWidth: 80, halign: "right" },
      4: { cellWidth: 70, halign: "right" },
      5: { cellWidth: 80, halign: "right" },
    },
  });

  const tableEndY = (doc as any).lastAutoTable.finalY || tableY + 120;

  // Totals
  const totalsY = tableEndY + 16;
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal:`, pageWidth - marginX - 120, totalsY, { align: "right" });
  doc.text(formatCurrency(baseAmount), pageWidth - marginX, totalsY, { align: "right" });
  doc.text(`Tax (18%):`, pageWidth - marginX - 120, totalsY + 16, { align: "right" });
  doc.text(formatCurrency(taxAmount), pageWidth - marginX, totalsY + 16, { align: "right" });
  doc.text(`Shipping:`, pageWidth - marginX - 120, totalsY + 32, { align: "right" });
  doc.text(
    shippingCharge > 0 ? formatCurrency(shippingCharge) : "Free",
    pageWidth - marginX,
    totalsY + 32,
    { align: "right" },
  );
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL AMOUNT:`, pageWidth - marginX - 120, totalsY + 54, { align: "right" });
  doc.text(formatCurrency(order.total), pageWidth - marginX, totalsY + 54, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Amount in words: ${amountInWords(order.total)}`,
    pageWidth - marginX,
    totalsY + 74,
    { align: "right" },
  );

  // Footer
  doc.setFont("helvetica", "normal");
  const footerBoxY = totalsY + 92;
  const footerBoxHeight = 64;
  doc.setFillColor(255, 243, 237);
  doc.roundedRect(marginX, footerBoxY, pageWidth - marginX * 2, footerBoxHeight, 6, 6, "F");
  const footerLine1Y = footerBoxY + 16;
  const footerLine2Y = footerBoxY + 32;
  const footerLine3Y = footerBoxY + 48;
  doc.text(
    "Thank you for shopping with Tinkro!",
    pageWidth / 2,
    footerLine1Y,
    { align: "center" },
  );
  doc.text(
    "If you have any questions, contact us at hello@tinkro.in",
    pageWidth / 2,
    footerLine2Y,
    { align: "center" },
  );
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "This is a computer generated invoice and does not require a signature.",
    pageWidth / 2,
    footerLine3Y,
    { align: "center" },
  );

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setTextColor(0, 0, 0);

  doc.setTextColor(0, 0, 0);
  doc.save(`${invoiceId}.pdf`);
}
