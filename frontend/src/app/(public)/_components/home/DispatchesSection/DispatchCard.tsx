import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Card } from "@/components/ui/card";

type Dispatch = {
  title: string;
  category: string;
  image: string;
  detail: string;
  action: string;
  summary?: string;
};

export default function DispatchCard({
  dispatch,
  featured = false,
}: {
  dispatch: Dispatch;
  featured?: boolean;
}) {
  return (
    <Card
      className={`gap-0 border border-stone-200 bg-[#fffefa] py-0! text-slate-900 ring-0! ${featured ? "rounded-2xl" : "rounded-xl"}`}
    >
      <article
        className={
          featured ? "flex h-full flex-col" : "flex items-start gap-3 p-3"
        }
      >
        <div
          className={`relative shrink-0 overflow-hidden bg-slate-800 ${featured ? "aspect-[2.35]" : "size-16 rounded-lg sm:size-20"}`}
        >
          <Image
            src={dispatch.image}
            alt=""
            fill
            sizes={featured ? "(min-width: 768px) 55vw, 100vw" : "80px"}
            className="object-cover"
          />
          {featured && (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-slate-950/75 to-transparent"
              />
              <span className="absolute bottom-3 left-3 font-mono text-[10px] font-semibold tracking-widest text-white uppercase">
                Pindari Glacier · Route notes
              </span>
            </>
          )}
        </div>
        <div
          className={
            featured ? "flex flex-1 flex-col p-4 sm:p-5" : "min-w-0 self-center"
          }
        >
          {!featured && (
            <p className="mb-1 font-mono text-[10px] tracking-wide text-slate-500 uppercase">
              {dispatch.category}
            </p>
          )}
          <h3
            className={`leading-snug font-bold tracking-tight ${featured ? "text-lg sm:text-xl" : "text-sm"}`}
          >
            {dispatch.title}
          </h3>
          {dispatch.summary && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {dispatch.summary}
            </p>
          )}
          <div className={featured ? "mt-auto pt-4" : "mt-1"}>
            {featured && (
              <p className="border-t border-stone-200 pt-3 font-mono text-[10px] tracking-wide text-slate-500">
                Almora Editorial Desk
              </p>
            )}
            <details className={featured ? "mt-2" : undefined}>
              <summary
                className={`flex w-fit cursor-pointer list-none items-center gap-1 rounded-sm text-xs font-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden ${featured ? "text-orange-800 sm:ml-auto" : "text-sky-800"}`}
              >
                {dispatch.action}
                <ArrowRight aria-hidden="true" className="size-3" />
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {dispatch.detail}
              </p>
            </details>
          </div>
        </div>
      </article>
    </Card>
  );
}
