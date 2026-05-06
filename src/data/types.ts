export type Stage = "старт" | "рост" | "масштабирование";

export interface Category {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface Solution {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  audience: string;
  contents: string[];
  result: string;
  categorySlug: string;
  tags: string[];
  stage: Stage[];
}

export interface Bundle {
  slug: string;
  title: string;
  audience: string;
  tasks: string[];
  solutionSlugs: string[];
  outcome: string;
  categorySlug: string;
}

export interface Case {
  slug: string;
  company: string;
  categorySlug: string;
  task: string;
  implemented: string[];
  result: string;
  tags: string[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  relatedSolutionSlugs: string[];
  publishedAt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
