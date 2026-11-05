"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pause,
  Play,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  forwardRef,
  type ReactNode,
} from "react";
import type { ReactGoogleReview } from "react-google-reviews";

const controlClass =
  "grid size-10 shrink-0 place-items-center rounded-full border border-stone-300 bg-[#fffefa] text-slate-700 transition-colors hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800";

type SlideMotion = { direction: number; horizontal: boolean };

const slideVariants: Variants = {
  enter: ({ direction, horizontal }: SlideMotion) => ({
    x: horizontal ? `${direction * 100}%` : 0,
    y: horizontal ? 0 : `${-direction * 100}%`,
    opacity: 0,
  }),
  visible: { x: 0, y: 0, opacity: 1 },
  exit: ({ direction, horizontal }: SlideMotion) => ({
    x: horizontal ? `${-direction * 100}%` : 0,
    y: horizontal ? 0 : `${direction * 100}%`,
    opacity: 0,
  }),
};

function subscribeToMobile(notify: () => void) {
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

const getMobileSnapshot = () => window.matchMedia("(max-width: 767px)").matches;
const getServerSnapshot = () => false;

type ReviewCarouselProps = {
  reviews: ReactGoogleReview[];
  renderReview: (review: ReactGoogleReview, index: number) => ReactNode;
};

const ReviewSlide = forwardRef<HTMLDivElement, {
  children: ReactNode;
  page: number;
  count: number;
  direction: number;
  horizontal: boolean;
  reduceMotion: boolean;
  layout?: boolean;
}>(function ReviewSlide({
  children,
  page,
  count,
  direction,
  horizontal,
  reduceMotion,
  layout = false,
}, ref) {
  const isPresent = useIsPresent();
  return (
    <motion.div
      ref={ref}
      layout={layout ? "position" : false}
      role="group"
      aria-roledescription="slide"
      aria-label={`${page + 1} of ${count}`}
      inert={!isPresent}
      aria-hidden={!isPresent}
      custom={{ direction, horizontal }}
      variants={slideVariants}
      initial={reduceMotion ? false : "enter"}
      animate="visible"
      exit="exit"
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeInOut" }}
      className="space-y-3"
    >
      {children}
    </motion.div>
  );
});

export default function ReviewCarousel({
  reviews,
  renderReview,
}: ReviewCarouselProps) {
  const mobile = useSyncExternalStore(
    subscribeToMobile,
    getMobileSnapshot,
    getServerSnapshot,
  );
  return (
    <ResponsiveReviewCarousel
      key={String(mobile)}
      reviews={reviews}
      renderReview={renderReview}
      horizontal={mobile}
    />
  );
}

function ResponsiveReviewCarousel({
  reviews,
  renderReview,
  horizontal,
}: ReviewCarouselProps & {
  horizontal: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [{ page, direction }, setPosition] = useState({
    page: 0,
    direction: 1,
  });
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const pageCount = reviews.length;
  const selected = pageCount ? page % pageCount : 0;
  const visibleCount = horizontal ? 1 : Math.min(3, pageCount);
  // Reverse the visible window so advancing adds one card at the top.
  const visibleIndices = Array.from({ length: visibleCount }, (_, index) =>
    (selected + visibleCount - 1 - index) % pageCount,
  );
  const playing = !paused && !hovered && !focused && reduceMotion === false;

  const move = useCallback(
    (step: number) => {
      if (pageCount < 2) return;
      setPosition((current) => ({
        page: (current.page + step + pageCount) % pageCount,
        direction: step,
      }));
    },
    [pageCount],
  );

  useEffect(() => {
    if (pageCount < 2 || !playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) move(1);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [move, pageCount, playing, selected]);

  function navigate(step: number) {
    setPaused(true);
    move(step);
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Traveller reviews"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div
        tabIndex={pageCount > 1 ? 0 : undefined}
        aria-label={
          horizontal
            ? "Review slides. Use left and right arrow keys to browse."
            : "Review slides. Use up and down arrow keys to browse."
        }
        className="overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-800"
        onKeyDown={(event) => {
          const previousKey = horizontal ? "ArrowLeft" : "ArrowUp";
          const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
          if (event.key === previousKey || event.key === nextKey) {
            event.preventDefault();
            navigate(event.key === previousKey ? -1 : 1);
          }
        }}
      >
        {horizontal ? <AnimatePresence
          initial={false}
          mode="wait"
          custom={{ direction, horizontal }}
        >
          <ReviewSlide
            key={selected}
            page={selected}
            count={pageCount}
            direction={direction}
            horizontal={horizontal}
            reduceMotion={reduceMotion !== false}
          >
            {renderReview(reviews[selected], selected)}
          </ReviewSlide>
        </AnimatePresence> : (
          <div className="relative space-y-3">
            <AnimatePresence initial={false} mode="popLayout" custom={{ direction, horizontal: false }}>
              {visibleIndices.map((index) => (
                <ReviewSlide
                  key={reviews[index].reviewId ?? index}
                  page={index}
                  count={pageCount}
                  direction={direction}
                  horizontal={false}
                  reduceMotion={reduceMotion !== false}
                  layout={reduceMotion === false}
                >
                  {renderReview(reviews[index], index)}
                </ReviewSlide>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      {pageCount > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p
            aria-live={playing ? "off" : "polite"}
            aria-atomic="true"
            className="font-mono text-[10px] text-slate-500"
          >
            {horizontal
              ? `Review ${selected + 1}`
              : `${visibleCount} reviews shown · ${selected + 1}`}{" "}
            of {reviews.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous reviews"
              onClick={() => navigate(-1)}
              className={controlClass}
            >
              {horizontal ? (
                <ChevronLeft aria-hidden="true" className="size-4" />
              ) : (
                <ChevronUp aria-hidden="true" className="size-4" />
              )}
            </button>
            {reduceMotion === false && (
              <button
                type="button"
                aria-label={
                  paused ? "Play review carousel" : "Pause review carousel"
                }
                onClick={() => setPaused(!paused)}
                className={controlClass}
              >
                {paused ? (
                  <Play aria-hidden="true" className="size-3.5" />
                ) : (
                  <Pause aria-hidden="true" className="size-3.5" />
                )}
              </button>
            )}
            <button
              type="button"
              aria-label="Next reviews"
              onClick={() => navigate(1)}
              className={controlClass}
            >
              {horizontal ? (
                <ChevronRight aria-hidden="true" className="size-4" />
              ) : (
                <ChevronDown aria-hidden="true" className="size-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
