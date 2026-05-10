import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { Resend } from "resend";
import PDFDocument from "pdfkit";

initializeApp();
const db = getFirestore();

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const RESEND_FROM_EMAIL = defineSecret("RESEND_FROM_EMAIL");
const ENQUIRY_NOTIFY_EMAIL = defineSecret("ENQUIRY_NOTIFY_EMAIL");
const ORDER_NOTIFY_EMAIL = defineSecret("ORDER_NOTIFY_EMAIL");
const CASHFREE_APP_ID = defineSecret("CASHFREE_APP_ID");
const CASHFREE_SECRET_KEY = defineSecret("CASHFREE_SECRET_KEY");
const CASHFREE_ENV = defineSecret("CASHFREE_ENV");

const DEFAULT_FROM_EMAIL = "hello@tinkro.in";
const DEFAULT_ENQUIRY_NOTIFY = "tinkrokits@gmail.com";
const INVOICE_LOGO_URL = "https://tinkro.in/assets/brand/logo.png?v=20260424";
const INVOICE_SEQUENCE_START = 10001;
const INVOICE_SEQUENCE_PAD = 5;

function getResendClient() {
  const apiKey = RESEND_API_KEY.value();
  return new Resend(apiKey);
}

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatInvoiceCurrency(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

function normalizeDate(value: any) {
  if (!value) return null;
  if (typeof value?.toDate === "function") {
    return value.toDate() as Date;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function formatInvoiceSequence(value: number) {
  return String(value).padStart(INVOICE_SEQUENCE_PAD, "0");
}

function getCashfreeBaseUrl() {
  const env = (CASHFREE_ENV.value() || "sandbox").toLowerCase();
  return env === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function buildInvoiceIds(order: any, fallbackId: string) {
  const rawId = String(order?.id || fallbackId || "").toUpperCase();
  const orderSuffix = rawId ? rawId.slice(-6) : "XXXXXX";
  const createdAt = normalizeDate(order?.createdAt) || new Date();
  const dateKey = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  const invoiceNumber = String(order?.invoiceNumber || "").trim();
  return {
    invoiceId: invoiceNumber || `TKR-${dateKey}-${orderSuffix}`,
    orderId: `TKR-${dateKey}${orderSuffix}`,
    createdAt,
  };
}

async function ensureInvoiceNumber(orderId: string, order: any) {
  const orderRef = db.collection("orders").doc(orderId);

  return db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    const orderData = orderSnap.exists ? orderSnap.data() : order;
    const existing = String(orderData?.invoiceNumber || "").trim();
    if (existing) return existing;

    const createdAt = normalizeDate(orderData?.createdAt) || new Date();
    const dateKey = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
    const counterRef = db.collection("invoiceCounters").doc(dateKey);
    const counterSnap = await tx.get(counterRef);
    const counterData = counterSnap.exists ? counterSnap.data() || {} : {};
    const lastNumber = Number(counterData.lastNumber || 0);
    const nextNumber = lastNumber >= INVOICE_SEQUENCE_START ? lastNumber + 1 : INVOICE_SEQUENCE_START;
    const invoiceNumber = `TKR-${dateKey}-${formatInvoiceSequence(nextNumber)}`;

    tx.set(counterRef, {
      lastNumber: nextNumber,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    tx.set(orderRef, {
      invoiceNumber,
      invoiceDateKey: dateKey,
    }, { merge: true });

    return invoiceNumber;
  });
}

async function generateInvoicePdfBuffer(order: any, fallbackId: string) {
  const { invoiceId, orderId } = buildInvoiceIds(order, fallbackId);
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];
  let logoBuffer: Buffer | null = null;

  try {
    const res = await fetch(INVOICE_LOGO_URL);
    if (res.ok) {
      logoBuffer = Buffer.from(await res.arrayBuffer());
    }
  } catch {
    logoBuffer = null;
  }

  return await new Promise<{ buffer: Buffer; invoiceId: string }>((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve({ buffer: Buffer.concat(chunks), invoiceId }));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const marginX = 40;

    doc.rect(18, 18, pageWidth - 36, pageHeight - 36).lineWidth(1.5).stroke("#787878");

    if (logoBuffer) {
      doc.image(logoBuffer, marginX, 22, { width: 72, height: 42 });
    }

    const stripY = 24 + 52;
    doc.fillColor("#121826");
    doc.roundedRect(marginX, stripY, pageWidth - marginX * 2, 30, 6).fill();
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(12);
    doc.text("TAX INVOICE", pageWidth / 2, stripY + 9, { align: "center" });
    doc.fillColor("#111827").font("Helvetica");

    const headerY = stripY + 40;
    const boxGap = 20;
    const boxWidth = (pageWidth - marginX * 2 - boxGap) / 2;
    const boxTitleHeight = 16;

    const drawBox = (x: number, y: number, title: string, height: number) => {
      doc.rect(x, y, boxWidth, height).stroke("#e5e5e5");
      doc.rect(x, y, boxWidth, boxTitleHeight).fill("#f5f5f5");
      doc.fillColor("#111827").font("Helvetica-Bold").fontSize(9).text(title, x + 8, y + 4);
    };

    drawBox(marginX, headerY, "TINKRO", 104);
    drawBox(marginX + boxWidth + boxGap, headerY, "INVOICE DETAILS", 104);

    doc.font("Helvetica").fontSize(9).fillColor("#111827");
    const leftTextY = headerY + 24;
    const leftX = marginX + 8;
    doc.text("1408/4 Nanda Nagar, Indore", leftX, leftTextY);
    doc.text("Indore, Madhya Pradesh - 452010", leftX, leftTextY + 14);
    doc.text("Email: hello@tinkro.in", leftX, leftTextY + 28);
    doc.text("Phone: +91-9644525429", leftX, leftTextY + 42);
    doc.text("GST: 23BNYPG2236A1ZB", leftX, leftTextY + 56);

    const rightX = marginX + boxWidth + boxGap + 8;
    doc.text(`Invoice #: ${invoiceId}`, rightX, leftTextY);
    doc.text(`Order ID: ${orderId}`, rightX, leftTextY + 14);
    doc.text(`Date: ${normalizeDate(order?.createdAt)?.toLocaleDateString("en-IN") || ""}`, rightX, leftTextY + 28);
    const paymentId =
      order?.cashfreePaymentId || order?.razorpayPaymentId || "—";
    doc.text(`Payment ID: ${paymentId}`, rightX, leftTextY + 42);
    doc.text("Status: COMPLETED", rightX, leftTextY + 56);

    const addressY = headerY + 120;
    drawBox(marginX, addressY, "BILL TO", 92);
    drawBox(marginX + boxWidth + boxGap, addressY, "SHIP TO", 92);

    const customerName = order?.customerName || order?.address?.name || "Customer";
    const addressLine = order?.address
      ? `${order.address.line1}${order.address.line2 ? ", " + order.address.line2 : ""}`
      : "";
    const cityLine = order?.address
      ? `${order.address.city}, ${order.address.state} ${order.address.pincode}`
      : "";
    const customerEmail = order?.customerEmail || "";
    const phoneLine = order?.address?.phone ? `Phone: ${order.address.phone}` : "";

    const billX = marginX + 8;
    doc.text(customerName, billX, addressY + 24);
    if (addressLine) doc.text(addressLine, billX, addressY + 38);
    if (cityLine) doc.text(cityLine, billX, addressY + 52);
    if (customerEmail) doc.text(`Email: ${customerEmail}`, billX, addressY + 66);
    if (phoneLine) doc.text(phoneLine, billX, addressY + 80);

    const shipX = marginX + boxWidth + boxGap + 8;
    doc.text(customerName, shipX, addressY + 24);
    if (addressLine) doc.text(addressLine, shipX, addressY + 38);
    if (cityLine) doc.text(cityLine, shipX, addressY + 52);

    const tableY = addressY + 104;
    const tableWidth = pageWidth - marginX * 2;
    const fixedWidths = {
      sNo: 34,
      qty: 40,
      unit: 80,
      tax: 70,
      total: 80,
    };
    const descWidth = Math.max(
      180,
      tableWidth - (fixedWidths.sNo + fixedWidths.qty + fixedWidths.unit + fixedWidths.tax + fixedWidths.total),
    );
    const columns = [
      fixedWidths.sNo,
      descWidth,
      fixedWidths.qty,
      fixedWidths.unit,
      fixedWidths.tax,
      fixedWidths.total,
    ];
    const headers = ["S.No", "Description", "Qty", "Unit Price", "Tax", "Total"];

    const drawTableHeader = (y: number) => {
      doc.rect(marginX, y, tableWidth, 18).fill("#F67316");
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
      let x = marginX + 6;
      headers.forEach((header, index) => {
        doc.text(header, x, y + 4, {
          width: columns[index] - 6,
          align: index === 0 || index === 2 ? "center" : "left",
        });
        x += columns[index];
      });
      doc.fillColor("#111827").font("Helvetica");
      return y + 20;
    };

    const ensureTableRowSpace = (rowHeight: number) => {
      const footerReserve = 200;
      if (rowY + rowHeight > pageHeight - footerReserve) {
        doc.addPage();
        doc.rect(18, 18, pageWidth - 36, pageHeight - 36).lineWidth(1.5).stroke("#787878");
        rowY = 60;
        rowY = drawTableHeader(rowY);
      }
    };

    const items = Array.isArray(order?.items) ? order.items : [];
    let rowY = drawTableHeader(tableY);
    doc.font("Helvetica").fillColor("#111827");

    items.forEach((item: any, index: number) => {
      const qty = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      const lineTotal = price * qty;
      const lineBase = lineTotal / 1.18;
      const lineTax = lineTotal - lineBase;

      const desc = String(item?.name || "");
      const descHeight = doc.heightOfString(desc, {
        width: columns[1] - 8,
      });
      const rowHeight = Math.max(18, descHeight + 4);

      ensureTableRowSpace(rowHeight);

      if (index % 2 === 1) {
        doc.fillColor("#FCFCFC");
        doc.rect(marginX, rowY - 2, tableWidth, rowHeight).fill();
        doc.fillColor("#111827");
      }

      let colX = marginX + 6;
      doc.text(String(index + 1), colX, rowY, {
        width: columns[0] - 8,
        align: "center",
      });
      colX += columns[0];
      doc.text(desc, colX, rowY, {
        width: columns[1] - 8,
        lineBreak: true,
      });
      colX += columns[1];
      doc.text(String(qty), colX, rowY, {
        width: columns[2] - 8,
        align: "center",
      });
      colX += columns[2];
      doc.text(formatInvoiceCurrency(lineBase / Math.max(qty, 1)), colX, rowY, {
        width: columns[3] - 8,
        align: "right",
      });
      colX += columns[3];
      doc.text(formatInvoiceCurrency(lineTax), colX, rowY, {
        width: columns[4] - 8,
        align: "right",
      });
      colX += columns[4];
      doc.text(formatInvoiceCurrency(lineTotal), colX, rowY, {
        width: columns[5] - 8,
        align: "right",
      });

      rowY += rowHeight;
    });

    const taxableAmount = Math.max(0, Number(order?.subtotal || 0) - Number(order?.discount || 0));
    const shippingCharge = Number(order?.shippingCharge || 0);
    const baseAmount = taxableAmount / 1.18;
    const taxAmount = taxableAmount - baseAmount;

    let totalsY = Math.max(rowY + 12, tableY + 70);
    const footerBlockHeight = 190;
    if (totalsY + footerBlockHeight > pageHeight - 40) {
      doc.addPage();
      doc.rect(18, 18, pageWidth - 36, pageHeight - 36).lineWidth(1.5).stroke("#787878");
      totalsY = 60;
    }

    const totalsValueWidth = 110;
    const totalsLabelWidth = 110;
    const totalsGap = 8;
    const totalsValueX = pageWidth - marginX - totalsValueWidth;
    const totalsLabelX = totalsValueX - totalsGap - totalsLabelWidth;

    doc.font("Helvetica").fontSize(9).fillColor("#111827");
    doc.text("Subtotal:", totalsLabelX, totalsY, { width: totalsLabelWidth, align: "right" });
    doc.text(formatInvoiceCurrency(baseAmount), totalsValueX, totalsY, { width: totalsValueWidth, align: "right" });
    doc.text("Tax (18%):", totalsLabelX, totalsY + 16, { width: totalsLabelWidth, align: "right" });
    doc.text(formatInvoiceCurrency(taxAmount), totalsValueX, totalsY + 16, { width: totalsValueWidth, align: "right" });
    doc.text("Shipping:", totalsLabelX, totalsY + 32, { width: totalsLabelWidth, align: "right" });
    doc.text(
      shippingCharge > 0 ? formatInvoiceCurrency(shippingCharge) : "Free",
      totalsValueX,
      totalsY + 32,
      { width: totalsValueWidth, align: "right" },
    );
    doc.font("Helvetica-Bold");
    doc.text("TOTAL AMOUNT:", totalsLabelX, totalsY + 54, { width: totalsLabelWidth, align: "right" });
    doc.text(formatInvoiceCurrency(Number(order?.total || 0)), totalsValueX, totalsY + 54, { width: totalsValueWidth, align: "right" });

    doc.font("Helvetica").fontSize(9).fillColor("#111827");
    doc.text(
      `Amount in words: ${amountInWords(Number(order?.total || 0))}`,
      marginX,
      totalsY + 74,
      { width: pageWidth - marginX * 2, align: "right" },
    );

    const footerBoxY = totalsY + 92;
    const footerBoxHeight = 54;
    doc.fillColor("#FFF3ED");
    doc.roundedRect(marginX, footerBoxY, pageWidth - marginX * 2, footerBoxHeight, 6).fill();
    doc.fillColor("#111827").font("Helvetica").fontSize(9);
    const footerLine1Y = footerBoxY + 18;
    const footerLine2Y = footerBoxY + 34;
    doc.text("Thank you for shopping with Tinkro!", marginX, footerLine1Y, {
      width: pageWidth - marginX * 2,
      align: "center",
    });
    doc.text("If you have any questions, contact us at hello@tinkro.in", marginX, footerLine2Y, {
      width: pageWidth - marginX * 2,
      align: "center",
    });

    doc.font("Helvetica").fontSize(8).fillColor("#6b7280");
    doc.text(
      "This is a computer generated invoice and does not require a signature.",
      marginX,
      footerBoxY + footerBoxHeight + 18,
      { width: pageWidth - marginX * 2, align: "center" },
    );

    doc.end();
  });
}

function buildEnquiryEmail(enquiry: any) {
  const lines = [
    `Name: ${enquiry.name || ""}`,
    `Email: ${enquiry.email || ""}`,
    enquiry.phone ? `Phone: ${enquiry.phone}` : null,
    enquiry.schoolName ? `School: ${enquiry.schoolName}` : null,
    `Subject: ${enquiry.subject || enquiry.labType || ""}`,
    "",
    "Message:",
    enquiry.message || "",
  ].filter(Boolean);

  return lines.join("\n");
}

const EMAIL_LOGO_URL = "https://tinkro.in/assets/brand/logo.png?v=20260424";

function wrapHtml(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#0b1020;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1020;padding:24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
            <tr>
              <td style="padding:20px 24px;background:linear-gradient(135deg,#0f172a,#111827);color:#fff;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <img src="${EMAIL_LOGO_URL}" alt="Tinkro" width="36" height="36" style="border-radius:8px;display:block;" />
                  <div>
                    <h1 style="margin:0;font-size:20px;">Tinkro</h1>
                    <p style="margin:4px 0 0;color:#94a3b8;font-size:12px;">Build. Code. Innovate.</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;color:#e2e8f0;font-size:14px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;color:#94a3b8;font-size:12px;border-top:1px solid rgba(255,255,255,0.06);">
                © ${new Date().getFullYear()} Tinkro. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function formatOrderItemsHtml(items: any[] = []) {
  if (!items.length) return "<p>No items found.</p>";

  const rows = items
    .map((item) => {
      const name = String(item?.name || "");
      const qty = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      const lineTotal = price * qty;
      return `
        <tr>
          <td style="padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.06);">${name}</td>
          <td style="padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center;">${qty}</td>
          <td style="padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;">${formatCurrency(
            price,
          )}</td>
          <td style="padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;">${formatCurrency(
            lineTotal,
          )}</td>
        </tr>`;
    })
    .join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:8px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.12);">Item</th>
          <th style="text-align:center;padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.12);">Qty</th>
          <th style="text-align:right;padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.12);">Unit</th>
          <th style="text-align:right;padding:8px 6px;border-bottom:1px solid rgba(255,255,255,0.12);">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
}

function buildAdminOrderEmail(orderId: string, order: any) {
  const customerName = order?.customerName || order?.address?.name || "Customer";
  const customerEmail = order?.customerEmail || "—";
  const total = formatCurrency(Number(order?.total || 0));
  const paymentId =
    order?.cashfreePaymentId || order?.razorpayPaymentId || "—";
  const paymentGateway = order?.paymentGateway || "—";
  const createdAt = normalizeDate(order?.createdAt)?.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }) || "—";
  const addressLine = order?.address
    ? `${order.address.line1}${order.address.line2 ? ", " + order.address.line2 : ""}, ${order.address.city}, ${order.address.state} ${order.address.pincode}`
    : "—";

  const header = `New Order Received — ${orderId}`;
  const summaryBlock = `
    <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">
      <div><strong>Order ID:</strong> ${orderId}</div>
      <div style="margin-top:6px;"><strong>Total:</strong> ${total}</div>
      <div style="margin-top:6px;"><strong>Payment:</strong> ${paymentGateway} · ${paymentId}</div>
      <div style="margin-top:6px;"><strong>Placed At:</strong> ${createdAt}</div>
    </div>`;

  const customerBlock = `
    <div style="margin-top:14px;padding:12px 14px;border-radius:12px;background:#0b1224;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">
      <div><strong>Name:</strong> ${customerName}</div>
      <div style="margin-top:6px;"><strong>Email:</strong> ${customerEmail}</div>
      <div style="margin-top:6px;"><strong>Phone:</strong> ${order?.address?.phone || "—"}</div>
      <div style="margin-top:6px;"><strong>Address:</strong> ${addressLine}</div>
    </div>`;

  const itemsTable = formatOrderItemsHtml(order?.items || []);

  return {
    subject: header,
    html: wrapHtml(
      header,
      `<h2 style="margin:0 0 12px;font-size:18px;">${header}</h2>
       <p style="margin:0 0 12px;color:#cbd5e1;">A new order has been placed on the Tinkro store.</p>
       ${summaryBlock}
       <h3 style="margin:16px 0 8px;font-size:14px;color:#e2e8f0;">Customer Details</h3>
       ${customerBlock}
       <h3 style="margin:16px 0 8px;font-size:14px;color:#e2e8f0;">Order Items</h3>
       ${itemsTable}`,
    ),
  };
}

function enquiryAdminHtml(enquiry: any) {
  const rows = [
    `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>Name:</strong> ${enquiry.name || ""}</td></tr>`,
    `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>Email:</strong> ${enquiry.email || ""}</td></tr>`,
    enquiry.phone
      ? `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>Phone:</strong> ${enquiry.phone}</td></tr>`
      : "",
    enquiry.schoolName
      ? `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>School:</strong> ${enquiry.schoolName}</td></tr>`
      : "",
    `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>Subject:</strong> ${
      enquiry.subject || enquiry.labType || ""
    }</td></tr>`,
  ].join("");

  const messageBlock = `<div style="margin-top:12px;padding:14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">${
    (enquiry.message || "").replace(/\n/g, "<br />")
  }</div>`;

  return wrapHtml(
    "New Enquiry",
    `<h2 style="margin:0 0 12px;font-size:18px;">New Enquiry Received</h2>
     <p style="margin:0 0 16px;color:#94a3b8;">A new enquiry was submitted from the website.</p>
     <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
       ${rows}
     </table>
     <h3 style="margin:16px 0 8px;font-size:14px;color:#e2e8f0;">Message</h3>
     ${messageBlock}`,
  );
}

function enquiryAutoReplyHtml(enquiry: any) {
  return wrapHtml(
    "We received your enquiry",
    `<h2 style="margin:0 0 12px;font-size:18px;">Thanks for reaching out!</h2>
     <p style="margin:0 0 16px;color:#cbd5e1;">Hi ${
       enquiry.name || "there"
    }, we’ve received your enquiry and our team will get back to you within 24 hours.</p>
     <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">
       <strong>Subject:</strong> ${enquiry.subject || "General Inquiry"}
     </div>
     <p style="margin:16px 0 0;color:#94a3b8;">If you have more details, simply reply to this email.</p>
     <p style="margin:12px 0 0;color:#e2e8f0;">— Team Tinkro</p>`
  );
}

function promoEmailHtml(
  recipientName: string,
  subject: string,
  message: string,
  couponCode: string,
) {
  return wrapHtml(
    subject,
    `<h2 style="margin:0 0 12px;font-size:18px;">Special Offer Just for You 🎁</h2>
     <p style="margin:0 0 10px;color:#cbd5e1;">Hi ${
       recipientName || "there"
     },</p>
     <p style="margin:0 0 12px;color:#e2e8f0;">${message}</p>
     <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px dashed rgba(255,255,255,0.2);color:#e2e8f0;display:inline-block;">
       <strong>Coupon Code:</strong> <span style="letter-spacing:2px;">${couponCode}</span>
     </div>
     <p style="margin:16px 0 0;color:#94a3b8;">Use this code at checkout. Happy learning!</p>
     <p style="margin:12px 0 0;color:#e2e8f0;">— Team Tinkro</p>`
  );
}

export const sendEnquiryEmail = onDocumentCreated(
  {
    document: "enquiries/{id}",
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL, ENQUIRY_NOTIFY_EMAIL],
  },
  async (event) => {
    const enquiry = event.data?.data();
    if (!enquiry) return;

    const resend = getResendClient();
    const fromEmail = RESEND_FROM_EMAIL.value() || DEFAULT_FROM_EMAIL;
    const notifyEmail = ENQUIRY_NOTIFY_EMAIL.value() || DEFAULT_ENQUIRY_NOTIFY;

    await resend.emails.send({
      from: `Tinkro <${fromEmail}>`,
      to: notifyEmail,
      subject: `New Enquiry: ${enquiry.subject || enquiry.labType || "Website"}`,
      text: buildEnquiryEmail(enquiry),
      html: enquiryAdminHtml(enquiry),
    });

    if (enquiry.email) {
      await resend.emails.send({
        from: `Tinkro <${fromEmail}>`,
        to: enquiry.email,
        subject: "We received your enquiry",
        text: `Hi ${enquiry.name || "there"},\n\nThanks for reaching out! We’ve received your enquiry and will get back to you within 24 hours.\n\n— Team Tinkro`,
        html: enquiryAutoReplyHtml(enquiry),
      });
    }
  },
);

export const sendOrderConfirmation = onDocumentCreated(
  {
    document: "orders/{id}",
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
    memory: "512MiB",
  },
  async (event) => {
    const order = event.data?.data();
    if (!order) return;

    const orderId = event.params.id;

    const customerEmail = order.customerEmail || order.email;
    if (!customerEmail) return;

    const resend = getResendClient();
    const fromEmail = RESEND_FROM_EMAIL.value() || DEFAULT_FROM_EMAIL;

    const subject = `Order Confirmed — ${order.id || orderId || "Tinkro"}`;
    const text = [
      `Hi ${order.customerName || "there"},`,
      "",
      "Your order has been confirmed!",
      `Order ID: ${order.id || orderId || ""}`,
      `Total: ${formatCurrency(order.total)}`,
      "Invoice: Attached as PDF",
      "",
      "We will notify you once the order is shipped.",
      "",
      "Thanks a lot for choosing Tinkro — happy learning ahead!",
      "— Team Tinkro",
    ].join("\n");

    const invoiceNumber = await ensureInvoiceNumber(orderId, order);
    const { buffer: invoiceBuffer, invoiceId } = await generateInvoicePdfBuffer(
      { ...order, invoiceNumber },
      orderId,
    );

    await resend.emails.send({
      from: `Tinkro <${fromEmail}>`,
      to: customerEmail,
      subject,
      text,
      attachments: [
        {
          filename: `${invoiceId}.pdf`,
          content: invoiceBuffer.toString("base64"),
          content_type: "application/pdf",
        },
      ],
      html: wrapHtml(
        subject,
        `<h2 style="margin:0 0 12px;font-size:18px;">Order Confirmed 🎉</h2>
         <p style="margin:0 0 12px;color:#cbd5e1;">Hi ${
           order.customerName || "there"
         }, your order has been confirmed.</p>
         <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">
           <div><strong>Order ID:</strong> ${order.id || orderId || ""}</div>
           <div style="margin-top:6px;"><strong>Total:</strong> ${formatCurrency(
             order.total,
           )}</div>
         </div>
         <p style="margin:16px 0 0;color:#94a3b8;">Invoice attached as PDF with this email.</p>
         <p style="margin:8px 0 0;color:#94a3b8;">We’ll notify you once your order is shipped.</p>
         <p style="margin:12px 0 0;color:#e2e8f0;">Thanks a lot for choosing Tinkro — happy learning ahead!</p>
         <p style="margin:6px 0 0;color:#e2e8f0;">— Team Tinkro</p>`,
      ),
    });
  },
);

export const sendAdminOrderNotification = onDocumentCreated(
  {
    document: "orders/{id}",
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL, ORDER_NOTIFY_EMAIL, ENQUIRY_NOTIFY_EMAIL],
  },
  async (event) => {
    const order = event.data?.data();
    if (!order) return;

    const orderId = event.params.id;
    const resend = getResendClient();
    const fromEmail = RESEND_FROM_EMAIL.value() || DEFAULT_FROM_EMAIL;
    const notify =
      ORDER_NOTIFY_EMAIL.value() ||
      ENQUIRY_NOTIFY_EMAIL.value() ||
      DEFAULT_ENQUIRY_NOTIFY;

    const recipients = notify
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    if (!recipients.length) return;

    const { subject, html } = buildAdminOrderEmail(orderId, order);

    await resend.emails.send({
      from: `Tinkro <${fromEmail}>`,
      to: recipients,
      subject,
      text: `New order received: ${orderId}\nTotal: ${formatCurrency(
        Number(order.total || 0),
      )}\nCustomer: ${order.customerName || ""}`,
      html,
    });
  },
);

export const handleOrderCreated = onDocumentCreated(
  {
    document: "orders/{id}",
  },
  async (event) => {
    const order = event.data?.data();
    if (!order) return;

    const orderId = event.params.id;
    const userId = order.userId as string | undefined;
    const orderTotal = Number(order.total || 0);

    await ensureInvoiceNumber(orderId, order);

    if (userId) {
      const userRef = db.collection("users").doc(userId);
      await userRef.set(
        {
          totalOrders: FieldValue.increment(1),
          totalSpent: FieldValue.increment(orderTotal),
          lastOrderDate: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    const couponId = order.couponId as string | undefined | null;
    if (!couponId || !userId) return;

    const couponRef = db.collection("coupons").doc(couponId);
    const redemptionRef = db
      .collection("couponRedemptions")
      .doc(`${couponId}_${userId}`);

    await db.runTransaction(async (tx) => {
      const couponSnap = await tx.get(couponRef);
      if (!couponSnap.exists) return;
      const couponData = couponSnap.data() || {};
      const oneTimePerUser = Boolean(couponData.oneTimePerUser);

      if (oneTimePerUser) {
        const redemptionSnap = await tx.get(redemptionRef);
        if (!redemptionSnap.exists) {
          tx.set(redemptionRef, {
            couponId,
            userId,
            orderId,
            couponCode: order.couponCode || order.coupon || null,
            redeemedAt: FieldValue.serverTimestamp(),
          });
        }
      }

      tx.update(couponRef, {
        usedCount: FieldValue.increment(1),
      });
    });
  },
);

export const sendOrderShipped = onDocumentUpdated(
  {
    document: "orders/{id}",
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
  },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!after || !before) return;

    const orderId = event.params.id;

    if (before.status === after.status) return;
    if (after.status !== "shipped") return;

    const customerEmail = after.customerEmail || after.email;
    if (!customerEmail) return;

    const resend = getResendClient();
    const fromEmail = RESEND_FROM_EMAIL.value() || DEFAULT_FROM_EMAIL;

    const subject = `Order Shipped — ${after.id || orderId || "Tinkro"}`;
    const text = [
      `Hi ${after.customerName || "there"},`,
      "",
      "Good news! Your order has been shipped.",
      `Order ID: ${after.id || orderId || ""}`,
      after.trackingId ? `Tracking ID: ${after.trackingId}` : null,
      after.estimatedDelivery
        ? `Estimated Delivery: ${after.estimatedDelivery}`
        : null,
      "",
      "Thanks for shopping with Tinkro!",
    ]
      .filter(Boolean)
      .join("\n");

    await resend.emails.send({
      from: `Tinkro <${fromEmail}>`,
      to: customerEmail,
      subject,
      text,
      html: wrapHtml(
        subject,
        `<h2 style="margin:0 0 12px;font-size:18px;">Order Shipped 🚚</h2>
         <p style="margin:0 0 12px;color:#cbd5e1;">Hi ${
           after.customerName || "there"
         }, your order is on the way.</p>
         <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">
           <div><strong>Order ID:</strong> ${after.id || orderId || ""}</div>
           ${after.trackingId ? `<div style="margin-top:6px;"><strong>Tracking ID:</strong> ${after.trackingId}</div>` : ""}
           ${after.estimatedDelivery ? `<div style="margin-top:6px;"><strong>Estimated Delivery:</strong> ${after.estimatedDelivery}</div>` : ""}
         </div>
         <p style="margin:16px 0 0;color:#94a3b8;">Thanks for shopping with Tinkro!</p>`,
      ),
    });
  },
);

export const createCashfreeOrder = onCall(
  {
    secrets: [CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV],
    region: "asia-south1",
  },
  async (request) => {
    const auth = request.auth;
    if (!auth?.uid) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const data = request.data || {};
    const amount = Number(data.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new HttpsError("invalid-argument", "Invalid amount");
    }

    const currency = String(data.currency || "INR").toUpperCase();
    const customer = data.customer || {};
    const customerId = String(customer.id || auth.uid).trim();
    const customerName = String(customer.name || "").trim();
    const customerEmail = String(customer.email || "").trim();
    const customerPhone = String(customer.phone || "").trim();

    if (!customerEmail) {
      throw new HttpsError("invalid-argument", "Customer email is required");
    }

    if (!customerPhone) {
      throw new HttpsError("invalid-argument", "Customer phone is required");
    }

    const clientId = CASHFREE_APP_ID.value();
    const clientSecret = CASHFREE_SECRET_KEY.value();

    if (!clientId || !clientSecret) {
      throw new HttpsError(
        "failed-precondition",
        "Cashfree credentials missing",
      );
    }

    const orderId = `tkr_${Date.now()}_${auth.uid.slice(0, 6)}`;
    const body = {
      order_id: orderId,
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_note: String(data.orderNote || "").trim() || undefined,
      order_meta: data.orderMeta || undefined,
    };

    const response = await fetch(`${getCashfreeBaseUrl()}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cashfree order creation failed", {
        status: response.status,
        error: errorText,
      });
      throw new HttpsError("internal", "Cashfree order creation failed", {
        status: response.status,
        error: errorText,
      });
    }

    const result = (await response.json()) as any;
    const paymentSessionId = String(result?.payment_session_id || "").trim();
    const returnedOrderId = String(result?.order_id || orderId).trim();

    if (!paymentSessionId) {
      throw new HttpsError(
        "internal",
        "Cashfree did not return a payment session",
      );
    }

    return {
      orderId: returnedOrderId,
      paymentSessionId,
    };
  },
);

export const verifyCashfreePayment = onCall(
  {
    secrets: [CASHFREE_APP_ID, CASHFREE_SECRET_KEY, CASHFREE_ENV],
    region: "asia-south1",
  },
  async (request) => {
    const auth = request.auth;
    if (!auth?.uid) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const orderId = String(request.data?.orderId || "").trim();
    if (!orderId) {
      throw new HttpsError("invalid-argument", "Order ID is required");
    }

    const clientId = CASHFREE_APP_ID.value();
    const clientSecret = CASHFREE_SECRET_KEY.value();
    if (!clientId || !clientSecret) {
      throw new HttpsError(
        "failed-precondition",
        "Cashfree credentials missing",
      );
    }

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
      "x-api-version": "2023-08-01",
    };

    const baseUrl = getCashfreeBaseUrl();
    const orderRes = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers,
    });

    if (!orderRes.ok) {
      const errorText = await orderRes.text();
      throw new HttpsError("internal", "Cashfree order lookup failed", {
        status: orderRes.status,
        error: errorText,
      });
    }

    const orderInfo = (await orderRes.json()) as any;

    let paymentStatus: string | null = null;
    let paymentId: string | null = null;

    const paymentsRes = await fetch(`${baseUrl}/orders/${orderId}/payments`, {
      method: "GET",
      headers,
    });

    if (paymentsRes.ok) {
      const payments = (await paymentsRes.json()) as any;
      const firstPayment = Array.isArray(payments)
        ? payments[0]
        : payments?.[0] || null;
      paymentStatus = firstPayment?.payment_status || null;
      paymentId =
        firstPayment?.cf_payment_id || firstPayment?.payment_id || null;
    }

    return {
      orderId: orderInfo?.order_id || orderId,
      cfOrderId: orderInfo?.cf_order_id || null,
      orderStatus: orderInfo?.order_status || null,
      paymentStatus,
      paymentId,
    };
  },
);

export const sendPromoEmail = onCall(
  {
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
  },
  async (request) => {
    const auth = request.auth;
    if (!auth?.uid) {
      throw new HttpsError("unauthenticated", "Login required");
    }

    const adminSnap = await db.collection("adminusers").doc(auth.uid).get();
    if (!adminSnap.exists) {
      throw new HttpsError("permission-denied", "Admin access required");
    }

    const data = request.data || {};
    const audience = data.audience || "all";
    const activityDays = Number(data.activityDays || 60);
    const couponCode = String(data.couponCode || "").trim().toUpperCase();
    const subject = String(data.subject || "Special offer from Tinkro").trim();
    const message = String(data.message || "").trim();

    if (!couponCode || !subject || !message) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const usersSnap = await db.collection("users").get();
    const now = Date.now();
    const cutoff = new Date(now - activityDays * 24 * 60 * 60 * 1000);

    const resend = getResendClient();
    const fromEmail = RESEND_FROM_EMAIL.value() || DEFAULT_FROM_EMAIL;

    let sent = 0;
    let skipped = 0;

    for (const docSnap of usersSnap.docs) {
      const user = docSnap.data() as any;
      const email = user.email as string | undefined;
      if (!email) {
        skipped += 1;
        continue;
      }

      const totalOrders = Number(user.totalOrders || 0);
      const lastOrderDate = user.lastOrderDate?.toDate
        ? user.lastOrderDate.toDate()
        : user.lastOrderDate
          ? new Date(user.lastOrderDate)
          : null;

      const isNew = totalOrders === 0;
      const isInactive = !lastOrderDate || lastOrderDate < cutoff;
      const isActive = !!lastOrderDate && lastOrderDate >= cutoff;

      const eligible =
        audience === "all" ||
        (audience === "new" && isNew) ||
        (audience === "inactive" && isInactive) ||
        (audience === "active" && isActive);

      if (!eligible) {
        skipped += 1;
        continue;
      }

      const name = user.displayName || user.email || "there";

      await resend.emails.send({
        from: `Tinkro <${fromEmail}>`,
        to: email,
        subject,
        text: `Hi ${name},\n\n${message}\n\nCoupon Code: ${couponCode}\n\n— Team Tinkro`,
        html: promoEmailHtml(name, subject, message, couponCode),
      });
      sent += 1;
    }

    return { sent, skipped };
  },
);
