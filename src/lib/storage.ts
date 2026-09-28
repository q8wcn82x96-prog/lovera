"use client";

import { useSyncExternalStore } from "react";
import type { Story } from "./story";

// Прототип хранит всё только в браузере пользователя (localStorage).
const DRAFT_KEY = "lovera:draft";
const STORY_KEY = "lovera:story";

const noopSubscribe = () => () => {};

/** true только на клиенте после гидрации — чтобы безопасно читать localStorage */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function read(key: string): Story | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as Story;
    if (!data || !Array.isArray(data.photos)) return null;
    return data;
  } catch {
    return null;
  }
}

function write(key: string, story: Story): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(story));
    return true;
  } catch {
    // Например, закончилось место под большие фотографии — прототип продолжит работать в памяти
    return false;
  }
}

// Запасной вариант, если localStorage переполнен: история живёт до перезагрузки вкладки
let memoryStory: Story | null = null;

export const loadDraft = () => read(DRAFT_KEY);
export const saveDraft = (story: Story) => write(DRAFT_KEY, story);

export function publishStory(story: Story) {
  memoryStory = story;
  return write(STORY_KEY, story);
}

export function loadPublishedStory() {
  return read(STORY_KEY) ?? memoryStory;
}
