"use server";

import { revalidatePath } from "next/cache";
import { deleteResumeFile, uploadResume } from "@/lib/imagekit";
import { isMailConfigured, sendApplicationEmail } from "@/lib/mailer";
import {
  Application,
  applicationStatuses,
  type ApplicationStatus,
} from "@/lib/models/Application";
import { dbConnect } from "@/lib/mongodb";
import { serializeDoc } from "@/lib/serialize";
import { requireAdmin } from "@/lib/session";
import {
  applicationStatusSchema,
  careerFormSchema,
  parseWithZod,
} from "@/lib/validation";

export type { ApplicationStatus };

export type ApplicationRecord = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  resumeUrl: string;
  resumeFileId?: string;
  resumeName: string;
  status: ApplicationStatus;
  isRead: boolean;
  createdAt?: string;
};

function refreshApplications() {
  revalidatePath("/admin/applications");
  revalidatePath("/admin/dashboard");
}

function normalizeStatus(value: unknown): ApplicationStatus {
  if (
    typeof value === "string" &&
    (applicationStatuses as readonly string[]).includes(value)
  ) {
    return value as ApplicationStatus;
  }
  return "pending";
}

/** Public careers form — validates fields, stores the resume, saves + emails. */
export async function submitApplication(formData: FormData) {
  const data = parseWithZod(careerFormSchema, {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    mobile: String(formData.get("mobile") ?? ""),
    role: String(formData.get("role") ?? ""),
  });

  const resumeFile = formData.get("resume") as File | null;
  const resume = await uploadResume(resumeFile);

  try {
    await dbConnect();
    await Application.create({
      ...data,
      resumeUrl: resume.url,
      resumeFileId: resume.fileId,
      resumeName: resume.name,
      status: "pending",
    });
  } catch (err) {
    // Don't leave an orphaned resume behind if saving the record failed.
    await deleteResumeFile(resume.fileId);
    throw err;
  }

  refreshApplications();

  let emailSent = false;
  try {
    if (isMailConfigured()) {
      await sendApplicationEmail({
        ...data,
        resumeUrl: resume.url,
        resumeName: resume.name,
      });
      emailSent = true;
    } else {
      console.warn("Resend not configured — application saved in admin only.");
    }
  } catch (err) {
    console.error("Application email failed:", err);
  }

  return { ok: true as const, emailSent };
}

export async function listApplications(): Promise<ApplicationRecord[]> {
  await requireAdmin();
  await dbConnect();
  const rows = await Application.find().sort({ createdAt: -1 }).lean();
  return rows.map((row) => {
    const item = serializeDoc<ApplicationRecord>(row);
    return { ...item, status: normalizeStatus(item.status) };
  });
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
) {
  await requireAdmin();
  const data = parseWithZod(applicationStatusSchema, { status });

  await dbConnect();
  await Application.findByIdAndUpdate(id, {
    status: data.status,
    isRead: data.status !== "pending",
  });
  refreshApplications();
}

export async function markApplicationRead(id: string, isRead = true) {
  await requireAdmin();
  await dbConnect();
  await Application.findByIdAndUpdate(id, { isRead });
  refreshApplications();
}

export async function deleteApplication(id: string) {
  await requireAdmin();
  await dbConnect();

  const existing = await Application.findById(id);
  if (!existing) throw new Error("Application not found");

  await deleteResumeFile(existing.resumeFileId as string | undefined);
  await Application.findByIdAndDelete(id);
  refreshApplications();
}
