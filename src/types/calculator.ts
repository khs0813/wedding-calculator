export type CalculatorSlug =
  | "wedding-cost"
  | "newlywed-home-budget"
  | "wedding-hall-cost"
  | "studio-dress-makeup-cost"
  | "honsu-budget"
  | "wedding-gift-budget"
  | "honeymoon-budget"
  | "congratulatory-money";

export type GuideSlug =
  | "wedding-cost-guide"
  | "newlywed-budget-guide"
  | "wedding-saving-tips"
  | "wedding-hall-checklist"
  | "sdme-options-guide"
  | "wedding-gift-negotiation-guide"
  | "honsu-priority-guide"
  | "honeymoon-destination-budget-guide"
  | "congratulatory-money-etiquette-guide"
  | "wedding-budget-timeline-guide"
  | "small-wedding-budget-guide"
  | "newlywed-loan-planning-guide"
  | "wedding-contract-check-guide";

export type FieldType = "money" | "number" | "percent" | "select" | "checkbox";

export type FieldOption = {
  label: string;
  value: string;
};

export type FieldValue = number | string | boolean;

export type FieldMeta = {
  label: string;
  note?: string;
};

export type CalculatorField = {
  id: string;
  label: string;
  type: FieldType;
  defaultValue: FieldValue;
  placeholder?: string;
  suffix?: string;
  group?: string;
  helpText?: string;
  options?: FieldOption[];
  required?: boolean;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type CalculatorConfig = {
  slug: CalculatorSlug;
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  hero: string;
  keywords: string[];
  storageKey: string;
  fields: CalculatorField[];
  faqs: FAQItem[];
  relatedSlugs: CalculatorSlug[];
  affiliateKeys: AffiliateKey[];
};

export type BudgetItem = {
  id: string;
  label: string;
  amount: number;
  category: string;
  required?: boolean;
};

export type SummaryItem = {
  label: string;
  value: string;
  description?: string;
};

export type CalculatorResult = {
  primaryLabel: string;
  total: number;
  summary: SummaryItem[];
  items: BudgetItem[];
  advice: string[];
  disclaimer?: string;
};

export type AffiliateKey =
  | "weddingHall"
  | "studioDressMakeup"
  | "homeAppliance"
  | "honeymoon"
  | "cleaning"
  | "internet";

export type AuthorProfile = {
  name: string;
  role: string;
  bio: string;
};

export type RichSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type GuideSource = {
  label: string;
  href: string;
};

export type Guide = {
  slug: GuideSlug;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  author: AuthorProfile;
  reviewedBy?: AuthorProfile;
  sections: RichSection[];
  sources: GuideSource[];
};

export type CalculatorEditorialContent = {
  intro: string;
  updatedAt: string;
  author: AuthorProfile;
  sections: RichSection[];
  checklist: string[];
  relatedGuideSlugs: GuideSlug[];
};

export type SiteContentPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  updatedAt: string;
  label: string;
  sections: RichSection[];
};
