import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Layers, TrendingUp, Search, Users, type LucideIcon } from "lucide-react";
import type { Solution, Bundle, Case, Category } from "@/data/types";

const iconMap: Record<string, LucideIcon> = {
  layers: Layers,
  "trending-up": TrendingUp,
  search: Search,
  users: Users,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.icon] ?? Layers;
  return (
    <Link
      to="/catalog/$category"
      params={{ category: category.slug }}
      className="card-soft group flex h-full flex-col p-6 md:p-8"
    >
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold">{category.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Подробнее
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}

export function SolutionCard({
  solution,
  compact = false,
}: {
  solution: Solution;
  compact?: boolean;
}) {
  return (
    <Link
      to="/catalog/solution/$slug"
      params={{ slug: solution.slug }}
      className={`card-soft group flex h-full flex-col ${compact ? "p-5" : "p-6"}`}
    >
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Отдельное решение
      </div>
      <h3 className="mt-3 text-lg font-semibold">{solution.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{solution.summary}</p>
      {!compact && (
        <div className="mt-5 grid gap-3 text-sm">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Для кого
            </div>
            <p className="mt-1 line-clamp-2">{solution.audience}</p>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-success">
              Результат
            </div>
            <p className="mt-1 line-clamp-2">{solution.result}</p>
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {!compact &&
          solution.stage.map((stage) => (
            <span
              key={stage}
              className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
            >
              {stage}
            </span>
          ))}
        {solution.tags.slice(0, 3).map((t) => (
          <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Подробнее
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}

export function BundleCard({ bundle }: { bundle: Bundle }) {
  return (
    <Link
      to="/catalog/bundle/$slug"
      params={{ slug: bundle.slug }}
      className="card-soft group flex h-full flex-col p-7"
    >
      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
        Готовый набор
      </div>
      <h3 className="mt-4 text-2xl font-semibold">{bundle.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{bundle.audience}</p>
      <div className="mt-4 text-sm font-medium text-primary">
        В наборе {bundle.solutionSlugs.length} решений
      </div>

      <div className="mt-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Закрывает задачи
        </div>
        <ul className="mt-2 space-y-1 text-sm">
          {bundle.tasks.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/60" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 hairline-t pt-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Результат
        </div>
        <p className="mt-2 text-sm">{bundle.outcome}</p>
      </div>

      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Открыть набор
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}

export function CaseCard({ kase }: { kase: Case }) {
  return (
    <article className="card-soft flex h-full flex-col p-7">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Кейс</div>
      <h3 className="mt-3 text-lg font-semibold">{kase.company}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{kase.task}</p>

      <div className="mt-5">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Внедрено
        </div>
        <ul className="mt-2 space-y-1 text-sm">
          {kase.implemented.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-lg bg-success/10 p-4 text-sm text-success">
        <div className="text-[11px] font-semibold uppercase tracking-wider">Результат</div>
        <div className="mt-1 font-medium text-foreground">{kase.result}</div>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {kase.tags.map((t) => (
          <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
