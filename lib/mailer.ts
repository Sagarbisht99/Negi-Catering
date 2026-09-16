import "server-only";

import { Resend } from "resend";
import { site } from "@/data/site";

export type EnquiryMailPayload = {
  name: string;
  email: string;
  mobile: string;
  event: string;
  guests: number;
  source: "contact" | "popup";
};

const BRAND = {
  terracotta: "#c45c26",
  terracottaDark: "#9a4418",
  ink: "#1c1917",
  muted: "#78716c",
  line: "#e7e5e4",
  ivory: "#faf7f2",
  ivoryDeep: "#f3eee6",
  white: "#ffffff",
  gold: "#b8956c",
};

function env(name: string) {
  return (process.env[name] ?? "").trim().replace(/^["']|["']$/g, "");
}

export function isMailConfigured() {
  const key = env("RESEND_API_KEY");
  return Boolean(key && key.startsWith("re_"));
}

function getResend() {
  const key = env("RESEND_API_KEY");
  if (!key) {
    throw new Error("RESEND_API_KEY is missing in .env");
  }
  return new Resend(key);
}

/** Resend blocks Gmail/Yahoo as From until you verify your own domain. */
function getFromAddress() {
  const configured = env("RESEND_FROM_EMAIL");
  const fallback = `${site.brand.name} <onboarding@resend.dev>`;

  if (!configured) return fallback;

  const lower = configured.toLowerCase();
  if (
    lower.includes("@gmail.com") ||
    lower.includes("@googlemail.com") ||
    lower.includes("@yahoo.") ||
    lower.includes("@outlook.") ||
    lower.includes("@hotmail.")
  ) {
    return fallback;
  }

  return configured;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function detailRow(label: string, valueHtml: string, isLast = false) {
  const border = isLast ? "none" : `1px solid ${BRAND.line}`;
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:${border};width:34%;vertical-align:top">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.gold}">${label}</span>
      </td>
      <td style="padding:14px 0;border-bottom:${border};vertical-align:top;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.45;color:${BRAND.ink};font-weight:600">
        ${valueHtml}
      </td>
    </tr>
  `;
}

function emailShell(options: {
  preheader: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bodyHtml: string;
  footerNote?: string;
}) {
  const year = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.ivoryDeep};-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(options.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.ivoryDeep}">
    <tr>
      <td align="center" style="padding:36px 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${BRAND.white};border-radius:4px;overflow:hidden;box-shadow:0 12px 40px rgba(28,25,23,0.08)">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(160deg, ${BRAND.ink} 0%, #2c241e 100%);padding:36px 40px 32px;text-align:center">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.gold};margin-bottom:14px">
                ${escapeHtml(site.brand.sinceLabel)}
              </div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:${BRAND.white};letter-spacing:0.04em">
                ${escapeHtml(site.brand.name)}
              </div>
              <div style="width:48px;height:1px;background:${BRAND.gold};margin:18px auto 0"></div>
            </td>
          </tr>
          <!-- Accent bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg, ${BRAND.terracottaDark}, ${BRAND.terracotta}, ${BRAND.gold});font-size:0;line-height:0">&nbsp;</td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 28px">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${BRAND.terracotta};margin-bottom:10px">
                ${escapeHtml(options.eyebrow)}
              </div>
              <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;font-weight:normal;color:${BRAND.ink}">
                ${options.title}
              </h1>
              <p style="margin:0 0 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.65;color:${BRAND.muted}">
                ${options.subtitle}
              </p>
              ${options.bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:${BRAND.ivory};border-top:1px solid ${BRAND.line};padding:24px 40px;text-align:center">
              ${
                options.footerNote
                  ? `<p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.5;color:${BRAND.muted}">${options.footerNote}</p>`
                  : ""
              }
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;color:${BRAND.ink}">
                ${escapeHtml(site.brand.fullName)}
              </p>
              <p style="margin:6px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:${BRAND.muted}">
                ${escapeHtml(site.location.label)} · ${escapeHtml(site.contact.hours)}
              </p>
              <p style="margin:16px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:0.06em;color:${BRAND.gold}">
                © ${year} ${escapeHtml(site.brand.name)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function enquiryDetailsCard(data: EnquiryMailPayload) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.ivory};border:1px solid ${BRAND.line};border-radius:4px">
      <tr>
        <td style="padding:8px 24px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${detailRow("Name", escapeHtml(data.name))}
            ${detailRow(
              "Email",
              `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND.terracotta};text-decoration:none">${escapeHtml(data.email)}</a>`,
            )}
            ${detailRow(
              "Mobile",
              `<a href="tel:${escapeHtml(data.mobile)}" style="color:${BRAND.terracotta};text-decoration:none">${escapeHtml(data.mobile)}</a>`,
            )}
            ${detailRow("Event", escapeHtml(data.event))}
            ${detailRow("Guests", String(data.guests), true)}
          </table>
        </td>
      </tr>
    </table>
  `;
}

function actionButtons(data: EnquiryMailPayload) {
  const tel = data.mobile.replace(/\s+/g, "");
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px">
      <tr>
        <td style="padding-right:10px">
          <a href="tel:${escapeHtml(tel)}" style="display:inline-block;background:${BRAND.terracotta};color:${BRAND.white};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.04em;text-decoration:none;padding:12px 22px;border-radius:3px">
            Call guest
          </a>
        </td>
        <td>
          <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:${BRAND.white};color:${BRAND.ink};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.04em;text-decoration:none;padding:11px 22px;border-radius:3px;border:1px solid ${BRAND.line}">
            Reply by email
          </a>
        </td>
      </tr>
    </table>
  `;
}

function customerSummaryCard(data: EnquiryMailPayload) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.ivory};border:1px solid ${BRAND.line};border-radius:4px;margin-bottom:8px">
      <tr>
        <td style="padding:22px 24px">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.gold};margin-bottom:14px">
            Enquiry summary
          </div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:0 12px 0 0;width:50%;vertical-align:top">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:${BRAND.muted};margin-bottom:4px">Event</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:${BRAND.ink};line-height:1.35">${escapeHtml(data.event)}</div>
              </td>
              <td style="padding:0;width:50%;vertical-align:top;border-left:1px solid ${BRAND.line};padding-left:20px">
                <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:${BRAND.muted};margin-bottom:4px">Guests</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:${BRAND.ink};line-height:1.35">${data.guests}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

async function sendWithResend(options: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}) {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: options.from,
    to: [options.to],
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  if (error) {
    throw new Error(error.message || "Resend email failed");
  }

  return data;
}

/** Email to admin inbox + confirmation to the customer via Resend */
export async function sendEnquiryEmail(data: EnquiryMailPayload) {
  if (!isMailConfigured()) {
    throw new Error("Resend is not configured. Add RESEND_API_KEY in .env");
  }

  const adminTo = env("ENQUIRY_TO_EMAIL");
  if (!adminTo) {
    throw new Error("ENQUIRY_TO_EMAIL is missing in .env");
  }

  const from = getFromAddress();
  const sourceLabel = data.source === "popup" ? "Website popup" : "Contact page";

  await sendWithResend({
    from,
    to: adminTo,
    replyTo: data.email,
    subject: `New enquiry · ${data.event} · ${data.name}`,
    text: [
      `New catering enquiry (${sourceLabel})`,
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Mobile: ${data.mobile}`,
      `Event: ${data.event}`,
      `Guests: ${data.guests}`,
      "",
      "Also saved in Admin → Enquiries",
    ].join("\n"),
    html: emailShell({
      preheader: `${data.name} enquired about ${data.event} for ${data.guests} guests.`,
      eyebrow: "New enquiry",
      title: "A guest is waiting to hear from you",
      subtitle: `Received via ${sourceLabel}. Full details are below — also saved in Admin → Enquiries.`,
      bodyHtml: `
        ${enquiryDetailsCard(data)}
        ${actionButtons(data)}
      `,
      footerNote: "Reply to this email to message the guest directly.",
    }),
  });

  if (data.email.toLowerCase() !== adminTo.toLowerCase()) {
    try {
      await sendWithResend({
        from,
        to: data.email,
        subject: `We received your enquiry · ${site.brand.name}`,
        text: [
          `Hi ${data.name},`,
          "",
          `Thank you for contacting ${site.brand.name}. We received your enquiry and will get back to you soon.`,
          "",
          `Event: ${data.event}`,
          `Guests: ${data.guests}`,
          "",
          `— ${site.brand.name}`,
          site.contact.phoneDisplay,
          site.contact.email,
        ].join("\n"),
        html: emailShell({
          preheader: `Thank you, ${data.name}. We received your ${data.event} enquiry.`,
          eyebrow: "Enquiry received",
          title: `Thank you, ${escapeHtml(data.name)}`,
          subtitle: `We have received your catering enquiry and our team will contact you shortly. ${site.brand.sinceLabel} — serving celebrations across ${site.location.label}.`,
          bodyHtml: customerSummaryCard(data),
          footerNote: `Need something sooner? Call us at <a href="tel:${escapeHtml(site.contact.phone)}" style="color:${BRAND.terracotta};text-decoration:none">${escapeHtml(site.contact.phoneDisplay)}</a>`,
        }),
      });
    } catch (err) {
      console.warn("Customer confirmation email skipped:", err);
    }
  }
}
