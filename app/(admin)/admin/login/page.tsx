import LoginForm from "@/components/admin/LoginForm";
import { site } from "@/data/site";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: `Admin login | ${site.brand.name}`,
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#141414] p-7">
        <Image
          src={site.brand.logo}
          alt={site.brand.name}
          width={64}
          height={58}
          className="mx-auto h-14 w-auto object-contain"
        />
        <h1 className="mt-4 text-center font-display text-3xl font-semibold text-white">
          Admin login
        </h1>
        <p className="mt-1 mb-6 text-center text-sm text-zinc-500">
          Use the username and password from your env file.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
