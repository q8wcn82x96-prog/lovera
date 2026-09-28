"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  GENERIC_QUIZ,
  byGender,
  genitive,
  occasionLabel,
  type Photo,
  type Story,
} from "@/lib/story";

/**
 * full     — полноэкранная история получателя (/s/demo)
 * embedded — живой пример внутри телефона на главной
 * preview  — предпросмотр в конструкторе
 */
export type PlayerMode = "full" | "embedded" | "preview";

const SCREENS = ["cover", "moment1", "moment2", "quiz", "collage", "before", "final"] as const;
const LAST = SCREENS.length - 1;

export function StoryPlayer({ story, mode = "full" }: { story: Story; mode?: PlayerMode }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const screen = SCREENS[index];
  const warm = story.theme === "warm";
  const quizLocked = screen === "quiz" && answer === null;
  const tapNavigation = index > 0 && index < LAST;

  const go = useCallback((delta: number) => {
    setIndex((i) => Math.min(LAST, Math.max(0, i + delta)));
  }, []);

  const next = useCallback(() => {
    if (!quizLocked) go(1);
  }, [go, quizLocked]);

  const restart = () => {
    setAnswer(null);
    setIndex(0);
  };

  // Подгружаем все фотографии заранее, чтобы переходы были мгновенными
  useEffect(() => {
    story.photos.forEach((p) => {
      const img = new window.Image();
      img.src = p.src;
    });
  }, [story.photos]);

  // Стрелки на клавиатуре — только для полноэкранного режима
  useEffect(() => {
    if (mode !== "full") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (index === 0 || tapNavigation) next();
      }
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, go, next, index, tapNavigation]);

  const onTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tapNavigation) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (x < 0.3) go(-1);
    else next();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || !tapNavigation) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else go(-1);
  };

  const p = story.photos;
  const g = story.senderGender;
  const rest = p.slice(3);
  const collage = rest.length >= 2 ? rest : p.slice(0, 4);

  const top = mode === "full" ? "env(safe-area-inset-top, 0px)" : "30px";
  const bottom = mode === "full" ? "env(safe-area-inset-bottom, 0px)" : "10px";

  const theme = warm ? "bg-paper text-cocoa grain" : "bg-ink text-milk";

  let content: ReactNode = null;
  switch (screen) {
    case "cover":
      content = <Cover story={story} warm={warm} onOpen={() => go(1)} />;
      break;
    case "moment1":
      content = (
        <Moment
          photo={p[0]}
          warm={warm}
          text={p[0]?.caption.trim() || "Всё началось с одного обычного дня…"}
          onNext={next}
          rotate={-2}
        />
      );
      break;
    case "moment2":
      content = (
        <Moment
          photo={p[1] ?? p[0]}
          warm={warm}
          text={
            p[1]?.caption.trim() ||
            `А потом появился момент, который я почему-то ${byGender(g, "запомнил", "запомнила")} навсегда.`
          }
          onNext={next}
          rotate={2}
        />
      );
      break;
    case "quiz":
      content = (
        <QuizScreen
          story={story}
          photo={p[2] ?? p[0]}
          warm={warm}
          answer={answer}
          onAnswer={setAnswer}
          onNext={next}
        />
      );
      break;
    case "collage":
      content = <Collage photos={collage} warm={warm} onNext={next} />;
      break;
    case "before":
      content = (
        <Before
          warm={warm}
          text={`И есть кое-что, что я давно ${byGender(g, "хотел", "хотела")} тебе сказать…`}
          onNext={next}
        />
      );
      break;
    case "final":
      content = <Final story={story} warm={warm} mode={mode} onRestart={restart} />;
      break;
  }

  return (
    <div
      className={`relative h-full w-full select-none overflow-hidden [container-type:size] ${theme}`}
      style={{ "--top": top, "--bottom": bottom } as CSSProperties}
      onClick={onTap}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div key={index} className="absolute inset-0 animate-screen-in">
        {content}
      </div>

      {index > 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-[4cqw] pt-[calc(var(--top)+10px)]">
          <div className="flex gap-1">
            {SCREENS.slice(1).map((s, i) => (
              <div
                key={s}
                className={`h-[3px] flex-1 overflow-hidden rounded-full ${warm ? "bg-cocoa/15" : "bg-white/20"}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${warm ? "bg-cocoa" : "bg-milk"}`}
                  style={{ width: i < index ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Назад"
            className={`pointer-events-auto mt-3 grid size-9 place-items-center rounded-full backdrop-blur-md transition-colors ${
              warm ? "bg-cocoa/10 text-cocoa hover:bg-cocoa/15" : "bg-black/25 text-milk hover:bg-black/40"
            }`}
          >
            <Chevron dir="left" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- экраны ---------- */

function Cover({ story, warm, onOpen }: { story: Story; warm: boolean; onOpen: () => void }) {
  const verb = byGender(story.senderGender, "приготовил", "приготовила");
  const occasion = story.occasion !== "just" ? occasionLabel(story.occasion) : "Для тебя";
  const [a, b] = story.photos;

  return (
    <div className="absolute inset-0">
      {warm ? (
        <div className="absolute inset-x-0 top-[calc(var(--top)+14cqh)] flex justify-center">
          <div className="relative h-[34cqh] w-[62cqw]">
            {b && (
              <Polaroid
                photo={b}
                className="absolute right-0 top-[2cqh] w-[min(40cqw,24cqh)] animate-drop"
                style={{ "--r": "7deg", animationDelay: "0.25s" } as CSSProperties}
              />
            )}
            {a && (
              <Polaroid
                photo={a}
                className="absolute left-0 top-0 w-[min(42cqw,25cqh)] animate-drop"
                style={{ "--r": "-6deg" } as CSSProperties}
              />
            )}
          </div>
        </div>
      ) : (
        a && (
          <>
            <Image
              src={a.src}
              alt=""
              fill
              sizes="480px"
              priority
              className="object-cover opacity-80 animate-kenburns"
            />
            <div className="absolute inset-0 bg-linear-to-b from-ink/20 via-ink/60 to-ink" />
            <div className="absolute left-1/2 top-[30%] size-[90cqw] -translate-x-1/2 rounded-full bg-rose/25 blur-[70px] animate-breathe" />
          </>
        )
      )}

      <div className="absolute inset-x-0 bottom-0 px-[8cqw] pb-[calc(var(--bottom)+8cqw)]">
        <p
          className={`mb-[4cqw] text-[3cqw] font-semibold uppercase tracking-[0.25em] animate-fade-up ${
            warm ? "text-rose" : "text-milk/55"
          }`}
        >
          {occasion}
        </p>
        <h1 className="font-display text-[10.5cqw] font-medium leading-[1.02] tracking-[-0.01em]">
          <span className="block animate-fade-up italic text-rose" style={{ animationDelay: "0.15s" }}>
            {story.recipient || "Любимая"},
          </span>
          <span className="block animate-fade-up" style={{ animationDelay: "0.35s" }}>
            {story.sender || "Кто-то"} кое-что
          </span>
          <span className="block animate-fade-up" style={{ animationDelay: "0.55s" }}>
            {verb} для тебя.
          </span>
        </h1>
        {story.intro.trim() && (
          <p
            className={`mt-[5cqw] font-display text-[5cqw] italic leading-snug animate-fade-up ${
              warm ? "text-cocoa/70" : "text-milk/70"
            }`}
            style={{ animationDelay: "0.8s" }}
          >
            «{story.intro.trim()}»
          </p>
        )}
        <p
          className={`mt-[5cqw] text-[3.4cqw] animate-fade-up ${warm ? "text-cocoa/55" : "text-milk/50"}`}
          style={{ animationDelay: "1s" }}
        >
          Это займёт всего пару минут.
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="btn btn-primary mt-[6cqw] w-full animate-fade-up"
          style={{ animationDelay: "1.15s" }}
        >
          Открыть
        </button>
      </div>
    </div>
  );
}

function Moment({
  photo,
  text,
  warm,
  onNext,
  rotate,
}: {
  photo?: Photo;
  text: string;
  warm: boolean;
  onNext: () => void;
  rotate: number;
}) {
  if (warm) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[8cqw] pb-[calc(var(--bottom)+6cqw)] pt-[calc(var(--top)+16cqw)]">
        {photo && (
          <Polaroid
            photo={photo}
            className="w-[min(78cqw,44cqh)] animate-drop"
            style={{ "--r": `${rotate}deg` } as CSSProperties}
            aspect="aspect-[4/5]"
          />
        )}
        <p
          className="mt-[8cqw] text-center font-display text-[7.4cqw] font-medium leading-[1.15] animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          {text}
        </p>
        <NextButton warm onClick={onNext} delay={0.9} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {photo && (
        <div className="absolute inset-0 overflow-hidden">
          <Image src={photo.src} alt="" fill sizes="480px" className="object-cover animate-kenburns" />
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/35 to-ink/25" />
      <div className="absolute inset-x-0 bottom-0 px-[8cqw] pb-[calc(var(--bottom)+8cqw)]">
        <p
          className="font-display text-[8.6cqw] font-medium leading-[1.1] animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          {text}
        </p>
        <NextButton onClick={onNext} delay={0.9} />
      </div>
    </div>
  );
}

function QuizScreen({
  story,
  photo,
  warm,
  answer,
  onAnswer,
  onNext,
}: {
  story: Story;
  photo?: Photo;
  warm: boolean;
  answer: number | null;
  onAnswer: (i: number) => void;
  onNext: () => void;
}) {
  const quiz = story.quiz ?? GENERIC_QUIZ;
  const answered = answer !== null;
  const right = quiz.correctIndex === null || answer === quiz.correctIndex;
  const hint = !story.quiz && photo?.caption.trim();

  return (
    <div className="absolute inset-0 flex flex-col">
      {warm ? (
        <div className="flex flex-1 items-end justify-center pt-[calc(var(--top)+16cqw)]">
          {photo && (
            <Polaroid
              photo={photo}
              className="w-[min(58cqw,30cqh)] animate-drop"
              style={{ "--r": "-3deg" } as CSSProperties}
            />
          )}
        </div>
      ) : (
        <div className="relative flex-1">
          {photo && (
            <div className="absolute inset-0 overflow-hidden">
              <Image src={photo.src} alt="" fill sizes="480px" className="object-cover animate-kenburns" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-ink/30" />
        </div>
      )}

      <div className="px-[8cqw] pb-[calc(var(--bottom)+7cqw)] pt-[5cqw]">
        {hint && (
          <p className={`mb-[2cqw] text-[3.4cqw] ${warm ? "text-cocoa/55" : "text-milk/55"}`}>{hint}</p>
        )}
        <p className="font-display text-[8.6cqw] font-medium leading-[1.1] animate-fade-up">
          {quiz.question}
        </p>
        <div className="mt-[5cqw] grid gap-[2.4cqw]">
          {quiz.options.map((opt, i) => {
            const chosen = answer === i;
            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => onAnswer(i)}
                className={`flex min-h-[12cqw] items-center justify-between rounded-2xl px-[5cqw] text-left text-[3.9cqw] font-medium transition-all duration-500 animate-fade-up ${
                  warm
                    ? chosen
                      ? "bg-cocoa text-paper"
                      : "bg-cocoa/[0.06] ring-1 ring-cocoa/15 hover:bg-cocoa/10"
                    : chosen
                      ? "bg-rose text-white shadow-[0_10px_30px_-10px_rgb(232_52_90/0.8)]"
                      : "bg-white/[0.07] ring-1 ring-white/15 backdrop-blur-md hover:bg-white/[0.12]"
                } ${answered && !chosen ? "opacity-35" : ""}`}
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                {opt}
                {chosen && <Check />}
              </button>
            );
          })}
        </div>
        <div className="min-h-[26cqw]">
          {answered && (
            <>
              <p
                className={`mt-[5cqw] font-display text-[5.4cqw] italic leading-snug animate-fade-up ${
                  warm ? "text-cocoa/80" : "text-milk/85"
                }`}
              >
                {right ? quiz.rightReaction : quiz.wrongReaction}
              </p>
              <NextButton warm={warm} onClick={onNext} delay={0.6} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Раскладка «рассыпанных» полароидов: до 4 фото — крупнее, до 7 — плотнее
const COLLAGE_FEW = [
  { left: "4%", top: "2%", r: -8 },
  { left: "48%", top: "0%", r: 6 },
  { left: "8%", top: "44%", r: 5 },
  { left: "50%", top: "40%", r: -5 },
];
const COLLAGE_MANY = [
  { left: "0%", top: "0%", r: -7 },
  { left: "33%", top: "4%", r: 4 },
  { left: "64%", top: "-1%", r: -3 },
  { left: "3%", top: "33%", r: 5 },
  { left: "36%", top: "37%", r: -6 },
  { left: "65%", top: "31%", r: 7 },
  { left: "20%", top: "63%", r: -2 },
];

function Collage({ photos, warm, onNext }: { photos: Photo[]; warm: boolean; onNext: () => void }) {
  const many = photos.length > 4;
  const layout = many ? COLLAGE_MANY : COLLAGE_FEW;
  const step = many ? 0.22 : 0.35;
  const textDelay = 0.4 + photos.length * step;

  return (
    <div className="absolute inset-0 flex flex-col px-[6cqw] pb-[calc(var(--bottom)+8cqw)] pt-[calc(var(--top)+18cqw)]">
      {!warm && (
        <div className="pointer-events-none absolute left-1/2 top-1/3 size-[110cqw] -translate-x-1/2 rounded-full bg-rose/10 blur-[80px]" />
      )}
      <div className="relative flex-1">
        {photos.slice(0, layout.length).map((photo, i) => {
          const l = layout[i];
          return (
            <Polaroid
              key={photo.id}
              photo={photo}
              caption
              className={`absolute animate-drop ${many ? "w-[min(34cqw,18cqh)]" : "w-[min(44cqw,24cqh)]"}`}
              style={
                {
                  left: l.left,
                  top: l.top,
                  "--r": `${l.r}deg`,
                  animationDelay: `${0.15 + i * step}s`,
                } as CSSProperties
              }
            />
          );
        })}
      </div>
      <p
        className="relative font-display text-[7.6cqw] font-medium leading-[1.12] animate-fade-up"
        style={{ animationDelay: `${textDelay}s` }}
      >
        Оказывается, самые важные вещи складываются из маленьких моментов.
      </p>
      <div>
        <NextButton warm={warm} onClick={onNext} delay={textDelay + 0.4} />
      </div>
    </div>
  );
}

function Before({ text, warm, onNext }: { text: string; warm: boolean; onNext: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-[10cqw] text-center">
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 size-[80cqw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px] animate-breathe ${
          warm ? "bg-rose/15" : "bg-rose/25"
        }`}
      />
      <p
        className="relative font-display text-[9cqw] font-medium leading-[1.12] animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={onNext}
        className="btn btn-primary relative mt-[12cqw] animate-fade-up"
        style={{ animationDelay: "1.3s" }}
      >
        Открыть послание
      </button>
    </div>
  );
}

function Final({
  story,
  warm,
  mode,
  onRestart,
}: {
  story: Story;
  warm: boolean;
  mode: PlayerMode;
  onRestart: () => void;
}) {
  const paragraphs = (story.finalMessage.trim() || "Спасибо, что ты есть.")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const long = story.finalMessage.length > 260;
  const signDelay = 0.4 + paragraphs.length * 0.6;
  const [revealed, setRevealed] = useState(false);

  // Небольшая пауза после послания, прежде чем показать подпись сервиса
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), (signDelay + 1.8) * 1000);
    return () => clearTimeout(t);
  }, [signDelay]);

  const muted = warm ? "text-cocoa/55" : "text-milk/50";

  return (
    <div className="no-scrollbar absolute inset-0 overflow-y-auto">
      <div className="flex min-h-full flex-col px-[9cqw] pb-[calc(var(--bottom)+8cqw)] pt-[calc(var(--top)+22cqw)]">
        <div className="my-auto">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={`whitespace-pre-line font-display font-medium animate-fade-up ${
                long ? "text-[6cqw] leading-[1.3]" : "text-[8cqw] leading-[1.18]"
              } ${i > 0 ? "mt-[5cqw]" : ""}`}
              style={{ animationDelay: `${0.4 + i * 0.6}s` }}
            >
              {para}
            </p>
          ))}
          <p
            className="mt-[6cqw] font-display text-[8cqw] italic text-rose animate-fade-up"
            style={{ animationDelay: `${signDelay}s` }}
          >
            {story.sender || "Я"}.
          </p>
        </div>

        <div className={`mt-[10cqw] transition-all duration-1000 ${revealed ? "opacity-100" : "translate-y-3 opacity-0"}`}>
          <div className={`mb-[6cqw] h-px w-[14cqw] ${warm ? "bg-cocoa/20" : "bg-milk/20"}`} />
          <p className={`text-[3.6cqw] ${muted}`}>
            Эта история была создана специально для {story.recipient.trim() ? genitive(story.recipient) : "тебя"}.
          </p>
          {mode !== "preview" && (
            <>
              <p className={`mt-[6cqw] text-[3.9cqw] ${warm ? "text-cocoa/80" : "text-milk/80"}`}>
                Хочешь тоже удивить близкого человека?
              </p>
              <Link
                href="/create"
                tabIndex={revealed ? 0 : -1}
                className={`btn mt-[3.5cqw] w-full ${warm ? "bg-cocoa text-paper hover:bg-cocoa/90" : "btn-ghost"}`}
              >
                Создать свою историю
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={onRestart}
            tabIndex={revealed ? 0 : -1}
            className={`mt-[3cqw] w-full py-2 text-[3.4cqw] underline-offset-4 hover:underline ${muted}`}
          >
            Посмотреть ещё раз
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- мелкие детали ---------- */

function Polaroid({
  photo,
  className = "",
  style,
  caption = false,
  aspect = "aspect-square",
}: {
  photo: Photo;
  className?: string;
  style?: CSSProperties;
  caption?: boolean;
  aspect?: string;
}) {
  return (
    <div
      className={`rounded-[3px] bg-[#faf6ef] p-[2.6cqw] pb-0 shadow-[0_18px_40px_-14px_rgb(0_0_0/0.55)] ${className}`}
      style={style}
    >
      <div className={`relative overflow-hidden bg-black/10 ${aspect}`}>
        <Image src={photo.src} alt="" fill sizes="320px" className="object-cover" />
      </div>
      <div className="flex h-[10cqw] items-center justify-center px-1">
        {caption && photo.caption.trim() && (
          <span className="line-clamp-1 font-display text-[3.4cqw] italic text-cocoa/75">
            {photo.caption.trim()}
          </span>
        )}
      </div>
    </div>
  );
}

function NextButton({
  onClick,
  warm = false,
  delay = 0,
}: {
  onClick: () => void;
  warm?: boolean;
  delay?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-sm mt-[6cqw] animate-fade-up ${
        warm
          ? "bg-cocoa text-paper hover:bg-cocoa/85"
          : "bg-white/10 text-milk ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      Дальше
      <Chevron dir="right" />
    </button>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === "right" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
