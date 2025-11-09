const fetch = require("node-fetch");

const buildFunctionUrl = () => {
  const explicitUrl = process.env.LEAD_ALERT_FUNCTION_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    return null;
  }

  return `${supabaseUrl.replace(/\/$/, "")}/functions/v1/lead-alert`;
};

const functionUrl = buildFunctionUrl();

const sendLeadAlert = async (payload) => {
  if (!functionUrl) {
    console.warn(
      "[Lead Alert] Skipping Slack notification: function URL is not configured."
    );
    return;
  }

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(
        `[Lead Alert] Function responded with ${response.status}: ${text}`
      );
    }
  } catch (error) {
    console.error("[Lead Alert] Failed to invoke function:", error);
  }
};

module.exports = { sendLeadAlert };

