import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { articles } from "@/data/content";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "База знаний — Сборка" },
      {
        name: "description",
        content: "Статьи, инструкции, шаблоны и методологии для систематизации и роста бизнеса.",
      },
      { property: "og:title", content: "База знаний — Сборка" },
      {
        property: "og:description",
        content: "Практические материалы для собственников и руководителей.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="База знаний"
        title="Практика, методологии, разборы"
        description="Материалы, которые помогают понять, что и в какой последовательности внедрять в бизнесе."
      />

      <div className="container-page py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to="/blog/$slug"
              params={{ slug: a.slug }}
              className="card-soft group flex flex-col p-7"
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {new Date(a.publishedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {a.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Читать{" "}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
