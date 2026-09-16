"use client";

import { loginAction } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500">
          Username
        </span>
        <input
          name="username"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-white/10 bg-[#121212] px-3.5 py-2.5 text-sm text-white outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-500">
          Password
        </span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-[#121212] px-3.5 py-2.5 text-sm text-white outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
        />
      </label>
      {state?.error ? (
        <p className="text-sm font-semibold text-terracotta">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-terracotta py-3 text-sm font-bold text-white hover:bg-terracotta-dark disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
