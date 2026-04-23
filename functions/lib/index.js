"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPromoEmail = exports.sendOrderShipped = exports.handleOrderCreated = exports.sendOrderConfirmation = exports.sendEnquiryEmail = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firestore_2 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const resend_1 = require("resend");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
const RESEND_API_KEY = (0, params_1.defineSecret)("RESEND_API_KEY");
const RESEND_FROM_EMAIL = (0, params_1.defineSecret)("RESEND_FROM_EMAIL");
const ENQUIRY_NOTIFY_EMAIL = (0, params_1.defineSecret)("ENQUIRY_NOTIFY_EMAIL");
const DEFAULT_FROM_EMAIL = "hello@tinkro.in";
const DEFAULT_ENQUIRY_NOTIFY = "tinkrokits@gmail.com";
function getResendClient() {
    const apiKey = RESEND_API_KEY.value();
    return new resend_1.Resend(apiKey);
}
function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}
function buildEnquiryEmail(enquiry) {
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
function wrapHtml(title, bodyHtml) {
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
function enquiryAdminHtml(enquiry) {
    const rows = [
        `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>Name:</strong> ${enquiry.name || ""}</td></tr>`,
        `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>Email:</strong> ${enquiry.email || ""}</td></tr>`,
        enquiry.phone
            ? `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>Phone:</strong> ${enquiry.phone}</td></tr>`
            : "",
        enquiry.schoolName
            ? `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>School:</strong> ${enquiry.schoolName}</td></tr>`
            : "",
        `<tr><td style="padding:8px 0;color:#cbd5e1;"><strong>Subject:</strong> ${enquiry.subject || enquiry.labType || ""}</td></tr>`,
    ].join("");
    const messageBlock = `<div style="margin-top:12px;padding:14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">${(enquiry.message || "").replace(/\n/g, "<br />")}</div>`;
    return wrapHtml("New Enquiry", `<h2 style="margin:0 0 12px;font-size:18px;">New Enquiry Received</h2>
     <p style="margin:0 0 16px;color:#94a3b8;">A new enquiry was submitted from the website.</p>
     <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
       ${rows}
     </table>
     <h3 style="margin:16px 0 8px;font-size:14px;color:#e2e8f0;">Message</h3>
     ${messageBlock}`);
}
function enquiryAutoReplyHtml(enquiry) {
    return wrapHtml("We received your enquiry", `<h2 style="margin:0 0 12px;font-size:18px;">Thanks for reaching out!</h2>
     <p style="margin:0 0 16px;color:#cbd5e1;">Hi ${enquiry.name || "there"}, we’ve received your enquiry and our team will get back to you within 24 hours.</p>
     <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">
       <strong>Subject:</strong> ${enquiry.subject || "General Inquiry"}
     </div>
     <p style="margin:16px 0 0;color:#94a3b8;">If you have more details, simply reply to this email.</p>
     <p style="margin:12px 0 0;color:#e2e8f0;">— Team Tinkro</p>`);
}
function promoEmailHtml(recipientName, subject, message, couponCode) {
    return wrapHtml(subject, `<h2 style="margin:0 0 12px;font-size:18px;">Special Offer Just for You 🎁</h2>
     <p style="margin:0 0 10px;color:#cbd5e1;">Hi ${recipientName || "there"},</p>
     <p style="margin:0 0 12px;color:#e2e8f0;">${message}</p>
     <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px dashed rgba(255,255,255,0.2);color:#e2e8f0;display:inline-block;">
       <strong>Coupon Code:</strong> <span style="letter-spacing:2px;">${couponCode}</span>
     </div>
     <p style="margin:16px 0 0;color:#94a3b8;">Use this code at checkout. Happy learning!</p>
     <p style="margin:12px 0 0;color:#e2e8f0;">— Team Tinkro</p>`);
}
exports.sendEnquiryEmail = (0, firestore_2.onDocumentCreated)({
    document: "enquiries/{id}",
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL, ENQUIRY_NOTIFY_EMAIL],
}, async (event) => {
    const enquiry = event.data?.data();
    if (!enquiry)
        return;
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
});
exports.sendOrderConfirmation = (0, firestore_2.onDocumentCreated)({
    document: "orders/{id}",
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
}, async (event) => {
    const order = event.data?.data();
    if (!order)
        return;
    const orderId = event.params.id;
    const customerEmail = order.customerEmail || order.email;
    if (!customerEmail)
        return;
    const resend = getResendClient();
    const fromEmail = RESEND_FROM_EMAIL.value() || DEFAULT_FROM_EMAIL;
    const subject = `Order Confirmed — ${order.id || orderId || "Tinkro"}`;
    const text = [
        `Hi ${order.customerName || "there"},`,
        "",
        "Your order has been confirmed!",
        `Order ID: ${order.id || orderId || ""}`,
        `Total: ${formatCurrency(order.total)}`,
        "",
        "We will notify you once the order is shipped.",
        "",
        "Thanks a lot for choosing Tinkro — happy learning ahead!",
        "— Team Tinkro",
    ].join("\n");
    await resend.emails.send({
        from: `Tinkro <${fromEmail}>`,
        to: customerEmail,
        subject,
        text,
        html: wrapHtml(subject, `<h2 style="margin:0 0 12px;font-size:18px;">Order Confirmed 🎉</h2>
         <p style="margin:0 0 12px;color:#cbd5e1;">Hi ${order.customerName || "there"}, your order has been confirmed.</p>
         <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">
           <div><strong>Order ID:</strong> ${order.id || orderId || ""}</div>
           <div style="margin-top:6px;"><strong>Total:</strong> ${formatCurrency(order.total)}</div>
         </div>
         <p style="margin:16px 0 0;color:#94a3b8;">We’ll notify you once your order is shipped.</p>
         <p style="margin:12px 0 0;color:#e2e8f0;">Thanks a lot for choosing Tinkro — happy learning ahead!</p>
         <p style="margin:6px 0 0;color:#e2e8f0;">— Team Tinkro</p>`),
    });
});
exports.handleOrderCreated = (0, firestore_2.onDocumentCreated)({
    document: "orders/{id}",
}, async (event) => {
    const order = event.data?.data();
    if (!order)
        return;
    const orderId = event.params.id;
    const userId = order.userId;
    const orderTotal = Number(order.total || 0);
    if (userId) {
        const userRef = db.collection("users").doc(userId);
        await userRef.set({
            totalOrders: firestore_1.FieldValue.increment(1),
            totalSpent: firestore_1.FieldValue.increment(orderTotal),
            lastOrderDate: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    const couponId = order.couponId;
    if (!couponId || !userId)
        return;
    const couponRef = db.collection("coupons").doc(couponId);
    const redemptionRef = db
        .collection("couponRedemptions")
        .doc(`${couponId}_${userId}`);
    await db.runTransaction(async (tx) => {
        const couponSnap = await tx.get(couponRef);
        if (!couponSnap.exists)
            return;
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
                    redeemedAt: firestore_1.FieldValue.serverTimestamp(),
                });
            }
        }
        tx.update(couponRef, {
            usedCount: firestore_1.FieldValue.increment(1),
        });
    });
});
exports.sendOrderShipped = (0, firestore_2.onDocumentUpdated)({
    document: "orders/{id}",
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
}, async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!after || !before)
        return;
    const orderId = event.params.id;
    if (before.status === after.status)
        return;
    if (after.status !== "shipped")
        return;
    const customerEmail = after.customerEmail || after.email;
    if (!customerEmail)
        return;
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
        html: wrapHtml(subject, `<h2 style="margin:0 0 12px;font-size:18px;">Order Shipped 🚚</h2>
         <p style="margin:0 0 12px;color:#cbd5e1;">Hi ${after.customerName || "there"}, your order is on the way.</p>
         <div style="padding:12px 14px;border-radius:12px;background:#0f172a;border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;">
           <div><strong>Order ID:</strong> ${after.id || orderId || ""}</div>
           ${after.trackingId ? `<div style="margin-top:6px;"><strong>Tracking ID:</strong> ${after.trackingId}</div>` : ""}
           ${after.estimatedDelivery ? `<div style="margin-top:6px;"><strong>Estimated Delivery:</strong> ${after.estimatedDelivery}</div>` : ""}
         </div>
         <p style="margin:16px 0 0;color:#94a3b8;">Thanks for shopping with Tinkro!</p>`),
    });
});
exports.sendPromoEmail = (0, https_1.onCall)({
    secrets: [RESEND_API_KEY, RESEND_FROM_EMAIL],
}, async (request) => {
    const auth = request.auth;
    if (!auth?.uid) {
        throw new https_1.HttpsError("unauthenticated", "Login required");
    }
    const adminSnap = await db.collection("adminusers").doc(auth.uid).get();
    if (!adminSnap.exists) {
        throw new https_1.HttpsError("permission-denied", "Admin access required");
    }
    const data = request.data || {};
    const audience = data.audience || "all";
    const activityDays = Number(data.activityDays || 60);
    const couponCode = String(data.couponCode || "").trim().toUpperCase();
    const subject = String(data.subject || "Special offer from Tinkro").trim();
    const message = String(data.message || "").trim();
    if (!couponCode || !subject || !message) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields");
    }
    const usersSnap = await db.collection("users").get();
    const now = Date.now();
    const cutoff = new Date(now - activityDays * 24 * 60 * 60 * 1000);
    const resend = getResendClient();
    const fromEmail = RESEND_FROM_EMAIL.value() || DEFAULT_FROM_EMAIL;
    let sent = 0;
    let skipped = 0;
    for (const docSnap of usersSnap.docs) {
        const user = docSnap.data();
        const email = user.email;
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
        const eligible = audience === "all" ||
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
});
