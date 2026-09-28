"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { genitive, type Story } from "@/lib/story";

const DISPLAY_LINK = "lovera.ru/s/demo";
const FULL_LINK = `https://${DISPLAY_LINK}`;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Запасной способ для браузеров без Clipboard API
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export function Success({ story, onEdit }: { story: Story; onEdit: () => void }) {
  const [copied, setCopied] = useState(false);
  const cover = story.photos[0]?.src;
  const shareText = `${story.recipient ? story.recipient + ", " : ""}у меня для тебя кое-что есть`;

  const copy = async () => {
    if (await copyText(FULL_LINK)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {cover && (
        <div className="pointer-events-none absolute inset-0">
          <Image src={cover} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-20 blur-3xl" />
          <div className="absolute inset-0 bg-linear-to-b from-ink/40 via-ink/80 to-ink" />
        </div>
      )}
      <div className="pointer-events-none absolute left-1/2 top-24 size-[28rem] -translate-x-1/2 rounded-full bg-rose/20 blur-[110px] animate-breathe" />

      <header className="relative mx-auto flex h-16 w-full max-w-5xl items-center px-5 sm:px-8">
        <Logo className="text-2xl!" />
      </header>

      <main className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 pb-16 pt-6 text-center">
        {cover && (
          <div className="mx-auto mb-10 w-36 -rotate-3 bg-[#faf6ef] p-2 pb-8 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] animate-drop [--r:-3deg]">
            <div className="relative aspect-square">
              <Image src={cover} alt="" fill sizes="150px" className="object-cover" />
            </div>
          </div>
        )}
        <h1 className="font-display text-5xl font-medium leading-[1.05] animate-fade-up sm:text-6xl" style={{ animationDelay: "0.2s" }}>
          Твоя история готова ❤️
        </h1>
        <p className="mt-4 text-milk/60 animate-fade-up" style={{ animationDelay: "0.35s" }}>
          Отправь ссылку {story.recipient ? genitive(story.recipient) : "близкому человеку"} в Telegram, WhatsApp или
          любой мессенджер. Остальное история сделает сама.
        </p>

        <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.5s" }}>
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/[0.06] py-2 pl-5 pr-2 text-left ring-1 ring-white/12 backdrop-blur-md transition-colors hover:bg-white/[0.09]"
          >
            <span className="truncate font-medium tracking-wide">{DISPLAY_LINK}</span>
            <span className="rounded-xl bg-white/[0.08] px-3 py-2 text-xs font-medium text-milk/80">
              {copied ? "Скопировано" : "Копировать"}
            </span>
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/s/demo" className="btn btn-primary">
              Открыть историю
            </Link>
            <button type="button" onClick={copy} className="btn btn-ghost">
              {copied ? "Ссылка скопирована ✓" : "Скопировать ссылку"}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-5 text-sm text-milk/50">
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(FULL_LINK)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-milk"
            >
              Telegram
            </a>
            <span className="size-1 rounded-full bg-milk/20" />
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${FULL_LINK}`)}`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-milk"
            >
              WhatsApp
            </a>
            <span className="size-1 rounded-full bg-milk/20" />
            <button type="button" onClick={onEdit} className="transition-colors hover:text-milk">
              Изменить
            </button>
          </div>
        </div>

        <p className="mt-12 text-xs leading-relaxed text-milk/30">
          Это прототип: ссылка lovera.ru пока не работает для других людей, а история хранится только в этом браузере.
        </p>
      </main>

      <div
        className={`fixed inset-x-0 bottom-6 z-50 mx-auto w-max rounded-full bg-milk px-5 py-3 text-sm font-medium text-ink shadow-2xl transition-all duration-300 ${
          copied ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        role="status"
      >
        Ссылка скопирована
      </div>
    </div>
  );
}
