export default function CopyrightBar() {
  return (
    <div className="space-y-1 border-t border-slate-800 py-3 text-center text-slate-400">
      <p className="text-[10px]">
        © 2026 Rock Lizard Adventure Almora. Rated 5.0 ★ across 150+ verified summiteers. All rights
        reserved.
      </p>
      <p className="text-xs">
        The code behind the climb <span aria-hidden="true">·</span>{" "}
        <a
          href="https://princepal.vercel.app/"
          className="rounded-sm text-slate-200 underline decoration-slate-500 underline-offset-2 hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          Prince Pal
        </a>
      </p>
    </div>
  );
}
