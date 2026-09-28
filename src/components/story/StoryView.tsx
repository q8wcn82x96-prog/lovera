"use client";

import Image from "next/image";
import { useState } from "react";
import { loadPublishedStory, useHydrated } from "@/lib/storage";
import { DEMO_STORY } from "@/lib/story";
import { StoryPlayer } from "./StoryPlayer";

/** Страница получателя: показывает созданную в конструкторе историю или демо-пример */
export function StoryView({ example }: { example: boolean }) {
  const hydrated = useHydrated();
  if (!hydrated) return <main className="fixed inset-0 bg-ink" />;
  return <LoadedStory example={example} />;
}

function LoadedStory({ example }: { example: boolean }) {
  const [story] = useState(() => (example ? null : loadPublishedStory()) ?? DEMO_STORY);
  const cover = story.photos[0]?.src;

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      {cover && (
        <div className="absolute inset-0 hidden sm:block">
          <Image src={cover} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-30 blur-3xl" />
          <div className="absolute inset-0 bg-ink/60" />
        </div>
      )}
      <div className="relative h-full w-full sm:h-[min(calc(100dvh-48px),920px)] sm:max-w-[460px] sm:overflow-hidden sm:rounded-[2.2rem] sm:shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9)] sm:ring-1 sm:ring-white/10">
        <StoryPlayer story={story} mode="full" />
      </div>
    </main>
  );
}
