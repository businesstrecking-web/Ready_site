import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, Lock, RefreshCw, Search } from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const statusLabels = {
  new: "Новая",
  in_progress: "В работе",
  waiting: "Ждём ответа",
  closed: "Закрыта",
  rejected: "Отказ",
} as const;

type LeadStatus = keyof typeof statusLabels;

type ContactLead = {
  id: string;
  name: string;
  contact: string;
  business: string | null;
  stage: string | null;
  team_size: string | null;
  task: string | null;
  tried: string | null;
  deadline: string | null;
  comment: string | null;
  source_page: string | null;
  status: LeadStatus;
  created_at: string;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "CRM — readyHub" },
      {
        name: "description",
        content: "Внутренняя CRM readyHub для обработки заявок.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("readyhub_admin") ?? "");
  const [inputPassword, setInputPassword] = useState("");
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedLead = leads.find((lead) => lead.id === selectedId) ?? leads[0];

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (!normalizedQuery) return true;

      return [
        lead.name,
        lead.contact,
        lead.business,
        lead.stage,
        lead.team_size,
        lead.task,
        lead.comment,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [leads, query, statusFilter]);

  const requestAdmin = async (body: Record<string, unknown>) => {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase не подключён к сайту.");
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/admin-contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        ...body,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error("Не удалось получить данные CRM.");
    }

    return response.json() as Promise<{ contacts?: ContactLead[]; contact?: ContactLead }>;
  };

  const loadLeads = async () => {
    if (!password) return;

    setLoading(true);
    setError("");

    try {
      const data = await requestAdmin({ action: "list" });
      const contacts = data.contacts ?? [];
      setLeads(contacts);

      if (!selectedId && contacts.length > 0) {
        setSelectedId(contacts[0].id);
      }
    } catch {
      setError("Не удалось открыть CRM. Проверьте пароль и Supabase secrets.");
      sessionStorage.removeItem("readyhub_admin");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    setError("");

    try {
      const data = await requestAdmin({ action: "update_status", id, status });

      if (data.contact) {
        setLeads((items) => items.map((item) => (item.id === id ? data.contact! : item)));
      }
    } catch {
      setError("Не удалось обновить статус заявки.");
    }
  };

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPassword = inputPassword.trim();

    if (!nextPassword) return;

    sessionStorage.setItem("readyhub_admin", nextPassword);
    setPassword(nextPassword);
    setInputPassword("");
  };

  const logout = () => {
    sessionStorage.removeItem("readyhub_admin");
    setPassword("");
    setLeads([]);
    setSelectedId("");
  };

  useEffect(() => {
    void loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  if (!password) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md card-soft card-static p-7">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Вход в CRM</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Введите административный пароль, чтобы открыть заявки readyHub.
          </p>

          <form onSubmit={submitPassword} className="mt-6 grid gap-4">
            <input
              type="password"
              value={inputPassword}
              onChange={(event) => setInputPassword(event.target.value)}
              className="form-input"
              placeholder="Пароль администратора"
              autoComplete="current-password"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Открыть CRM
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            CRM
          </div>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Заявки readyHub</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Новые обращения с формы сайта. Меняйте статус, чтобы видеть текущую работу.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            Обновить
          </button>
          <button
            onClick={logout}
            className="rounded-full border border-[color:var(--hairline)] px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Выйти
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full rounded-lg border border-[color:var(--hairline)] bg-background pl-10 pr-4 text-sm outline-none focus:border-primary"
            placeholder="Поиск по имени, контакту, задаче"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusFilter active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
            Все
          </StatusFilter>
          {(Object.keys(statusLabels) as LeadStatus[]).map((status) => (
            <StatusFilter
              key={status}
              active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            >
              {statusLabels[status]}
            </StatusFilter>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.3fr]">
        <div className="card-soft card-static overflow-hidden">
          <div className="hairline-b flex items-center justify-between px-5 py-4">
            <div className="font-medium">Заявки</div>
            <div className="text-sm text-muted-foreground">{filteredLeads.length}</div>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-muted-foreground">Загружаем заявки...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Заявок пока нет.</div>
          ) : (
            <div className="max-h-[620px] overflow-auto">
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedId(lead.id)}
                  className={`block w-full hairline-b px-5 py-4 text-left transition-colors hover:bg-muted/60 ${
                    selectedLead?.id === lead.id ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{lead.contact}</div>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                    {lead.task || lead.comment || lead.business || "Без описания задачи"}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(lead.created_at)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card-soft card-static p-6">
          {selectedLead ? (
            <>
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <StatusBadge status={selectedLead.status} />
                  <h2 className="mt-3 text-2xl font-bold">{selectedLead.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedLead.contact}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(selectedLead.created_at)}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {(Object.keys(statusLabels) as LeadStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedLead.id, status)}
                    className={`rounded-full px-4 py-2 text-sm transition-colors ${
                      selectedLead.status === status
                        ? "bg-foreground text-background"
                        : "border border-[color:var(--hairline)] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Info label="Тип бизнеса" value={selectedLead.business} />
                <Info label="Стадия" value={selectedLead.stage} />
                <Info label="Размер команды" value={selectedLead.team_size} />
                <Info label="Когда нужен результат" value={selectedLead.deadline} />
              </div>

              <div className="mt-6 grid gap-4">
                <Info label="Задача" value={selectedLead.task} large />
                <Info label="Что уже пробовали" value={selectedLead.tried} large />
                <Info label="Комментарий" value={selectedLead.comment} large />
                <Info label="Источник" value={selectedLead.source_page} large />
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
              <div className="mt-3">Выберите заявку слева.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusFilter({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        active
          ? "bg-foreground text-background"
          : "border border-[color:var(--hairline)] text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className="inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      {statusLabels[status] ?? status}
    </span>
  );
}

function Info({
  label,
  value,
  large = false,
}: {
  label: string;
  value?: string | null;
  large?: boolean;
}) {
  return (
    <div className={`rounded-lg bg-muted/50 p-4 ${large ? "" : "min-h-24"}`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 whitespace-pre-wrap text-sm">{value || "Не указано"}</div>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
