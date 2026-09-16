"use server";

import { createHash, timingSafeEqual } from "crypto";
import { redirect } from "next/navigation";
import { createSession, deleteSession, getSession } from "@/lib/session";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function matches(input: string, expected: string) {
  return timingSafeEqual(digest(input), digest(expected));
}

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";

  if (!expectedUser || !expectedPass) {
    return { error: "Admin credentials are not configured in env." };
  }

  if (!matches(username, expectedUser) || !matches(password, expectedPass)) {
    return { error: "Invalid username or password." };
  }

  await createSession(username);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}

export async function getAdminUser() {
  const session = await getSession();
  return session?.user ?? null;
}
