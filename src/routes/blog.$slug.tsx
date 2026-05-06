import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { SolutionCard } from "@/components/site/Cards";
import { FinalCTA } from "@/components/site/CTA";
import { articles, solutions } from "@/data/content";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.article.title} — Сборка` },
          { name: "description", content: loaderData.article.excerpt },
          { property: "og:title", content: loaderData.article.title },
          { property: "og:description", content: loaderData.article.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold">Статья не найдена</h1>
      <Link to="/blog" className="mt-6 inline-flex text-primary">
        К базе знаний
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="container-page py-24">{error.message}</div>,
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = article.relatedSolutionSlugs
    .map((slug) => solutions.find((solution) => solution.slug === slug))
    .filter(Boolean) as typeof solutions;

  return (
    <>
      <PageHero eyebrow="База знаний" title={article.title} description={article.excerpt} />
      <article className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-foreground/90">
          {article.body.split("\n\n").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
      {related.length > 0 && (
        <section className="container-page pb-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold">Подходящие решения по теме</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((solution) => (
                <SolutionCard key={solution.slug} solution={solution} compact />
              ))}
            </div>
          </div>
        </section>
      )}
      <FinalCTA />
    </>
  );
}
