import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculators, getCalculatorBySlug } from "@/data/calculators";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { createCalculatorMetadata } from "@/lib/seo";
import type { CalculatorSlug } from "@/types/calculator";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return calculators.map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) return {};
  return createCalculatorMetadata(calculator.slug as CalculatorSlug);
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    notFound();
  }

  return <CalculatorShell config={calculator} />;
}
