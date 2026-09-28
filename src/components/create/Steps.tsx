"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { StoryPlayer } from "@/components/story/StoryPlayer";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { resizeImage } from "@/lib/image";
import {
  DEMO_PHOTOS,
  EXAMPLE_FINAL_MESSAGE,
  MAX_PHOTOS,
  MIN_PHOTOS,
  OCCASIONS,
  byGender,
  guessGender,
  occasionLabel,
  uid,
  type Photo,
  type Story,
  type ThemeId,
} from "@/lib/story";

type StepProps = { story: Story; update: (patch: Partial<Story>) => void };

function StepHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-9">
      <h1 className="font-display text-[2.4rem] font-medium leading-[1.05] tracking-[-0.01em] sm:text-5xl">{title}</h1>
      {text && <p className="mt-3 text-milk/55 sm:text-lg">{text}</p>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between gap-3 text-sm font-medium text-milk/80">
        {label}
        {hint && <span className="text-xs font-normal text-milk/35">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/* ---------- Шаг 1 — О вас ---------- */

export function StepAbout({ story, update }: StepProps) {
  const [genderTouched, setGenderTouched] = useState(false);

  return (
    <>
      <StepHeading title="С кого начинается эта история?" text="Пара деталей — и мы начнём собирать ваш сюрприз." />
      <div className="space-y-6">
        <Field label="Имя получателя">
          <input
            className="field"
            placeholder="Например, Аня"
            value={story.recipient}
            maxLength={30}
            autoComplete="off"
            onChange={(e) => update({ recipient: e.target.value })}
          />
        </Field>

        <div>
          <Field label="Имя отправителя">
            <input
              className="field"
              placeholder="Например, Максим"
              value={story.sender}
              maxLength={30}
              autoComplete="off"
              onChange={(e) =>
                update({
                  sender: e.target.value,
                  ...(genderTouched ? {} : { senderGender: guessGender(e.target.value) }),
                })
              }
            />
          </Field>
          <div className="mt-3 flex items-center gap-3 text-sm text-milk/50">
            <span>В тексте истории:</span>
            <div className="inline-flex rounded-full bg-white/[0.05] p-1 ring-1 ring-white/10">
              {(["m", "f"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGenderTouched(true);
                    update({ senderGender: g });
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    story.senderGender === g ? "bg-milk text-ink" : "text-milk/60 hover:text-milk"
                  }`}
                >
                  {byGender(g, "приготовил", "приготовила")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-milk/80">Повод</p>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => {
              const active = story.occasion === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => update({ occasion: o.value })}
                  aria-pressed={active}
                  className={`min-h-11 rounded-full px-5 text-sm font-medium transition-all ${
                    active
                      ? "bg-rose text-white shadow-[0_8px_24px_-10px_rgb(232_52_90/0.8)]"
                      : "bg-white/[0.05] text-milk/75 ring-1 ring-white/10 hover:bg-white/[0.09]"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Напиши пару слов, с которых начнётся история" hint="необязательно">
          <textarea
            className="field min-h-28 resize-none leading-relaxed"
            placeholder="Например: я собрал несколько моментов, которые значат для меня больше, чем кажется."
            value={story.intro}
            maxLength={160}
            onChange={(e) => update({ intro: e.target.value })}
          />
        </Field>
      </div>
    </>
  );
}

/* ---------- Шаг 2 — Фотографии ---------- */

export function StepPhotos({
  photos,
  onChange,
  processing,
  setProcessing,
}: {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  processing: boolean;
  setProcessing: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(0);
  const [dragId, setDragId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const free = MAX_PHOTOS - photos.length;
  const unusedDemo = DEMO_PHOTOS.filter((d) => !photos.some((p) => p.id === d.id));

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const accepted = list.slice(0, free);
    setError(list.length > free ? `Можно добавить не больше ${MAX_PHOTOS} фотографий` : "");
    if (!accepted.length) return;

    setProcessing(true);
    setPending(accepted.length);
    const added: Photo[] = [];
    for (const file of accepted) {
      try {
        added.push({ id: uid(), src: await resizeImage(file), caption: "" });
      } catch {
        setError("Не получилось открыть одну из фотографий — попробуй другую");
      }
      setPending((n) => n - 1);
    }
    onChange([...photos, ...added]);
    setProcessing(false);
    setPending(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (id: string) => onChange(photos.filter((p) => p.id !== id));

  const moveTo = (from: number, to: number) => {
    if (to < 0 || to >= photos.length || from === to) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <>
      <StepHeading
        title="Добавь ваши моменты"
        text={`Выбери от ${MIN_PHOTOS} до ${MAX_PHOTOS} фотографий, которые что-то значат для вас.`}
      />

      <div className="mb-4 flex items-center justify-between text-sm">
        <p className="text-milk/60">
          <span className={photos.length >= MIN_PHOTOS ? "text-milk" : "text-rose"}>{photos.length}</span> из{" "}
          {MAX_PHOTOS}
          <span className="hidden text-milk/35 sm:inline"> · первая фотография откроет историю</span>
        </p>
        {photos.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="rounded-full px-3 py-1.5 text-milk/45 transition-colors hover:bg-white/[0.05] hover:text-milk"
          >
            Убрать все
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => setDragId(photo.id)}
            onDragEnd={() => setDragId(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = photos.findIndex((p) => p.id === dragId);
              if (from >= 0) moveTo(from, i);
              setDragId(null);
            }}
            className={`group relative aspect-[3/4] cursor-grab overflow-hidden rounded-2xl bg-ink-3 ring-1 ring-white/10 transition-all duration-300 animate-fade-in active:cursor-grabbing ${
              dragId === photo.id ? "scale-95 opacity-40" : ""
            }`}
          >
            <Image src={photo.src} alt="" fill sizes="200px" className="pointer-events-none object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
            <span className="absolute left-2 top-2 grid size-6 place-items-center rounded-full bg-black/45 text-[11px] font-semibold backdrop-blur-md">
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(photo.id)}
              aria-label="Удалить фотографию"
              className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/45 text-milk backdrop-blur-md transition-colors hover:bg-rose"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className="absolute inset-x-2 bottom-2 flex justify-between">
              <MoveButton dir="left" disabled={i === 0} onClick={() => moveTo(i, i - 1)} />
              <MoveButton dir="right" disabled={i === photos.length - 1} onClick={() => moveTo(i, i + 1)} />
            </div>
          </div>
        ))}

        {Array.from({ length: pending }).map((_, i) => (
          <div key={`pending-${i}`} className="skeleton aspect-[3/4] rounded-2xl" />
        ))}

        {free > 0 && !processing && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 text-milk/60 transition-colors hover:border-rose/60 hover:bg-rose/[0.05] hover:text-milk"
          >
            <span className="grid size-10 place-items-center rounded-full bg-white/[0.07] text-2xl leading-none">+</span>
            <span className="text-xs font-medium">Добавить</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />

      {error && <p className="mt-4 text-sm text-rose">{error}</p>}
      <p className="mt-4 text-xs leading-relaxed text-milk/35">
        Перетащи фото мышкой или используй стрелки, чтобы поменять порядок. В прототипе фотографии остаются только в
        твоём браузере.
      </p>

      {unusedDemo.length > 0 && free > 0 && (
        <div className="mt-10">
          <p className="mb-3 text-sm font-medium text-milk/70">Или возьми из демо-альбома</p>
          <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {unusedDemo.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onChange([...photos, { ...d }])}
                className="group relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10"
                aria-label="Добавить демо-фотографию"
              >
                <Image src={d.src} alt="" fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute inset-0 grid place-items-center bg-black/35 text-xl text-white opacity-90 transition-opacity group-hover:bg-black/20">
                  +
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function MoveButton({ dir, disabled, onClick }: { dir: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Переместить раньше" : "Переместить позже"}
      className="grid size-8 place-items-center rounded-full bg-black/45 text-milk backdrop-blur-md transition-all hover:bg-black/70 disabled:opacity-0"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={dir === "right" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"}
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* ---------- Шаг 3 — Воспоминания ---------- */

function photoRole(i: number) {
  if (i === 0) return "Экран 1 · начало истории";
  if (i === 1) return "Экран 2";
  if (i === 2) return "Вопрос «Помнишь этот момент?»";
  return "Коллаж воспоминаний";
}

export function StepMemories({ story, update }: StepProps) {
  const g = story.senderGender;
  const placeholders = [
    "Всё началось с одного обычного дня…",
    `А потом появился момент, который я почему-то ${byGender(g, "запомнил", "запомнила")} навсегда.`,
    "Помнишь наш первый вечер здесь?",
  ];

  const setCaption = (id: string, caption: string) =>
    update({ photos: story.photos.map((p) => (p.id === id ? { ...p, caption } : p)) });

  return (
    <>
      <StepHeading
        title="Расскажи, что было за кадром"
        text="Добавь короткую подпись к каждой фотографии. Можно оставить пустой — мы подставим красивый текст."
      />

      <div className="space-y-3">
        {story.photos.map((photo, i) => (
          <div key={photo.id} className="flex gap-4 rounded-[1.5rem] bg-ink-2 p-3 ring-1 ring-white/[0.07]">
            <div className="relative aspect-[3/4] w-[4.5rem] shrink-0 overflow-hidden rounded-xl sm:w-20">
              <Image src={photo.src} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1 py-1">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-rose/90">{photoRole(i)}</p>
              <textarea
                rows={2}
                maxLength={100}
                value={photo.caption}
                placeholder={placeholders[i] ?? "Короткая подпись — например, «То утро на озере»"}
                onChange={(e) => setCaption(photo.id, e.target.value)}
                className="w-full resize-none bg-transparent text-[15px] leading-snug text-milk outline-none placeholder:text-milk/30"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="font-display text-3xl font-medium leading-tight sm:text-4xl">
          Что ты хочешь сказать в самом конце?
        </h2>
        <p className="mt-2 text-sm text-milk/50">
          Это послание откроется последним. Пустая строка между абзацами — и они появятся по очереди.
        </p>
        <textarea
          className="field mt-5 min-h-56 resize-none font-display text-xl leading-relaxed"
          placeholder="Спасибо, что превращаешь обычные дни в те, которые хочется помнить…"
          value={story.finalMessage}
          maxLength={700}
          onChange={(e) => update({ finalMessage: e.target.value })}
        />
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-milk/35">
          {!story.finalMessage.trim() ? (
            <button
              type="button"
              onClick={() => update({ finalMessage: EXAMPLE_FINAL_MESSAGE })}
              className="rounded-full bg-white/[0.06] px-3 py-1.5 text-milk/70 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-milk"
            >
              Подставить пример
            </button>
          ) : (
            <span>Подпись «{story.sender || "имя"}» добавится автоматически</span>
          )}
          <span>{story.finalMessage.length} / 700</span>
        </div>
      </div>
    </>
  );
}

/* ---------- Шаг 4 — Оформление ---------- */

const THEMES: { id: ThemeId; name: string; text: string }[] = [
  { id: "dark", name: "Romantic Dark", text: "Тёмная и кинематографичная. Фотографии на весь экран, мягкий свет." },
  { id: "warm", name: "Warm Memories", text: "Светлая и тёплая. Полароиды, плёночное зерно, ощущение альбома." },
];

export function StepTheme({ story, update }: StepProps) {
  const cover = story.photos[0]?.src ?? DEMO_PHOTOS[0].src;
  const second = story.photos[1]?.src ?? DEMO_PHOTOS[1].src;

  return (
    <>
      <StepHeading title="Выбери настроение" text="Оформление можно поменять в любой момент до отправки." />
      <div className="grid gap-4 sm:grid-cols-2">
        {THEMES.map((t) => {
          const active = story.theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => update({ theme: t.id })}
              aria-pressed={active}
              className={`group rounded-[1.75rem] p-3 text-left transition-all duration-300 ${
                active
                  ? "bg-ink-3 ring-2 ring-rose shadow-[0_20px_50px_-20px_rgb(232_52_90/0.5)]"
                  : "bg-ink-2 ring-1 ring-white/10 hover:bg-ink-3"
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                {t.id === "dark" ? (
                  <>
                    <Image src={cover} alt="" fill sizes="400px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent" />
                    <p className="absolute inset-x-5 bottom-5 font-display text-2xl font-medium leading-tight text-milk">
                      Всё началось с одного обычного дня…
                    </p>
                  </>
                ) : (
                  <div className="grain absolute inset-0 bg-paper">
                    <div className="absolute left-[12%] top-[10%] w-[46%] -rotate-6 bg-[#faf6ef] p-2 pb-7 shadow-xl transition-transform duration-500 group-hover:-rotate-3">
                      <div className="relative aspect-square">
                        <Image src={cover} alt="" fill sizes="200px" className="object-cover" />
                      </div>
                    </div>
                    <div className="absolute right-[10%] top-[18%] w-[42%] rotate-6 bg-[#faf6ef] p-2 pb-7 shadow-xl transition-transform duration-500 group-hover:rotate-3">
                      <div className="relative aspect-square">
                        <Image src={second} alt="" fill sizes="200px" className="object-cover" />
                      </div>
                    </div>
                    <p className="absolute inset-x-5 bottom-5 font-display text-2xl font-medium leading-tight text-cocoa">
                      Всё началось с одного обычного дня…
                    </p>
                  </div>
                )}
                {active && (
                  <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-rose text-white shadow-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="px-2 pb-2 pt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-milk/50">{t.text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Шаг 5 — Предпросмотр ---------- */

export function StepPreview({ story, goTo }: { story: Story; goTo: (step: number) => void }) {
  const rows: { label: string; value: string; step: number }[] = [
    { label: "Для кого", value: story.recipient, step: 0 },
    { label: "От кого", value: story.sender, step: 0 },
    { label: "Повод", value: occasionLabel(story.occasion), step: 0 },
    { label: "Фотографии", value: `${story.photos.length} шт.`, step: 1 },
    { label: "Послание", value: story.finalMessage.trim().split("\n")[0], step: 2 },
    { label: "Оформление", value: story.theme === "dark" ? "Romantic Dark" : "Warm Memories", step: 3 },
  ];

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
      <div className="order-2 flex flex-col items-center lg:order-1">
        <PhoneMockup className="w-[min(320px,82vw)]">
          <StoryPlayer story={story} mode="preview" />
        </PhoneMockup>
        <p className="mt-5 text-center text-xs text-milk/40">Нажимай на экран, чтобы листать историю</p>
      </div>

      <div className="order-1 lg:order-2 lg:pt-10">
        <StepHeading
          title={`Так её увидит ${story.recipient || "получатель"}`}
          text="Пройди историю целиком. Если что-то хочется поправить — просто нажми «Изменить»."
        />
        <dl className="divide-y divide-white/[0.07] rounded-[1.5rem] bg-ink-2 px-5 ring-1 ring-white/[0.07]">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-4 py-4">
              <dt className="w-28 shrink-0 text-sm text-milk/45">{r.label}</dt>
              <dd className="min-w-0 flex-1 truncate text-sm">{r.value || "—"}</dd>
              <button
                type="button"
                onClick={() => goTo(r.step)}
                className="shrink-0 text-xs font-medium text-rose transition-opacity hover:opacity-75"
              >
                Изменить
              </button>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
