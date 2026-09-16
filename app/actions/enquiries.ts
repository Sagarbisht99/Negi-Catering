"use server";

import { revalidatePath } from "next/cache";
import { occasions } from "@/data/occasions";
import { sendEnquiryEmail, isMailConfigured } from "@/lib/mailer";
import { Enquiry, enquiryStatuses, type EnquiryStatus } from "@/lib/models/Enquiry";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";

export type { EnquiryStatus };

export type EnquiryRecord = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  event: string;
  guests: number;
  source: "contact" | "popup";
  status: EnquiryStatus;
  isRead: boolean;
  createdAt?: string;
};

export type EnquiryInput = {
  name: string;
  email: string;
  mobile: string;
  event: string;
  guests: string;
  source: "contact" | "popup";
};

function refreshEnquiries() {
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

function parseEnquiry(input: EnquiryInput) {
  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const mobile = String(input.mobile ?? "").trim();
  const event = String(input.event ?? "").trim();
  const guests = Number(input.guests);
  const source = input.source;

  if (!name || !email || !mobile || !event) {
    throw new Error("Please fill all required fields");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email");
  }
  if (!/^[0-9+\-\s]{10,15}$/.test(mobile)) {
    throw new Error("Please enter a valid mobile number");
  }
  if (!(occasions as readonly string[]).includes(event)) {
    throw new Error("Please select a valid event");
  }
  if (!Number.isFinite(guests) || guests < 1) {
    throw new Error("Please enter number of guests");
  }
  if (source !== "contact" && source !== "popup") {
    throw new Error("Invalid form source");
  }

  return { name, email, mobile, event, guests, source, status: "pending" as const };
}

function normalizeStatus(value: unknown): EnquiryStatus {
  if (typeof value === "string" && (enquiryStatuses as readonly string[]).includes(value)) {
    return value as EnquiryStatus;
  }
  return "pending";
}

export async function submitEnquiry(input: EnquiryInput) {
  const data = parseEnquiry(input);

  await dbConnect();
  await Enquiry.create(data);
  refreshEnquiries();

  let emailSent = false;
  try {
    if (isMailConfigured()) {
      await sendEnquiryEmail(data);
      emailSent = true;
    } else {
      console.warn("Resend not configured — enquiry saved in admin only.");
    }
  } catch (err) {
    console.error("Enquiry email failed:", err);
  }

  return { ok: true as const, emailSent };
}

export async function listEnquiries(): Promise<EnquiryRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await Enquiry.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => {
    const item = serializeDoc<EnquiryRecord>(row);
    return { ...item, status: normalizeStatus(item.status) };
  });
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  await requireAdmin();
  if (!(enquiryStatuses as readonly string[]).includes(status)) {
    throw new Error("Invalid status");
  }
  await dbConnect();
  await Enquiry.findByIdAndUpdate(id, {
    status,
    isRead: status !== "pending",
  });
  refreshEnquiries();
}

export async function updateEnquiry(
  id: string,
  input: {
    name: string;
    email: string;
    mobile: string;
    event: string;
    guests: string;
    status: EnquiryStatus;
  },
) {
  await requireAdmin();

  const name = String(input.name ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const mobile = String(input.mobile ?? "").trim();
  const event = String(input.event ?? "").trim();
  const guests = Number(input.guests);
  const status = normalizeStatus(input.status);

  if (!name || !email || !mobile || !event) {
    throw new Error("Please fill all required fields");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email");
  }
  if (!/^[0-9+\-\s]{10,15}$/.test(mobile)) {
    throw new Error("Please enter a valid mobile number");
  }
  if (!(occasions as readonly string[]).includes(event)) {
    throw new Error("Please select a valid event");
  }
  if (!Number.isFinite(guests) || guests < 1) {
    throw new Error("Please enter number of guests");
  }

  await dbConnect();
  await Enquiry.findByIdAndUpdate(id, {
    name,
    email,
    mobile,
    event,
    guests,
    status,
    isRead: status !== "pending",
  });
  refreshEnquiries();
}

export async function markEnquiryRead(id: string, isRead = true) {
  await requireAdmin();
  await dbConnect();
  await Enquiry.findByIdAndUpdate(id, { isRead });
  refreshEnquiries();
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();
  await dbConnect();
  await Enquiry.findByIdAndDelete(id);
  refreshEnquiries();
}
