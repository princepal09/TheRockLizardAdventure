"use client";

import { MessageSquareQuote, Star } from "lucide-react";
import { useState } from "react";
import { ReactGoogleReviews, type ReactGoogleReview } from "react-google-reviews";
import "react-google-reviews/dist/index.css";

import type { GoogleReviewsData } from "@/lib/api/google-reviews";
import ReviewCarousel from "./ReviewCarousel";

function safeUrl(value?: string | null) {
  if (!value) return undefined;
  const url = URL.parse(value);
  return url?.protocol === "https:" ? url.href : undefined;
}

function Stars({ rating, large = false }: { rating: number; large?: boolean }) {
  return (
    <span
      role="img"
      aria-label={`${Number(rating.toFixed(1))} out of 5 stars`}
      className="inline-flex gap-0.5 text-amber-500"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={large ? "size-5" : "size-3"}
          fill={index < Math.round(rating) ? "currentColor" : "none"}
          strokeWidth={large ? 1.5 : 1}
        />
      ))}
    </span>
  );
}

const avatarColors = [
  "bg-sky-100 text-sky-700",
  "bg-orange-100 text-orange-700",
  "bg-slate-100 text-slate-600",
];

function ReviewCard({ review, index }: { review: ReactGoogleReview; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const name = review.reviewer.displayName || "Google reviewer";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const avatar = safeUrl(review.reviewer.profilePhotoUrl);
  const date = review.createTime ? new Date(review.createTime) : null;
  const validDate = date && Number.isFinite(date.getTime());
  const comment = review.comment.trim();

  return (
    <article className="rounded-2xl border border-[#e6e1d8] bg-[#fffefa] p-5 shadow-[0_1px_2px_#0f172a04] sm:p-6">
      <div className="flex items-start gap-3">
        <div
          className={`relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full font-mono text-xs font-bold ${avatarColors[index % avatarColors.length]}`}
        >
          <span aria-hidden="true">{initials}</span>
          {avatar && !imageFailed && (
            // Reviewer avatars are served directly by Google and may change hosts.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-sm font-bold tracking-tight break-words text-slate-800">{name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
            <span className="font-mono">Google review</span>
            {validDate && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={date.toISOString()} className="font-mono">
                  {date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Kolkata",
                  })}
                </time>
              </>
            )}
          </div>
        </div>
        <span className="shrink-0 pt-1">
          <Stars rating={review.starRating} />
        </span>
      </div>
      <p className="mt-3 break-words text-sm leading-relaxed text-slate-600 italic">
        {comment
          ? `“${!expanded && comment.length > 180 ? `${comment.slice(0, 180).trimEnd()}…` : comment}”`
          : "This traveller left a star rating without a written review."}
      </p>
      {comment.length > 180 && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="mt-2 min-h-6 text-xs font-semibold text-orange-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
        >
          {expanded ? "Read less" : "Read full review"}
        </button>
      )}
    </article>
  );
}

export default function Testimonials({
  data,
  reviewUrl,
  loading = false,
}: {
  data: GoogleReviewsData | null;
  reviewUrl?: string;
  loading?: boolean;
}) {
  const writeUrl = safeUrl(reviewUrl);
  const profileUrl = safeUrl(data?.profileUrl) ?? writeUrl;

  return (
    <div className="mx-auto grid max-w-7xl items-start gap-5 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.62fr)] lg:gap-7">
      <div className="rounded-[22px] border border-[#e6e1d8] bg-[#fffefa] p-6 shadow-[0_1px_2px_#0f172a04] sm:p-7">
        <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-orange-700 uppercase">
          Authentic dispatches
        </p>
        <h2
          id="testimonials-title"
          className="mt-2 max-w-64 text-[clamp(1.6rem,2.5vw,2rem)] leading-[1.08] font-extrabold tracking-tight"
        >
          Voices From The Ridgeline
        </h2>
        <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500">
          Direct quotes and real experiences from trekkers who explored the mountains with our
          Almora team.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-[#f0f5fa] px-3 py-5 text-center">
          {data && data.totalReviewCount > 0 ? (
            <>
              <Stars rating={data.averageRating} large />
              <p className="mt-1 font-mono text-[clamp(1.8rem,3vw,2.5rem)] leading-tight font-bold tracking-tight">
                {data.averageRating.toFixed(1)} / 5.0
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-600">Google reviews</p>
              <p className="mt-2 font-mono text-[10px] leading-relaxed text-slate-500">
                Based on {data.totalReviewCount.toLocaleString("en-IN")}{" "}
                {data.totalReviewCount === 1 ? "review" : "reviews"}
              </p>
            </>
          ) : (
            <p role="status" className="py-5 text-sm text-slate-600">
              {loading ? "Loading Google reviews…" : "Read our traveller reviews on Google."}
            </p>
          )}
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[11px] font-semibold text-slate-600 underline underline-offset-4 hover:text-orange-800"
            >
              View on Google <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>

        <div className="mt-6 border-t border-stone-200 pt-5">
          {writeUrl ? (
            <a
              href={writeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ffdac9] px-3 py-3 text-center text-xs font-bold text-[#60351f] transition-colors hover:bg-[#ffccb4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-800"
            >
              <MessageSquareQuote aria-hidden="true" className="size-4 shrink-0" /> Write a Mountain
              Review
              <span className="sr-only">on Google (opens in a new tab)</span>
            </a>
          ) : (
            <p className="text-xs text-slate-500">
              Find Rocklizard Adventure on Google to share your experience.
            </p>
          )}
        </div>
      </div>

      <div className="min-w-0 space-y-3">
        {loading ? (
          <div role="status" className="space-y-3">
            <span className="sr-only">Loading traveller reviews</span>
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-36 rounded-2xl border border-[#e6e1d8] bg-[#fffefa] motion-safe:animate-pulse"
              />
            ))}
          </div>
        ) : data?.reviews.length ? (
          <ReactGoogleReviews
            layout="custom"
            reviews={data.reviews}
            structuredData={false}
            renderer={(reviews) => (
              <ReviewCarousel
                reviews={reviews}
                renderReview={(review, index) => <ReviewCard review={review} index={index} />}
              />
            )}
          />
        ) : (
          <div
            role="status"
            className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-[#e6e1d8] bg-[#fffefa] p-8 text-center"
          >
            <MessageSquareQuote aria-hidden="true" className="size-7 text-orange-700" />
            <p className="text-sm text-slate-600">
              {data
                ? "The next mountain story could be yours."
                : "Traveller reviews are temporarily unavailable."}
            </p>
            {profileUrl && (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-orange-800 underline underline-offset-4"
              >
                Visit us on Google <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
        {!loading && data && (
          <p className="px-1 text-right text-[10px] text-slate-500">
            Powered by{" "}
            <a
              href="https://featurable.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Featurable
            </a>{" "}
            · Traveller reviews
          </p>
        )}
      </div>
    </div>
  );
}
