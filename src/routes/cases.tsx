import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/site/PageHero";
import { CaseCard } from "@/components/site/Cards";
import { FinalCTA } from "@/components/site/CTA";
import { cases, categories } from "@/data/content";

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: "Кейсы — readyHub" },
      {
        name: "description",
        content: "Реальные результаты внедрения готовых решений в бизнесах разного масштаба.",
      },
      { property: "og:title", content: "Кейсы — readyHub" },
      {
        property: "og:description",
        content: "Что получают компании после внедрения решений из платформы.",
      },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  const [filter, setFilter] = useState<string>("all");
  const list = useMemo(
    () => (filter === "all" ? cases : cases.filter((c) => c.categorySlug === filter)),
    [filter],
  );

  return (
    <>
      <PageHero
        eyebrow="Кейсы"
        title="Что получают компании"
        description="Кейсы по направлениям: систематизация, инвестиции, маркетинг, команда."
      />

      <div className="container-page py-12">
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-2 text-sm ${filter === "all" ? "bg-foreground text-background" : "border border-[color:var(--hairline)] text-muted-foreground hover:text-foreground"}`}
          >
            Все
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setFilter(c.slug)}
              className={`rounded-full px-4 py-2 text-sm ${filter === c.slug ? "bg-foreground text-background" : "border border-[color:var(--hairline)] text-muted-foreground hover:text-foreground"}`}
            >
              {c.title}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CaseCard key={c.slug} kase={c} />
          ))}
        </div>
      </div>

      <FinalCTA />
    </>
  );
}
