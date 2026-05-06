import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SolutionCard, BundleCard, CaseCard } from "@/components/site/Cards";
import { FinalCTA } from "@/components/site/CTA";
import { FAQList } from "@/components/site/FAQ";
import { categories, solutions, bundles, cases, faq } from "@/data/content";

export const Route = createFileRoute("/catalog/$category")({
  loader: ({ params }) => {
    const category = categories.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.title} — направление | Сборка` },
          { name: "description", content: loaderData.category.description },
          { property: "og:title", content: `${loaderData.category.title} — Сборка` },
          { property: "og:description", content: loaderData.category.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold">Направление не найдено</h1>
      <Link to="/catalog" className="mt-6 inline-flex text-primary">
        К каталогу
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-page py-24 text-center text-muted-foreground">{error.message}</div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const catSolutions = solutions.filter((s) => s.categorySlug === category.slug);
  const catBundles = bundles.filter((b) => b.categorySlug === category.slug);
  const catCases = cases.filter((c) => c.categorySlug === category.slug);

  return (
    <>
      <PageHero eyebrow="Направление" title={category.title} description={category.description}>
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Подобрать решение <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      {catBundles.length > 0 && (
        <section className="container-page py-16">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Готовые наборы по направлению</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {catBundles.map((b) => (
              <BundleCard key={b.slug} bundle={b} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Решения внутри направления</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {catSolutions.map((s) => (
            <SolutionCard key={s.slug} solution={s} />
          ))}
        </div>
      </section>

      {catCases.length > 0 && (
        <section className="container-page py-16">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Кейсы по направлению</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {catCases.map((c) => (
              <CaseCard key={c.slug} kase={c} />
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Частые вопросы</h2>
        <FAQList items={faq} />
      </section>

      <FinalCTA />
    </>
  );
}
