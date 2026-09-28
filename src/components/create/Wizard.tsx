"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { loadDraft, publishStory, saveDraft, useHydrated } from "@/lib/storage";
import { MIN_PHOTOS, emptyDraft, type Story } from "@/lib/story";
import { StepAbout, StepMemories, StepPhotos, StepPreview, StepTheme } from "./Steps";
import { Success } from "./Success";

const STEPS = ["О вас", "Фотографии", "Воспоминания", "Оформление", "Предпросмотр"];

export function Wizard() {
  const hydrated = useHydrated();
  if (!hydrated) {
    return (
      <div className="min-h-dvh">
        <TopBar step={0} />
        <div className="mx-auto max-w-xl space-y-4 px-5 pt-10">
          <div className="skeleton h-10 w-3/4 rounded-2xl" />
          <div className="skeleton h-14 rounded-2xl" />
          <div className="skeleton h-14 rounded-2xl" />
        </div>
      </div>
    );
  }
  return <WizardFlow />;
}

function WizardFlow() {
  const [story, setStory] = useState<Story>(() => loadDraft() ?? emptyDraft());
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"editing" | "creating" | "done">("editing");
  const [processing, setProcessing] = useState(false);

  // Черновик сохраняется автоматически — можно закрыть вкладку и вернуться
  useEffect(() => {
    saveDraft(story);
  }, [story]);

  const update = (patch: Partial<Story>) => setStory((s) => ({ ...s, ...patch }));

  const goTo = (i: number) => {
    setStep(i);
    window.scrollTo({ top: 0 });
  };

  const missingPhotos = MIN_PHOTOS - story.photos.length;
  const blockers = [
    !story.recipient.trim() || !story.sender.trim() ? "Укажи оба имени, чтобы продолжить" : "",
    processing ? "Загружаем фотографии…" : missingPhotos > 0 ? `Добавь ещё ${missingPhotos} фото` : "",
    !story.finalMessage.trim() ? "Напиши финальное послание — это главное в истории" : "",
    "",
    "",
  ];
  const blocker = blockers[step];
  const isLast = step === STEPS.length - 1;

  const create = () => {
    setStatus("creating");
    // Имитация сборки истории — в будущем здесь будет сохранение на сервер
    setTimeout(() => {
      publishStory(story);
      setStatus("done");
      window.scrollTo({ top: 0 });
    }, 1600);
  };

  const next = () => {
    if (blocker) return;
    if (isLast) create();
    else goTo(step + 1);
  };

  if (status === "done") {
    return <Success story={story} onEdit={() => setStatus("editing")} />;
  }

  const width = step === 4 ? "max-w-5xl" : step === 1 ? "max-w-3xl" : "max-w-xl";

  return (
    <div className="min-h-dvh">
      <TopBar step={step} />

      <main key={step} className={`mx-auto w-full ${width} px-5 pb-44 pt-8 animate-fade-up sm:px-8 sm:pt-12`}>
        {step === 0 && <StepAbout story={story} update={update} />}
        {step === 1 && (
          <StepPhotos
            photos={story.photos}
            onChange={(photos) => update({ photos })}
            processing={processing}
            setProcessing={setProcessing}
          />
        )}
        {step === 2 && <StepMemories story={story} update={update} />}
        {step === 3 && <StepTheme story={story} update={update} />}
        {step === 4 && <StepPreview story={story} goTo={goTo} />}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-ink/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className={`mx-auto ${width} px-5 py-4 sm:px-8`}>
          <p
            className={`mb-3 text-center text-xs text-milk/45 transition-opacity sm:text-left ${
              blocker ? "opacity-100" : "hidden opacity-0"
            }`}
          >
            {blocker}
          </p>
          <div className="flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={status === "creating"}
                className="btn btn-ghost px-5"
                aria-label="Назад"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline">Назад</span>
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={!!blocker || status === "creating"}
              className="btn btn-primary flex-1 sm:ml-auto sm:flex-none sm:px-10"
            >
              {status === "creating" ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Собираем историю…
                </>
              ) : isLast ? (
                "Создать мою историю"
              ) : (
                "Продолжить"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ step }: { step: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo className="text-2xl!" />
        <div className="flex items-center gap-3">
          <p className="text-sm text-milk/60">
            <span className="text-milk">Шаг {step + 1}</span> из {STEPS.length}
            <span className="hidden sm:inline"> · {STEPS[step]}</span>
          </p>
          <Link
            href="/"
            aria-label="Закрыть конструктор"
            className="grid size-9 place-items-center rounded-full text-milk/50 transition-colors hover:bg-white/[0.06] hover:text-milk"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl gap-1.5 px-5 pb-3 sm:px-8">
        {STEPS.map((s, i) => (
          <div key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-rose transition-all duration-500 ease-out"
              style={{ width: i <= step ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>
    </header>
  );
}
