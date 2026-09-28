import Image from "next/image";
import Link from "next/link";
import { StoryPlayer } from "@/components/story/StoryPlayer";
import { Logo } from "@/components/ui/Logo";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { DEMO_STORY } from "@/lib/story";

const EXAMPLE_HREF = "/s/demo?example";

const STEPS = [
  { n: "01", title: "Добавь ваши фотографии", text: "От 3 до 10 кадров, которые что-то значат для вас двоих." },
  { n: "02", title: "Расскажи несколько воспоминаний", text: "Пара строк к фотографиям и главные слова — для финала." },
  { n: "03", title: "Посмотри готовую историю", text: "Выбери оформление и проживи историю так, как увидит её получатель." },
  { n: "04", title: "Отправь её одной ссылкой", text: "В Telegram, WhatsApp или любой другой мессенджер." },
];

const FEATURES = [
  { title: "Экран за экраном", text: "Каждое воспоминание занимает весь экран и появляется в свой момент." },
  { title: "Маленькие вопросы", text: "«Помнишь это место?» — история отвечает на выбор получателя." },
  { title: "Главные слова в финале", text: "Твоё послание открывается последним, когда всё уже сказано фотографиями." },
];

const FAQ = [
  {
    q: "Сколько времени занимает создание?",
    a: "Обычно 5–10 минут. Больше всего времени уходит на выбор фотографий — и это самая приятная часть.",
  },
  {
    q: "Нужно ли получателю что-то устанавливать?",
    a: "Нет. История открывается по ссылке прямо в браузере телефона — без приложений и регистрации.",
  },
  {
    q: "Кто сможет увидеть историю?",
    a: "Только тот, кому ты отправишь приватную ссылку. История не публикуется и не попадает в поиск.",
  },
  {
    q: "Можно ли посмотреть историю до отправки?",
    a: "Да. На последнем шаге ты увидишь её целиком внутри телефона — ровно так, как увидит получатель.",
  },
  {
    q: "Как лучше отправить ссылку?",
    a: "Просто перешли её в любимый мессенджер. Можно без предупреждения — так сюрприз получится сильнее.",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <Header />

      {/* HERO */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-10 sm:px-8 md:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-32">
        <div className="pointer-events-none absolute -right-40 -top-20 size-[36rem] rounded-full bg-rose/15 blur-[120px]" />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-4 py-2 text-xs font-medium text-milk/75 ring-1 ring-white/10 animate-fade-up">
            <span className="size-1.5 rounded-full bg-rose" />
            Особенный подарок для особенного человека
          </p>
          <h1
            className="mt-7 font-display text-[2.75rem] font-medium leading-[1.02] tracking-[-0.015em] animate-fade-up sm:text-6xl lg:text-[4.6rem]"
            style={{ animationDelay: "0.1s" }}
          >
            Преврати ваши чувства в&nbsp;историю, которую <em className="text-rose">хочется пересматривать</em>
          </h1>
          <p
            className="mt-6 max-w-md text-base leading-relaxed text-milk/65 animate-fade-up sm:text-lg"
            style={{ animationDelay: "0.2s" }}
          >
            Собери ваши фотографии, воспоминания и самые важные слова в один красивый цифровой сюрприз.
          </p>
          <div
            className="mt-9 flex flex-col gap-3 animate-fade-up sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <Link href="/create" className="btn btn-primary">
              Создать нашу историю
            </Link>
            <Link href={EXAMPLE_HREF} className="btn btn-ghost">
              Посмотреть пример
            </Link>
          </div>
          <p className="mt-6 text-sm text-milk/40 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Готово за 10 минут · Открывается на любом телефоне
          </p>
        </div>

        <div className="relative flex flex-col items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <PhoneMockup className="w-[min(300px,78vw)]">
            <StoryPlayer story={DEMO_STORY} mode="embedded" />
          </PhoneMockup>
          <p className="mt-6 text-xs text-milk/40">Это живой пример — нажми «Открыть»</p>
        </div>
      </section>

      {/* БОЛЬШЕ, ЧЕМ ОТКРЫТКА */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 h-[26rem] lg:order-1 lg:h-[32rem]">
            <FloatingPhoto src="/demo/sunset.jpg" className="left-0 top-6 w-[58%] -rotate-6" />
            <FloatingPhoto src="/demo/lake.jpg" className="right-0 top-0 w-[48%] rotate-[5deg]" delay="1.5s" />
            <FloatingPhoto src="/demo/hands.jpg" className="bottom-0 left-[24%] w-[50%] rotate-2" delay="3s" />
          </div>
          <div className="order-1 lg:order-2">
            <SectionLabel>Не просто текст</SectionLabel>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">
              Это больше, чем открытка
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-milk/65">
              Открытку читают за пять секунд. Историю в Lovera проживают: получатель открывает её шаг за
              шагом — ваши фотографии, воспоминания и, в самом конце, твои слова.
            </p>
            <ul className="mt-10 grid gap-6">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-rose" />
                  <div>
                    <p className="font-semibold">{f.title}</p>
                    <p className="mt-1 text-milk/55">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
        <SectionLabel>Четыре простых шага</SectionLabel>
        <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">Как это работает</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="group rounded-[1.75rem] bg-ink-2 p-7 ring-1 ring-white/[0.07] transition-colors duration-300 hover:bg-ink-3"
            >
              <p className="font-display text-5xl italic text-rose/90 transition-transform duration-300 group-hover:-translate-y-1">
                {s.n}
              </p>
              <p className="mt-10 text-lg font-semibold leading-snug">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-milk/55">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ВЫБЕРИ СВОЙ МОМЕНТ */}
      <section id="moments" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
        <SectionLabel>Форматы</SectionLabel>
        <h2 className="mt-4 font-display text-4xl font-medium leading-[1.05] sm:text-5xl">Выбери свой момент</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <ProductCard
            title="История нашей любви"
            text="Ваш путь вдвоём — от первого дня до слов, которые хочется сказать сейчас."
            image="/demo/bikes.jpg"
            available
          />
          <ProductCard
            title="Сюрприз для тебя"
            text="Интригующая история с подарком, который раскрывается в самом конце."
            image="/demo/balloons.jpg"
          />
          <ProductCard
            title="Приглашение на свидание"
            text="Красивое приглашение, на которое невозможно ответить «нет»."
            image="/demo/paris.jpg"
          />
        </div>
      </section>

      {/* ЭМОЦИОНАЛЬНЫЙ CTA */}
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.25rem] px-6 py-20 text-center ring-1 ring-white/10 sm:px-12 sm:py-28">
          <Image src="/demo/hands.jpg" alt="" fill sizes="(max-width: 1200px) 100vw, 1150px" className="object-cover" />
          <div className="absolute inset-0 bg-ink/75" />
          <div className="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink/40" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-medium leading-[1.08] sm:text-6xl">
              Некоторые вещи хочется сказать <em className="text-rose">красиво.</em>
            </h2>
            <Link href="/create" className="btn btn-primary mt-10">
              Создать историю
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
        <h2 className="text-center font-display text-4xl font-medium sm:text-5xl">Частые вопросы</h2>
        <div className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-2">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-medium transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/[0.06] text-lg leading-none text-milk/70 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-5 pr-12 leading-relaxed text-milk/60">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#how"
            className="hidden rounded-full px-4 py-2 text-sm text-milk/70 transition-colors hover:text-milk md:inline-block"
          >
            Как это работает
          </a>
          <Link
            href={EXAMPLE_HREF}
            className="hidden rounded-full px-4 py-2 text-sm text-milk/70 transition-colors hover:text-milk md:inline-block"
          >
            Примеры
          </Link>
          <Link href="/create" className="btn btn-primary btn-sm ml-2">
            Создать историю
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-milk/40">Персональные цифровые сюрпризы для близких.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-milk/60">
          <Link href="/create" className="hover:text-milk">
            Создать историю
          </Link>
          <Link href={EXAMPLE_HREF} className="hover:text-milk">
            Пример
          </Link>
          <a href="#how" className="hover:text-milk">
            Как это работает
          </a>
          <a href="#faq" className="hover:text-milk">
            Вопросы
          </a>
        </nav>
        <p className="text-sm text-milk/35">© 2026 Lovera</p>
      </div>
    </footer>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose">{children}</p>;
}

function FloatingPhoto({ src, className, delay = "0s" }: { src: string; className: string; delay?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="animate-float rounded-[4px] bg-[#faf6ef] p-2.5 pb-10 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]" style={{ animationDelay: delay }}>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src={src} alt="" fill sizes="320px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  title,
  text,
  image,
  available = false,
}: {
  title: string;
  text: string;
  image: string;
  available?: boolean;
}) {
  return (
    <div
      className={`group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-7 ring-1 ring-white/10 ${
        available ? "" : "opacity-80"
      }`}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 380px"
        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
          available ? "" : "grayscale-[70%]"
        }`}
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/10" />
      <span
        className={`absolute left-6 top-6 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
          available ? "bg-rose/90 text-white" : "bg-white/10 text-milk/80 ring-1 ring-white/15"
        }`}
      >
        {available ? "Доступна" : "Скоро"}
      </span>
      <div className="relative">
        <h3 className="font-display text-3xl font-medium leading-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-milk/60">{text}</p>
        {available ? (
          <div className="mt-6 flex gap-2">
            <Link href="/create" className="btn btn-primary btn-sm">
              Создать
            </Link>
            <Link href={EXAMPLE_HREF} className="btn btn-ghost btn-sm">
              Пример
            </Link>
          </div>
        ) : (
          <p className="mt-6 text-sm text-milk/40">Уже готовим — совсем скоро</p>
        )}
      </div>
    </div>
  );
}
