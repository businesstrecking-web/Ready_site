const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const statuses = new Set(["new", "in_progress", "waiting", "closed", "rejected"]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const assertAdmin = (password: unknown) => {
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  return typeof password === "string" && adminPassword && password === adminPassword;
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

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!assertAdmin(body.password)) {
    return json({ error: "Unauthorized" }, 401);
  }

  if (body.action === "list") {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/contacts?select=*&order=created_at.desc&limit=200`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );

    if (!response.ok) {
      return json({ error: "Could not load contacts" }, 500);
    }

    return json({ contacts: await response.json() });
  }

  if (body.action === "update_status") {
    const id = typeof body.id === "string" ? body.id : "";
    const status = typeof body.status === "string" ? body.status : "";

    if (!id || !statuses.has(status)) {
      return json({ error: "Invalid status update" }, 400);
    }

    const currentResponse = await fetch(
      `${supabaseUrl}/rest/v1/contacts?id=eq.${id}&select=id,status&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );

    if (!currentResponse.ok) {
      return json({ error: "Could not load current contact" }, 500);
    }

    const currentContacts = await currentResponse.json();
    const currentStatus = currentContacts[0]?.status ?? null;

    const response = await fetch(`${supabaseUrl}/rest/v1/contacts?id=eq.${id}&select=*`, {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      return json({ error: "Could not update contact" }, 500);
    }

    const contacts = await response.json();

    await fetch(`${supabaseUrl}/rest/v1/contact_events`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        contact_id: id,
        event_type: "status_changed",
        from_status: currentStatus,
        to_status: status,
        created_by: "readyhub-admin",
      }),
    });

    return json({ contact: contacts[0] ?? null });
  }

  return json({ error: "Unknown action" }, 400);
});
