import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { FAQItem } from "@/data/types";

export function FAQList({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-[color:var(--hairline)] rounded-2xl border border-[color:var(--hairline)] bg-card">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.question}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-base font-medium md:text-lg">{it.question}</span>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-sm text-muted-foreground md:text-base">
                {it.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
