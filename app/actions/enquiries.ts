"use server";

import { revalidatePath } from "next/cache";
import { sendEnquiryEmail, isMailConfigured } from "@/lib/mailer";
import { Enquiry, enquiryStatuses, type EnquiryStatus } from "@/lib/models/Enquiry";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";
import {
  enquiryAdminSchema,
  enquiryFormSchema,
  parseWithZod,
} from "@/lib/validation";

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
  guests: string | number;
  source: "contact" | "popup";
};

function refreshEnquiries() {
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

function normalizeStatus(value: unknown): EnquiryStatus {
  if (typeof value === "string" && (enquiryStatuses as readonly string[]).includes(value)) {
    return value as EnquiryStatus;
  }
  return "pending";
}

export async function submitEnquiry(input: EnquiryInput) {
  const data = parseWithZod(enquiryFormSchema, input);

  await dbConnect();
  await Enquiry.create({ ...data, status: "pending" });
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
    guests: string | number;
    status: EnquiryStatus;
  },
) {
  await requireAdmin();
  const data = parseWithZod(enquiryAdminSchema, input);

  await dbConnect();
  await Enquiry.findByIdAndUpdate(id, {
    ...data,
    isRead: data.status !== "pending",
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
