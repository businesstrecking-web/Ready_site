import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { BundleCard, SolutionCard } from "@/components/site/Cards";
import { FinalCTA } from "@/components/site/CTA";
import { bundles, solutions, categories } from "@/data/content";

export const Route = createFileRoute("/catalog/bundle/$slug")({
  loader: ({ params }) => {
    const bundle = bundles.find((b) => b.slug === params.slug);
    if (!bundle) throw notFound();
    return { bundle };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.bundle.title} — набор решений | Сборка` },
          { name: "description", content: loaderData.bundle.outcome },
          { property: "og:title", content: `${loaderData.bundle.title} — Сборка` },
          { property: "og:description", content: loaderData.bundle.outcome },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold">Набор не найден</h1>
      <Link to="/catalog" className="mt-6 inline-flex text-primary">
        К каталогу
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="container-page py-24">{error.message}</div>,
  component: BundlePage,
});

function BundlePage() {
  const { bundle } = Route.useLoaderData();
  const category = categories.find((c) => c.slug === bundle.categorySlug);
  const inside = bundle.solutionSlugs
    .map((s: string) => solutions.find((x) => x.slug === s))
    .filter(Boolean) as typeof solutions;
  const otherBundles = bundles.filter((b) => b.slug !== bundle.slug).slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={category ? `Направление · ${category.title}` : "Набор решений"}
        title={bundle.title}
        description={bundle.audience}
      >
        <Link
          to="/contacts"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Подобрать набор под бизнес <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      <div className="container-page pt-8 text-sm text-muted-foreground">
        <Link to="/catalog" className="hover:text-foreground">
          Каталог
        </Link>{" "}
        / {bundle.title}
      </div>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card-soft p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Какие задачи закрывает
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {bundle.tasks.map((t: string) => (
                <li key={t} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-soft p-7">
            <div className="text-xs font-semibold uppercase tracking-wider text-success">
              Что получает бизнес
            </div>
            <p className="mt-4 text-base">{bundle.outcome}</p>
          </div>
        </div>
      </section>

      <section className="container-page py-8">
        <div className="card-soft card-static grid gap-6 p-7 md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Формат
            </div>
            <p className="mt-2 text-sm">
              Готовая последовательность решений под одну бизнес-задачу.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Подходит, когда
            </div>
            <p className="mt-2 text-sm">
              Задача затрагивает несколько процессов и требует системной сборки.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-success">
              Первый шаг
            </div>
            <p className="mt-2 text-sm">
              Разобрать контекст и выбрать, какие блоки внедрять первыми.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-8">
        <h2 className="text-2xl font-bold md:text-3xl">Какие решения входят</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {inside.map((s) => (
            <SolutionCard key={s.slug} solution={s} />
          ))}
        </div>
      </section>

      {otherBundles.length > 0 && (
        <section className="container-page py-16">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Связанные наборы</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {otherBundles.map((b) => (
              <BundleCard key={b.slug} bundle={b} />
            ))}
          </div>
        </section>
      )}

      <FinalCTA title={`Собрать «${bundle.title}» под вашу компанию`} />
    </>
  );
}
