import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 font-display text-[1.7rem] font-semibold leading-none tracking-tight text-milk ${className}`}
    >
      <span className="relative inline-block size-2 rounded-full bg-rose shadow-[0_0_14px_2px_rgb(232_52_90/0.6)] transition-transform duration-300 group-hover:scale-125" />
      Lovera
    </Link>
  );
}
