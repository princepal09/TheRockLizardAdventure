import { ChevronDown, Plane } from "lucide-react";
import React from "react";

const HeaderActions = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Primary CTA Button */}
      <button
        type="button"
        className="flex items-center gap-2 whitespace-nowrap bg-[#ff5722] hover:bg-[#f4511e] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
      >
        Choose Trek
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Secondary Action Button */}
      <button
        type="button"
        className="flex whitespace-nowrap text-sky-400 items-center gap-2 bg-[#131b2e] border border-gray-700/60 hover:bg-[#1a253d] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Plane className="w-4 h-4 text-sky-400 rotate-[-45deg]" />
        B2B Showcase
      </button>
    </div>
  );
};

export default HeaderActions;
