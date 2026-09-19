"use client";

import { site } from "@/data/site";
import Image from "next/image";
import { useState } from "react";

const reviews = [
  {
    name: "Ananya Sharma",
    role: "Housewarming · Delhi NCR",
    rating: 5,
    image: "https://i.pinimg.com/736x/13/11/86/13118668ae1ef358f5935670e3235bc2.jpg",
    text: "Negi Caterers and Tiffin made our housewarming effortless. The food tasted like home, and guests kept asking for the caterer's number.",
  },
  {
    name: "Rohit Mehra",
    role: "Daily Tiffin · Delhi NCR",
    rating: 5,
    image: "https://i.pinimg.com/736x/ff/53/58/ff5358c324f5dd2d68ccfdb1414e259b.jpg",
    text: "We've used their tiffin for years. Consistent quality, on-time delivery, and thoughtful packaging every single day.",
  },
  {
    name: "Priya Nair",
    role: "Office Party · Delhi NCR",
    rating: 5,
    image: "https://i.pinimg.com/736x/82/21/b5/8221b53df22f2f65534e5f4d1a1d11c2.jpg",
    text: "Our office Diwali lunch was a hit — beautiful presentation, generous portions, and the live counter was a crowd favourite.",
  },
  {
    name: "Vikram Singh",
    role: "Anniversary · Delhi NCR",
    rating: 5,
    image: "https://i.pinimg.com/736x/d0/bd/99/d0bd99c46ee6b38c3ae9fc1e5489ac84.jpg",
    text: "Booked them for my parents' anniversary. Traditional flavours done right. Warm service from start to finish.",
  },
  {
    name: "Meera Joshi",
    role: "Pooja · Delhi NCR",
    rating: 5,
    image: "https://i.pinimg.com/1200x/ad/0e/ee/ad0eee336eaa57314e59f90e95390012.jpg",
    text: "From menu planning to cleanup, everything was smooth. Highly recommend for family poojas and festive gatherings.",
  },
  {
    name: "Aarav Kapoor",
    role: "Festival Gathering · Delhi NCR",
    rating: 5,
    image: "https://i.pinimg.com/736x/c4/a9/43/c4a943ad73bafe9e4215f1aeba2cdcfc.jpg",
    text: "Handled our festive feast with calm coordination. Guests praised the taste and the service team stayed reachable throughout.",
  },
];

const rowOne = reviews.slice(0, 3);
const rowTwo = reviews.slice(3);

export default function Testimonials() {
  const { rating, count } = site.reviews;

  return (
    <section className="overflow-hidden border-y border-line bg-ivory-deep/50 py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-display text-6xl leading-none text-terracotta/20 select-none md:text-8xl">
            “
          </span>
          <h2 className="relative font-display text-3xl font-semibold text-ink md:text-5xl">
            Real Stories from{" "}
            <span className="text-terracotta">Real Customers</span>
          </h2>
          <p className="mt-2 text-sm text-muted md:text-base">
            Get inspired by these stories.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-card px-3 py-2 shadow-sm ring-1 ring-line sm:px-4">
              <Stars value={rating} size="md" />
              <p className="text-xs font-semibold text-ink sm:text-sm">
                {rating.toFixed(1)} · {count} reviews on Google
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <MarqueeRow items={rowOne} direction="left" />
        <MarqueeRow items={rowTwo} direction="right" />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: typeof reviews;
  direction: "left" | "right";
}) {
  const loop = [...items, ...items, ...items];

  return (
    <div className="group/marquee relative overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          direction === "left"
            ? "animate-marquee-left"
            : "animate-marquee-right"
        } group-hover/marquee:[animation-play-state:paused]`}
      >
        {loop.map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <article className="flex w-[min(300px,calc(100vw-2rem))] shrink-0 flex-col rounded-2xl bg-card p-5 shadow-sm ring-1 ring-line md:w-[360px]">
      <span className="font-display text-3xl leading-none text-terracotta/50">“</span>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/85">
        {review.text}
      </p>
      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ReviewAvatar name={review.name} src={review.image} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{review.name}</p>
              <p className="truncate text-xs text-muted">{review.role}</p>
            </div>
          </div>
          <GoogleReviewBadge rating={review.rating} />
        </div>
      </div>
    </article>
  );
}

function ReviewAvatar({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  if (failed) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta/15 text-sm font-bold text-terracotta">
        {initials}
      </span>
    );
  }

  return (
    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
      <Image
        src={src}
        alt={name}
        fill
        sizes="44px"
        quality={90}
        unoptimized={src.startsWith("http")}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function Stars({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "md";
}) {
  const dim = size === "md" ? 16 : 12;
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: dim, height: dim }}
          >
            <StarPath size={dim} className="text-[#d6d3d1]" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarPath size={dim} className="text-[#f4b400]" filled />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function StarPath({
  size,
  className,
  filled = false,
}: {
  size: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.8 6.2 20.3l1.1-6.4L2.6 9.3l6.5-.9L12 2.5z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleReviewBadge({ rating }: { rating: number }) {
  return (
    <div className="shrink-0 rounded-lg bg-ivory-deep/70 px-2 py-1.5 ring-1 ring-line">
      <div className="flex items-center gap-1.5">
        <GoogleG />
        <div>
          <p className="text-[9px] leading-none font-semibold text-muted">
            Google reviews
          </p>
          <div className="mt-1">
            <Stars value={rating} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l.1.1 6.3 5.3C39 37.3 44 32 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}
