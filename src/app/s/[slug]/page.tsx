import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryView } from "@/components/story/StoryView";

export const metadata: Metadata = {
  title: "Для тебя кое-что приготовили — Lovera",
  description: "Персональная история, созданная специально для тебя.",
};

export default async function StoryPage({ params, searchParams }: PageProps<"/s/[slug]">) {
  const { slug } = await params;
  // В прототипе существует только одна ссылка — /s/demo
  if (slug !== "demo") notFound();
  const { example } = await searchParams;
  return <StoryView example={example !== undefined} />;
}
