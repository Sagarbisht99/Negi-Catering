"use client";

import { listEnquiries } from "@/app/actions/enquiries";
import { listFoods } from "@/app/actions/food";
import { listOffers } from "@/app/actions/offers";
import { listServices } from "@/app/actions/services";
import { adminPanel } from "@/components/admin/adminStyles";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const cards = [
  {
    title: "Enquiries",
    href: "/admin/enquiries",
    queryKey: ["enquiries"] as const,
    queryFn: listEnquiries,
  },
  {
    title: "Food",
    href: "/admin/food",
    queryKey: ["foods"] as const,
    queryFn: listFoods,
  },
  {
    title: "Services",
    href: "/admin/services",
    queryKey: ["services"] as const,
    queryFn: listServices,
  },
  {
    title: "Offer banner",
    href: "/admin/offers",
    queryKey: ["offers"] as const,
    queryFn: listOffers,
  },
] as const;

export default function DashboardStats() {
  const enquiries = useQuery({ queryKey: cards[0].queryKey, queryFn: cards[0].queryFn });
  const foods = useQuery({ queryKey: cards[1].queryKey, queryFn: cards[1].queryFn });
  const services = useQuery({ queryKey: cards[2].queryKey, queryFn: cards[2].queryFn });
  const offers = useQuery({ queryKey: cards[3].queryKey, queryFn: cards[3].queryFn });

  const stats = [
    { ...cards[0], query: enquiries },
    { ...cards[1], query: foods },
    { ...cards[2], query: services },
    { ...cards[3], query: offers },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Overview of enquiries, food, services, and the offer banner.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`${adminPanel} block p-5 transition hover:border-white/20 hover:bg-white/[0.04]`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {card.title}
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {card.query.isPending
                ? "—"
                : card.title === "Offer banner"
                  ? (card.query.data?.length ?? 0) > 0
                    ? "On"
                    : "Off"
                  : (card.query.data?.length ?? 0)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {card.query.isError
                ? "Could not load"
                : card.title === "Offer banner"
                  ? "Popup banner"
                  : "Total items"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
