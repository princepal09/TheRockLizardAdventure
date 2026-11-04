import { Search } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="group relative flex w-full items-center rounded-full border border-gray-800/80 bg-[#131b2e]/90 px-4 py-2.5 text-gray-300 shadow-inner transition-all duration-200 focus-within:border-sky-500 focus-within:shadow-[0_0_12px_rgba(56,189,248,0.25)]">
      {/* Search Icon with focus color transition */}
      <Search className="w-4 h-4 mr-2.5 text-gray-400 group-focus-within:text-sky-400 transition-colors shrink-0" />
      
      {/* Input Field */}
      <input
        type="text"
        aria-label="Search Kumaon routes"
        placeholder="Search Kumaon routes (Pindari, Kafni, Milam)..."
        className="min-w-0 flex-1 truncate bg-transparent text-xs tracking-wide text-white placeholder:text-gray-500 focus:outline-none"
      />

      {/* Subtle Keyboard Shortcut Badge */}
      <div className="hidden sm:flex items-center ml-2 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-gray-800/80 border border-gray-700/60 rounded">
        /
      </div>
    </div>
  );
};

export default SearchBar;
