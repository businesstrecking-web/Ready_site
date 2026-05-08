const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ContactPayload = {
  name?: string;
  contact?: string;
  business?: string;
  stage?: string;
  team_size?: string;
  task?: string;
  tried?: string;
  deadline?: string;
  comment?: string;
  source_page?: string;
};

const clean = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 3000);
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const sendTelegramNotification = async (payload: Required<ContactPayload>) => {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!token || !chatId) return;

  const lines = [
    "<b>Новая заявка readyHub</b>",
    `Имя: ${escapeHtml(payload.name)}`,
    `Контакт: ${escapeHtml(payload.contact)}`,
    payload.business ? `Бизнес: ${escapeHtml(payload.business)}` : "",
    payload.stage ? `Стадия: ${escapeHtml(payload.stage)}` : "",
    payload.team_size ? `Команда: ${escapeHtml(payload.team_size)}` : "",
    payload.task ? `Задача: ${escapeHtml(payload.task)}` : "",
    payload.deadline ? `Срок: ${escapeHtml(payload.deadline)}` : "",
    payload.comment ? `Комментарий: ${escapeHtml(payload.comment)}` : "",
    payload.source_page ? `Источник: ${escapeHtml(payload.source_page)}` : "",
  ].filter(Boolean);

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Server is not configured" }, 500);
  }

  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const payload = {
    name: clean(body.name),
    contact: clean(body.contact),
    business: clean(body.business),
    stage: clean(body.stage),
    team_size: clean(body.team_size),
    task: clean(body.task),
    tried: clean(body.tried),
    deadline: clean(body.deadline),
    comment: clean(body.comment),
    source_page: clean(body.source_page),
  };

  if (!payload.name || !payload.contact) {
    return json({ error: "Name and contact are required" }, 400);
  }

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/contacts`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });

  if (!insertResponse.ok) {
    return json({ error: "Could not save contact request" }, 500);
  }

  try {
    await sendTelegramNotification(payload);
  } catch {
    return json({ ok: true, telegram: "failed" });
  }

  return json({ ok: true });
});
