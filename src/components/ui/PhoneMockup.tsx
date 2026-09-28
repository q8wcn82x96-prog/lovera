import type { ReactNode } from "react";

/** Аккуратный корпус смартфона для демонстрации истории */
export function PhoneMockup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19.2] rounded-[3.1rem] bg-[#0a090b] p-[9px] shadow-[0_40px_120px_-30px_rgb(232_52_90/0.35),0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[3.1rem] ring-1 ring-inset ring-white/[0.06]" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-ink [transform:translateZ(0)]">
        {children}
        <div className="pointer-events-none absolute left-1/2 top-[10px] z-30 h-[22px] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
