"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import s from "./hero.module.css";

export type HitKind = "cta" | "phone" | "nav" | "logo";

const KIND_CLASS: Record<HitKind, string> = {
  cta: s.cta,
  phone: s.phoneBtn,
  nav: s.nav,
  logo: s.logo,
};

/*
 * Прозрачная кликабельная зона поверх нарисованной в PNG кнопки.
 * Свет рисуют только её ::before (hover-свечение) и ::after (волна при клике),
 * в покое оба невидимы — изображение остаётся 1:1.
 */
export function HitArea({ label, kind, style }: { label: string; kind: HitKind; style: CSSProperties }) {
  // Счётчик кликов в key перезапускает CSS-анимацию вспышки даже при быстрых повторных кликах
  const [flash, setFlash] = useState(0);

  // Логотип — ссылка на главную (клиентский переход Next, без перезагрузки)
  if (kind === "logo") {
    return <Link href="/" aria-label={label} className={`${s.hit} ${s.logo}`} style={style} />;
  }

  return (
    <button
      type="button"
      aria-label={label}
      className={`${s.hit} ${KIND_CLASS[kind]}`}
      style={style}
      onPointerDown={() => setFlash((n) => n + 1)}
    >
      {flash > 0 && <span key={flash} className={s.flash} aria-hidden="true" />}
    </button>
  );
}
