import Image from "next/image";
import { HitArea, type HitKind } from "./HitArea";
import s from "./hero.module.css";

/*
 * Первый экран — финальный макет (lovera-hero-final.png, 16:9), разделённый на слои:
 * фон без конверта (неон в нём приглушён на 20%) + неоновые оверлеи, которые возвращают
 * неону исходную яркость и мягко «дышат», + парящая группа «конверт + петли ленты».
 * В покое все слои складываются в исходное изображение 1:1.
 * Поверх лежат только прозрачные кликабельные зоны. Все координаты — в процентах
 * от изображения, поэтому картинка, конверт и зоны масштабируются как одна система.
 */

// ?v= — файлы уже заменялись под теми же именами, версия сбрасывает кэш браузера
const ASSET_V = "3";
const HERO_BG_SRC = `/assets/hero/lovera-hero-bg.png?v=${ASSET_V}`;
const ENVELOPE_SRC = `/assets/hero/lovera-hero-envelope.png?v=${ASSET_V}`;
const HERO_W = 3840;
const HERO_H = 2160;
// Слой конверта: 1723×778 px, левый верхний угол в (1081, 834) исходного 3840×2160
const ENVELOPE_BOX = { left: 28.151, top: 38.611, width: 44.87, height: 36.019 };

type Box = { left: number; top: number; width: number; height: number };

// Петли ленты вокруг конверта — в процентах от слоя конверта; origin — точка, где петля
// уходит за конверт / выходит из-под него (там колыхание равно нулю, лента не рвётся)
const RIBBON_LOOPS: (Box & { src: string; origin: string; className: string; delay: number })[] = [
  { src: "left", left: 0.116, top: 25.45, width: 10.795, height: 46.787, origin: "87.6% 54.1%", className: s.ribbonBack, delay: -1.3 },
  { src: "top", left: 75.334, top: 0.257, width: 17.121, height: 24.422, origin: "29.5% 66.3%", className: s.ribbonBack, delay: -3.4 },
  { src: "right", left: 89.089, top: 51.157, width: 10.795, height: 41.645, origin: "0.5% 41.4%", className: s.ribbonFront, delay: -2.2 },
];

type NeonGroup = "left" | "photo" | "right" | "small";

// Существующие неоновые акценты (координаты — % от 3840×2160). Четыре группы с разными
// периодами, у каждого элемента своя фаза, чтобы сцена никогда не «моргала» целиком
const NEON: (Box & { src: string; group: NeonGroup; delay: number })[] = [
  { src: "crown", group: "left", delay: -0.8, left: 10.156, top: 8.796, width: 4.948, height: 6.481 },
  { src: "strip-heart", group: "right", delay: -3.7, left: 82.292, top: 17.593, width: 3.646, height: 6.481 },
  { src: "phone-heart", group: "right", delay: -0.9, left: 94.792, top: 50, width: 5.208, height: 8.333 },
  { src: "city-heart", group: "photo", delay: -2.1, left: 6.25, top: 43.519, width: 4.948, height: 8.796 },
  { src: "star", group: "photo", delay: -4.4, left: 14.583, top: 58.796, width: 5.99, height: 8.333 },
  { src: "corner-heart", group: "small", delay: -2.6, left: 86.719, top: 89.815, width: 4.427, height: 7.87 },
  { src: "cassette", group: "left", delay: -2.9, left: 0, top: 64.352, width: 19.271, height: 28.704 },
  { src: "glass-heart", group: "photo", delay: -0.6, left: 17.188, top: 64.815, width: 9.896, height: 13.889 },
  { src: "red-glass", group: "left", delay: -1.7, left: 0, top: 0, width: 9.375, height: 12.037 },
  { src: "small-heart", group: "small", delay: -1.4, left: 78.385, top: 55.093, width: 2.865, height: 4.63 },
  { src: "pendant", group: "small", delay: -0.2, left: 77.604, top: 60.185, width: 3.906, height: 6.944 },
];

const NEON_GROUP: Record<NeonGroup, string> = {
  left: s.neonLeft,
  photo: s.neonPhoto,
  right: s.neonRight,
  small: s.neonSmall,
};

const pct = (b: Box) => ({ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` });

type Hit = {
  label: string;
  kind: HitKind;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
};

// Замерено по пикселям lovera-hero-final.png (3840×2160), проценты от размеров изображения
const HITS: Hit[] = [
  { label: "Lovera — на главную", kind: "logo", left: 13.229, top: 1.852, width: 8.385, height: 3.750 },
  { label: "Как это работает", kind: "nav", left: 36.406, top: 3.148, width: 7.995, height: 2.037 },
  { label: "Примеры", kind: "nav", left: 48.151, top: 3.148, width: 4.453, height: 2.037 },
  { label: "Отзывы", kind: "nav", left: 56.797, top: 3.148, width: 3.698, height: 2.037 },
  { label: "Создать приглашение", kind: "cta", left: 72.448, top: 1.852, width: 15.156, height: 4.491 },
  { label: "Создать приглашение", kind: "cta", left: 36.589, top: 76.528, width: 26.406, height: 6.713 },
  // Кнопки на экране телефона повёрнуты вместе с телефоном
  { label: "Да", kind: "phone", left: 84.992, top: 72.361, width: 9.557, height: 4.444, rotate: 21.2 },
  { label: "Всегда", kind: "phone", left: 83.190, top: 77.500, width: 9.557, height: 4.444, rotate: 21.2 },
];

export function Hero() {
  return (
    <section className={s.hero} aria-label="Lovera — пригласи её не как все">
      <div className={s.scene}>
        <Image
          src={HERO_BG_SRC}
          alt="Lovera. Пригласи её не как все. Создай приглашение, которое заставит её улыбнуться."
          width={HERO_W}
          height={HERO_H}
          priority
          draggable={false}
          className={s.image}
        />
        {NEON.map((n) => (
          <div
            key={n.src}
            className={`${s.neon} ${NEON_GROUP[n.group]}`}
            style={{ ...pct(n), animationDelay: `${n.delay}s` }}
            aria-hidden="true"
          >
            <Image src={`/assets/hero/neon/${n.src}.png?v=${ASSET_V}`} alt="" fill sizes="20vw" draggable={false} />
          </div>
        ))}
        {/* floating-envelope-group: парит вся группа, поэтому конверт и лента никогда не расходятся */}
        <div className={s.envelopeGroup} style={pct(ENVELOPE_BOX)} aria-hidden="true">
          <span className={s.envelopeShadow} />
          {RIBBON_LOOPS.map((loop) => (
            <div
              key={loop.src}
              className={`${s.loop} ${loop.className}`}
              style={{ ...pct(loop), transformOrigin: loop.origin, animationDelay: `${loop.delay}s` }}
            >
              <Image src={`/assets/hero/lovera-hero-ribbon-${loop.src}.png?v=${ASSET_V}`} alt="" fill sizes="10vw" draggable={false} />
            </div>
          ))}
          <Image src={ENVELOPE_SRC} alt="" fill sizes="45vw" priority draggable={false} className={s.envelopeImg} />
        </div>
        {HITS.map((hit, i) => (
          // Действий у этих кнопок пока нет — как и в предыдущей версии первого экрана
          <HitArea
            key={i}
            label={hit.label}
            kind={hit.kind}
            style={{
              left: `${hit.left}%`,
              top: `${hit.top}%`,
              width: `${hit.width}%`,
              height: `${hit.height}%`,
              transform: hit.rotate ? `rotate(${hit.rotate}deg)` : undefined,
            }}
          />
        ))}
      </div>
    </section>
  );
}
