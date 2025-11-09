// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type DbWebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: Record<string, unknown>;
  old_record?: Record<string, unknown> | null;
  new?: Record<string, unknown>;
};

const slackWebhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");

const sourceFromMessage = (message?: string | null) => {
  if (!message) return undefined;
  const lowered = message.toLowerCase();
  if (lowered.includes("sms")) return "SMS Playbook";
  if (lowered.includes("calculator")) return "Retention Calculator";
  return undefined;
};

const buildSlackBody = (record: Record<string, unknown>) => {
  const name = (record.name as string) || "Unknown lead";
  const email = (record.email as string) || "Unknown email";
  const brand =
    (record.brand_name as string) ||
    (record.brandName as string) ||
    "—";
  const website = (record.website as string) || "—";
  const message = (record.message as string) || "";
  const source =
    (record.source as string) || sourceFromMessage(message) || "Resource";

  const fields = [
    { type: "mrkdwn", text: `*Name:*\n${name}` },
    { type: "mrkdwn", text: `*Email:*\n${email}` },
    { type: "mrkdwn", text: `*Brand:*\n${brand}` },
    { type: "mrkdwn", text: `*Website:*\n${website}` },
    { type: "mrkdwn", text: `*Source:*\n${source}` },
  ];

  const blocks: Array<Record<string, unknown>> = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "New TopTHCA Resource Lead",
      },
    },
    {
      type: "section",
      fields,
    },
  ];

  if (message) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Message*\n${message}`,
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `Captured at ${new Date().toISOString()}`,
      },
    ],
  });

  return {
    text: `New ${source} lead: ${name} (${email})`,
    blocks,
  };
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!slackWebhookUrl) {
    console.error("SLACK_WEBHOOK_URL is not configured");
    return new Response("Slack webhook not configured", { status: 500 });
  }

  let payload: DbWebhookPayload | null = null;

  try {
    payload = (await req.json()) as DbWebhookPayload;
  } catch (error) {
    console.error("Failed to parse payload", error);
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const record =
    payload?.record ??
    payload?.new ??
    (payload as unknown as Record<string, unknown> | undefined);

  if (!record || typeof record !== "object") {
    console.error("No record found in payload:", payload);
    return new Response("No record data", { status: 400 });
  }

  const body = buildSlackBody(record);

  try {
    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Slack webhook error:", errorText);
      return new Response("Slack webhook failed", { status: 502 });
    }
  } catch (error) {
    console.error("Failed to send Slack message", error);
    return new Response("Slack request failed", { status: 502 });
  }

  return new Response(
    JSON.stringify({ status: "ok" }),
    { headers: { "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/lead-alert' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
