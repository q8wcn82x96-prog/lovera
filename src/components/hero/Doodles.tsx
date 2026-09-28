// Нарисованные «от руки» SVG-элементы коллажа: неоновые сердца, корона, звезда, стрелка.
// Каждый контур рисуется двумя чуть смещёнными проходами — так линия выглядит живой.

type DoodleProps = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ScribbleHeart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <path
        {...stroke}
        strokeWidth={2.6}
        d="M31 54C24 44 9 35 6 23 3 12 12 5 20 7c6 1.5 9 7 10.5 12C32 12 38 5 46 6c9 1 12 10 8 19-4 10-14 18-22 29"
      />
      <path
        {...stroke}
        strokeWidth={1.7}
        opacity={0.85}
        d="M30 50C22 41 11 32 9.5 22 8 14 14 9.5 21 11c5 1 7.5 6 9 11 2-7 7-12.5 14-12 7 .5 9.5 8 6.5 15.5C47 34 38 42 30.5 51"
      />
    </svg>
  );
}

export function LoopHeart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 80" className={className} aria-hidden="true">
      <path
        {...stroke}
        strokeWidth={3}
        d="M29 76 27 62C19 52 7 41 5 28 3 17 9 9 17 10c6 1 10 6 12 13 2-8 8-14 16-13 9 1.5 12 11 8 21-4 11-13 20-23 30-3-7-5-13-4-19"
      />
    </svg>
  );
}

export function OutlineHeart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <path
        {...stroke}
        strokeWidth={3}
        d="M30 53C21 44 7 34 6 21 5.5 12 13 6.5 21 8.5c5 1.3 8 6 9 10.5C32 13 36 7.5 43 7c9-.5 13 8 10 17-3.5 11-14 20-23 29"
      />
    </svg>
  );
}

export function DoubleHeart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 70 70" className={className} aria-hidden="true">
      <path
        {...stroke}
        strokeWidth={2.4}
        d="M36 63C26 52 9 41 7 26 5.5 14 15 6 25 9c6 2 9 8 10.5 13C38 13 45 6 54 8c10 2 12 13 7 23-5 11-15 20-25 32"
      />
      <path
        {...stroke}
        strokeWidth={2}
        d="M34 57C25 48 14 39 12.5 27 11.5 18 18 12.5 25.5 14.5c5 1.5 7.5 6.5 9 11 3-7.5 8.5-12.5 16-11.5 8 1 10 9.5 6 18-4.5 9.5-13 17-21.5 26"
      />
    </svg>
  );
}

export function Crown({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden="true">
      <path {...stroke} strokeWidth={2.8} d="M9 42 5 13l15 15L32 5l11 23 16-15-5 29" />
      <path {...stroke} strokeWidth={2.8} d="M7 47c15-3 34-3.5 50-.5" />
      <path {...stroke} strokeWidth={2.2} d="M9 42c14-2 31-2.5 45 0" />
      <circle cx="5" cy="12" r="2.2" fill="currentColor" />
      <circle cx="32" cy="4.5" r="2.2" fill="currentColor" />
      <circle cx="59.5" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function Star({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 78" className={className} aria-hidden="true">
      <path
        {...stroke}
        strokeWidth={2.8}
        d="M40 4 49.5 30 77 30.5 55 47 63.5 74 40 58 16 74.5 25 47 3 30.5 30.5 30Z"
      />
      <path
        {...stroke}
        strokeWidth={1.6}
        opacity={0.8}
        d="M40.5 8 48 31.5 73 32 53 46.5 60.5 70 40 56 19 70.5 27 46.5 7 32 32 31.5Z"
      />
    </svg>
  );
}

export function CurvedArrow({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 44" className={className} aria-hidden="true">
      <path {...stroke} strokeWidth={1.8} d="M72 4c-2 20-26 33-64 33" />
      <path {...stroke} strokeWidth={1.8} d="M17 29 7 37l11 5" />
    </svg>
  );
}

export function InkHeart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 50 70" className={className} aria-hidden="true">
      <path
        {...stroke}
        strokeWidth={2.6}
        d="M24 50C16 40 6 30 5.5 20 5 11 12 6 18 9c4 2 5.5 6.5 6 10 2-7 7-12 13-11 7 1.5 9 10 5.5 18C39 34 32 42 24.5 51l-.5 16"
      />
    </svg>
  );
}

export function PenTick({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 20 30" className={className} aria-hidden="true">
      <path {...stroke} strokeWidth={1.6} d="M5 3c1 8 1 15 .5 23M5.5 17c3-2 6-3 8 0 1 2 1.5 5 3 7" />
    </svg>
  );
}

export function SmallHeart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 22" className={className} aria-hidden="true">
      <path
        {...stroke}
        strokeWidth={1.9}
        d="M12 19.5C7.5 16 3 12.5 2.8 8 2.6 4.8 5 2.8 7.6 3.2 9.8 3.5 11.2 5.5 12 7.5c.9-2.2 2.5-4.2 4.8-4.3 2.8-.1 4.7 2.3 4.3 5.2-.6 4.2-5 7.8-9.1 11.1Z"
      />
    </svg>
  );
}

export function ClockIcon({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.6" {...stroke} strokeWidth={1.8} />
      <path {...stroke} strokeWidth={1.8} d="M12 6.8V12l3.4 2.2" />
    </svg>
  );
}

export function ArrowRight({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      <path {...stroke} strokeWidth={1.8} d="M1.5 7h16M12 1.5 17.5 7 12 12.5" />
    </svg>
  );
}

export function Chevron({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 30 12" className={className} aria-hidden="true">
      <path {...stroke} strokeWidth={1.5} d="M1 1.5 15 10.5 29 1.5" />
    </svg>
  );
}
