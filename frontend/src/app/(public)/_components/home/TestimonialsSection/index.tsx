import { Suspense } from "react";
import { getGoogleReviews } from "@/lib/api/google-reviews";
import Testimonials from "./Testimonials";

async function TestimonialContent() {
  const data = await getGoogleReviews().catch(() => null);
  return <Testimonials data={data} reviewUrl={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL} />;
}

export default function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-title" className="bg-[#f3f0e9] px-4 py-10 text-slate-900 sm:px-6 sm:py-14 xl:px-10">
      <Suspense fallback={<Testimonials data={null} loading />}>
        <TestimonialContent />
      </Suspense>
    </section>
  );
}
