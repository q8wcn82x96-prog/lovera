import type { Metadata } from "next";
import { Wizard } from "@/components/create/Wizard";

export const metadata: Metadata = {
  title: "Создать историю — Lovera",
};

export default function CreatePage() {
  return <Wizard />;
}
