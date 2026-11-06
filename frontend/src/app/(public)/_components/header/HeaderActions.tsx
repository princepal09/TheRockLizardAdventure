import { Handshake } from "lucide-react";
import Link from "next/link";

import ChooseTrek from "./ChooseTrek";

const HeaderActions = ({ onNavigate }: { onNavigate?: () => void }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ChooseTrek onNavigate={onNavigate} />

      <Link
        href="/collaborations"
        onNavigate={onNavigate}
        className="flex whitespace-nowrap text-sky-400 items-center gap-2 bg-[#131b2e] border border-gray-700/60 hover:bg-[#1a253d] text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Handshake aria-hidden="true" className="size-4 text-sky-400" />
        Collaborations
      </Link>
    </div>
  );
};

export default HeaderActions;
