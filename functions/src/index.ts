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

const DEFAULT_FROM_EMAIL = "hello@tinkro.in";
const DEFAULT_ENQUIRY_NOTIFY = "tinkrokits@gmail.com";

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

function normalizeDate(value: any) {
  if (!value) return null;
  if (typeof value?.toDate === "function") {
    return value.toDate() as Date;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function buildInvoiceIds(order: any, fallbackId: string) {
  const rawId = String(order?.id || fallbackId || "").toUpperCase();
  const orderSuffix = rawId ? rawId.slice(-6) : "XXXXXX";
  const createdAt = normalizeDate(order?.createdAt) || new Date();
  const dateKey = createdAt.toISOString().slice(0, 10).replace(/-/g, "");
  return {
    invoiceId: `TKR-${dateKey}-${orderSuffix}`,
    orderId: `TKR-${dateKey}${orderSuffix}`,
    createdAt,
  };
}

async function generateInvoicePdfBuffer(order: any, fallbackId: string) {
  const { invoiceId, orderId } = buildInvoiceIds(order, fallbackId);
  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const chunks: Buffer[] = [];

  return await new Promise<{ buffer: Buffer; invoiceId: string }>((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve({ buffer: Buffer.concat(chunks), invoiceId }));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const marginX = 40;

    doc.rect(18, 18, pageWidth - 36, pageHeight - 36).lineWidth(1).stroke("#787878");

    doc.fillColor("#0f172a");
    doc.fontSize(14).font("Helvetica-Bold").text("TAX INVOICE", {
      align: "center",
    });
    doc.moveDown(0.6);
    doc.fontSize(10).font("Helvetica").fillColor("#111827");
    doc.text("TINKRO", { align: "center" });

    const headerY = doc.y + 12;
    const boxGap = 20;
    const boxWidth = (pageWidth - marginX * 2 - boxGap) / 2;
    const boxTitleHeight = 16;

    const drawBox = (x: number, y: number, title: string, height: number) => {
      doc.rect(x, y, boxWidth, height).stroke("#e5e5e5");
      doc.rect(x, y, boxWidth, boxTitleHeight).fill("#f5f5f5");
      doc.fillColor("#111827").font("Helvetica-Bold").fontSize(9).text(title, x + 8, y + 4);
    };

    drawBox(marginX, headerY, "TINKRO", 96);
    drawBox(marginX + boxWidth + boxGap, headerY, "INVOICE DETAILS", 96);

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
    doc.text(`Payment ID: ${order?.razorpayPaymentId || "—"}`, rightX, leftTextY + 42);
    doc.text("Status: COMPLETED", rightX, leftTextY + 56);

    const addressY = headerY + 112;
    drawBox(marginX, addressY, "BILL TO", 90);
    drawBox(marginX + boxWidth + boxGap, addressY, "SHIP TO", 90);

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

    const tableY = addressY + 110;
    const columns = [32, 200, 40, 80, 60, 80];
    const headers = ["S.No", "Description", "Qty", "Unit Price", "Tax", "Total"];

    doc.rect(marginX, tableY, pageWidth - marginX * 2, 18).fill("#F67316");
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
    let x = marginX + 6;
    headers.forEach((header, index) => {
      doc.text(header, x, tableY + 4, { width: columns[index] - 6 });
      x += columns[index];
    });

    const items = Array.isArray(order?.items) ? order.items : [];
    let rowY = tableY + 20;
    doc.font("Helvetica").fillColor("#111827");

    items.forEach((item: any, index: number) => {
      const qty = Number(item?.quantity || 0);
      const price = Number(item?.price || 0);
      const lineTotal = price * qty;
      const lineBase = lineTotal / 1.18;
      const lineTax = lineTotal - lineBase;

      const row = [
        String(index + 1),
        String(item?.name || ""),
        String(qty),
        formatInvoiceCurrency(lineBase / Math.max(qty, 1)),
        formatInvoiceCurrency(lineTax),
        formatInvoiceCurrency(lineTotal),
      ];

      let colX = marginX + 6;
      row.forEach((cell, idx) => {
        doc.text(cell, colX, rowY, { width: columns[idx] - 8 });
        colX += columns[idx];
      });
      rowY += 18;
    });

    const taxableAmount = Math.max(0, Number(order?.subtotal || 0) - Number(order?.discount || 0));
    const baseAmount = taxableAmount / 1.18;
    const taxAmount = taxableAmount - baseAmount;

    const totalsY = Math.max(rowY + 10, tableY + 60);
    doc.font("Helvetica").fontSize(9).fillColor("#111827");
    doc.text("Subtotal:", pageWidth - marginX - 160, totalsY, { align: "right" });
    doc.text(formatInvoiceCurrency(baseAmount), pageWidth - marginX, totalsY, { align: "right" });
    doc.text("Tax (18%):", pageWidth - marginX - 160, totalsY + 14, { align: "right" });
    doc.text(formatInvoiceCurrency(taxAmount), pageWidth - marginX, totalsY + 14, { align: "right" });
    doc.text("Shipping:", pageWidth - marginX - 160, totalsY + 28, { align: "right" });
    doc.text("Free", pageWidth - marginX, totalsY + 28, { align: "right" });
    doc.font("Helvetica-Bold");
    doc.text("TOTAL AMOUNT:", pageWidth - marginX - 160, totalsY + 44, { align: "right" });
    doc.text(formatInvoiceCurrency(Number(order?.total || 0)), pageWidth - marginX, totalsY + 44, { align: "right" });

    doc.font("Helvetica").fontSize(8).fillColor("#6b7280");
    doc.text(
      "This is a computer generated invoice and does not require a signature.",
      marginX,
      totalsY + 72,
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

const EMAIL_LOGO_URL = "https://tinkro.in/dp.jpg";

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

    const { buffer: invoiceBuffer, invoiceId } = await generateInvoicePdfBuffer(order, orderId);

    await resend.emails.send({
      from: `Tinkro <${fromEmail}>`,
      to: customerEmail,
      subject,
      text,
      attachments: [
        {
          filename: `${invoiceId}.pdf`,
          content: invoiceBuffer.toString("base64"),
          contentType: "application/pdf",
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
