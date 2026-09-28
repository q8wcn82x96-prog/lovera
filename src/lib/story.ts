export type Occasion = "just" | "anniversary" | "birthday" | "special" | "other";
export type ThemeId = "dark" | "warm";
export type Gender = "m" | "f";

export type Photo = {
  id: string;
  src: string;
  caption: string;
};

export type Quiz = {
  question: string;
  options: string[];
  /** null — «правильного» ответа нет, любая реакция тёплая */
  correctIndex: number | null;
  rightReaction: string;
  wrongReaction: string;
};

export type Story = {
  recipient: string;
  sender: string;
  senderGender: Gender;
  occasion: Occasion;
  intro: string;
  photos: Photo[];
  finalMessage: string;
  theme: ThemeId;
  quiz?: Quiz;
};

export const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: "just", label: "Просто так" },
  { value: "anniversary", label: "Годовщина" },
  { value: "birthday", label: "День рождения" },
  { value: "special", label: "Особенная дата" },
  { value: "other", label: "Другое" },
];

export const MIN_PHOTOS = 3;
export const MAX_PHOTOS = 10;

export const DEMO_PHOTOS: Photo[] = [
  { id: "d-bikes", src: "/demo/bikes.jpg", caption: "Всё началось с одного обычного дня…" },
  {
    id: "d-sunset",
    src: "/demo/sunset.jpg",
    caption: "А потом появился момент, который я почему-то запомнил навсегда.",
  },
  { id: "d-paris", src: "/demo/paris.jpg", caption: "Наш первый вечер у реки" },
  { id: "d-lake", src: "/demo/lake.jpg", caption: "То утро на озере" },
  { id: "d-balloons", src: "/demo/balloons.jpg", caption: "Небо, полное шаров" },
  { id: "d-hands", src: "/demo/hands.jpg", caption: "Просто мы" },
  { id: "d-field", src: "/demo/field.jpg", caption: "Дорога домой" },
  { id: "d-bouquet", src: "/demo/bouquet.jpg", caption: "Твои любимые цветы" },
];

export const EXAMPLE_FINAL_MESSAGE =
  "Спасибо, что превращаешь обычные дни в те, которые хочется помнить.\n\nЛюблю тебя.";

export const DEMO_STORY: Story = {
  recipient: "Аня",
  sender: "Максим",
  senderGender: "m",
  occasion: "anniversary",
  intro: "Я собрал несколько моментов, которые значат для меня больше, чем кажется.",
  photos: DEMO_PHOTOS.slice(0, 7),
  finalMessage: EXAMPLE_FINAL_MESSAGE,
  theme: "dark",
  quiz: {
    question: "Помнишь это место?",
    options: ["Прага", "Париж", "Рим"],
    correctIndex: 1,
    rightReaction: "Конечно, помнишь. Я до сих пор слышу, как ты смеялась на том мосту.",
    wrongReaction: "Почти. Это был Париж — и ты тогда сказала, что хочешь вернуться.",
  },
};

export const GENERIC_QUIZ: Quiz = {
  question: "Помнишь этот момент?",
  options: ["Как будто это было вчера", "До мельчайших деталей", "Напомни мне ещё раз"],
  correctIndex: null,
  rightReaction: "Я тоже. И, кажется, буду помнить всегда.",
  wrongReaction: "Я тоже. И, кажется, буду помнить всегда.",
};

export function emptyDraft(): Story {
  return {
    recipient: "",
    sender: "",
    senderGender: "m",
    occasion: "just",
    intro: "",
    // Первые две подписи пустые: в истории появятся тексты по умолчанию с учётом пола отправителя
    photos: DEMO_PHOTOS.slice(0, 6).map((p, i) => ({ ...p, caption: i < 2 ? "" : p.caption })),
    finalMessage: "",
    theme: "dark",
  };
}

export function occasionLabel(o: Occasion) {
  return OCCASIONS.find((x) => x.value === o)?.label ?? "";
}

/** Форма глагола по полу отправителя: byGender(g, "приготовил", "приготовила") */
export function byGender(gender: Gender, m: string, f: string) {
  return gender === "f" ? f : m;
}

const MALE_A_NAMES = ["никита", "илья", "фома", "кузьма", "савва", "лука", "данила", "гаврила"];

/** Простое угадывание пола по имени — пользователь всегда может поправить вручную */
export function guessGender(name: string): Gender {
  const n = name.trim().toLowerCase();
  if (!n || MALE_A_NAMES.includes(n)) return "m";
  return /[ая]$/.test(n) ? "f" : "m";
}

/** Родительный падеж для большинства русских имён: Аня → Ани, Максим → Максима */
export function genitive(name: string) {
  const n = name.trim();
  if (!n) return n;
  const last = n.slice(-1).toLowerCase();
  const prev = n.slice(-2, -1).toLowerCase();
  const base = n.slice(0, -1);
  if (last === "я") return base + "и";
  if (last === "а") return "гкхжшщч".includes(prev) ? base + "и" : base + "ы";
  if (last === "й" || last === "ь") return base + "я";
  if (/[бвгджзклмнпрстфхцчшщ]/.test(last)) return n + "а";
  return n;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}
