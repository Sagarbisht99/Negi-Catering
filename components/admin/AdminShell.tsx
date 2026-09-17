"use client";

import { logoutAction } from "@/app/actions/auth";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/enquiries", label: "Enquiries", icon: EnquiryIcon },
  { href: "/admin/services", label: "Services", icon: ServiceIcon },
  { href: "/admin/blogs", label: "Blogs", icon: BlogIcon },
  { href: "/admin/offers", label: "Offer Banner", icon: OfferIcon },
];

const titles: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": { title: "Dashboard", subtitle: "Overview of your catering" },
  "/admin/enquiries": { title: "Enquiries", subtitle: "Website leads" },
  "/admin/services": { title: "Services", subtitle: "Manage offerings" },
  "/admin/blogs": { title: "Blogs", subtitle: "Posts and SEO" },
  "/admin/offers": { title: "Offer banner", subtitle: "ImageKit popup" },
};

export default function AdminShell({
  user,
  children,
}: {
  user: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, startLogout] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const meta = titles[pathname] ?? titles["/admin/dashboard"];
  const initials = user.slice(0, 2).toUpperCase();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const showLabels = mounted ? !collapsed : true;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-zinc-100">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-white/10 bg-[#121212] transition-[width,transform] duration-200 md:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed && mounted ? "md:w-[84px]" : "w-[250px] md:w-[250px]"}`}
      >
        <div
          className={`flex items-center border-b border-white/10 ${
            collapsed && mounted
              ? "justify-center gap-1 px-1.5 py-4"
              : "justify-between px-4 py-5"
          }`}
        >
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileOpen(false)}
            title={site.brand.name}
            className="shrink-0"
          >
            <Image
              src="/favicon-192.png"
              alt={site.brand.name}
              width={40}
              height={40}
              className={`rounded-lg object-cover ring-1 ring-white/10 ${
                collapsed && mounted ? "h-8 w-8" : "h-10 w-10"
              }`}
            />
          </Link>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((v) => !v)}
            className="hidden shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white md:inline-flex"
          >
            <MenuIcon />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
          {links.map((link) => {
            const active =
              link.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition ${
                  active
                    ? "bg-[#262626] text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                } ${collapsed && mounted ? "md:justify-center md:px-2" : ""}`}
              >
                <Icon active={active} />
                {showLabels ? <span className={collapsed ? "md:hidden" : ""}>{link.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            title="View website"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white ${
              collapsed && mounted ? "md:justify-center md:px-2" : ""
            }`}
          >
            <StoreIcon />
            {showLabels ? <span className={collapsed ? "md:hidden" : ""}>View website</span> : null}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[#0a0a0a]">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#0a0a0a]/95 px-4 py-4 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 text-zinc-300 hover:bg-white/5 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>

          <div className="min-w-0">
            <p className="text-lg font-semibold text-white sm:text-xl">{meta.title}</p>
            <p className="text-xs text-zinc-500 sm:text-sm">{meta.subtitle}</p>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-zinc-300 sm:inline-flex">
              <AdminBadgeIcon />
              Admin
            </span>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-white ring-2 ring-terracotta/30 transition hover:ring-terracotta/60"
              >
                {initials}
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/50">
                  <div className="border-b border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">Admin</p>
                        <p className="truncate text-xs text-zinc-500">{user}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setLogoutOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        title="Are you sure to logout?"
        message="You will need to sign in again to access the admin dashboard."
        confirmLabel="Logout"
        danger
        loading={loggingOut}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          startLogout(() => {
            void logoutAction();
          });
        }}
      />
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className={active ? "text-white" : ""}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function EnquiryIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className={active ? "text-white" : ""}>
      <path
        d="M5 6.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H5A1.5 1.5 0 0 1 3.5 16V8A1.5 1.5 0 0 1 5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className={active ? "text-white" : ""}>
      <path d="M8 7h11M8 12h11M8 17h11M5 7h.01M5 12h.01M5 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BlogIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className={active ? "text-white" : ""}>
      <path
        d="M6 5.5h12A1.5 1.5 0 0 1 19.5 7v12.5l-3-2-3 2-3-2-3 2-3-2V7A1.5 1.5 0 0 1 6 5.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8.5 9.5h7M8.5 12.5h7M8.5 15.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function OfferIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className={active ? "text-white" : ""}>
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9h16" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 10h16l-1 10H5L4 10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function AdminBadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 19c1.5-3.2 4-4.8 7-4.8S17.5 15.8 19 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 7V5a1 1 0 0 1 1-1h8v16h-8a1 1 0 0 1-1-1v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 12h10M10 8l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
