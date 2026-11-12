"use client";

import dynamic from "next/dynamic";

const TripDescriptionField = dynamic(() => import("./TripDescriptionEditor"), {
  ssr: false,
  loading: () => (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">Description</p>
      <div
        className="min-h-[154px] rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-600"
        role="status"
      >
        Loading description editor…
      </div>
    </div>
  ),
});

export default TripDescriptionField;
