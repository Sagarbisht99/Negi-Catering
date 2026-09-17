import { enquiryStatuses } from "@/data/enquiry";
import { occasions } from "@/data/occasions";
import { z } from "zod";

const occasionEnum = z.enum(occasions);
const statusEnum = z.enum(enquiryStatuses);

const nameSchema = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(80, "Name is too long");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Please enter a valid email"))
  .refine((value) => value.length <= 120, { message: "Email is too long" });

const mobileSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => /^[6-9]\d{9}$/.test(value), {
    message: "Enter a valid 10-digit mobile number",
  });

const guestsSchema = z.coerce
  .number({ error: "Please enter number of guests" })
  .int("Guests must be a whole number")
  .min(1, "At least 1 guest is required")
  .max(50000, "Guest count looks too high");

/** Public enquiry / contact form (client + server) */
export const enquiryFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  mobile: mobileSchema,
  event: occasionEnum,
  guests: guestsSchema,
  source: z.enum(["contact", "popup"]),
});

export type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

/** Admin enquiry edit */
export const enquiryAdminSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  mobile: mobileSchema,
  event: occasionEnum,
  guests: guestsSchema,
  status: statusEnum,
});

export type EnquiryAdminValues = z.infer<typeof enquiryAdminSchema>;

const slugFieldSchema = z
  .string()
  .trim()
  .max(80, "Slug is too long")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/, {
    message: "Slug can only use lowercase letters, numbers, and hyphens",
  });

const seoFieldsSchema = {
  slug: slugFieldSchema,
  metaTitle: z.string().trim().max(70, "Meta title is too long (max 70)"),
  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description is too long (max 160)"),
  metaKeywords: z
    .string()
    .trim()
    .max(300, "Keywords are too long")
    .refine(
      (value) =>
        !value ||
        value
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean).length <= 15,
      { message: "Use up to 15 comma-separated keywords" },
    ),
};

export const serviceFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name is required")
    .max(100, "Service name is too long"),
  description: z
    .string()
    .trim()
    .min(5, "Description is required")
    .max(1000, "Description is too long"),
  isActive: z.boolean(),
  ...seoFieldsSchema,
});

export const blogFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Blog title is required")
    .max(140, "Blog title is too long"),
  excerpt: z
    .string()
    .trim()
    .min(10, "Excerpt is required")
    .max(300, "Excerpt is too long"),
  content: z
    .string()
    .trim()
    .min(20, "Content is required")
    .max(20000, "Content is too long"),
  isActive: z.boolean(),
  ...seoFieldsSchema,
});

export const offerFieldsSchema = z.object({
  isVisible: z.boolean(),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type FieldErrors = Partial<Record<string, string>>;

export function zodFieldErrors(error: z.ZodError): FieldErrors {
  const flat = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const out: FieldErrors = {};
  for (const [key, messages] of Object.entries(flat)) {
    const message = messages?.[0];
    if (message) out[key] = message;
  }
  return out;
}

export function zodFirstMessage(error: z.ZodError) {
  const fields = zodFieldErrors(error);
  const firstField = Object.values(fields)[0];
  if (firstField) return firstField;
  return error.flatten().formErrors[0] ?? "Please check the form and try again";
}

export function parseWithZod<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(zodFirstMessage(result.error));
  }
  return result.data;
}
