import type { Env, ParsedEmail, OpenClawWebhookPayload } from "./types";

export async function forwardToOpenClaw(
  parsed: ParsedEmail,
  env: Env
): Promise<Response> {
  const payload: OpenClawWebhookPayload = {
    message: formatEmailForAgent(parsed),
    name: `Email from ${parsed.fromName || parsed.from}`,
    sessionKey: `hook:email:${parsed.from}`,
    deliver: true,
    channel: env.OPENCLAW_CHANNEL,
  };

  const response = await fetch(env.OPENCLAW_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENCLAW_API_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `OpenClaw webhook failed: ${response.status} ${response.statusText} - ${body}`
    );
  }

  return response;
}

function formatEmailForAgent(parsed: ParsedEmail): string {
  const parts: string[] = [
    `From: ${parsed.fromName ? `${parsed.fromName} <${parsed.from}>` : parsed.from}`,
    `To: ${parsed.to}`,
    `Subject: ${parsed.subject}`,
    `Date: ${parsed.date}`,
  ];

  if (parsed.messageId) {
    parts.push(`Message-ID: ${parsed.messageId}`);
  }

  parts.push("");

  if (parsed.text) {
    parts.push(parsed.text);
  } else if (parsed.html) {
    parts.push("[HTML email body]");
    parts.push(parsed.html);
  } else {
    parts.push("[Empty email body]");
  }

  if (parsed.attachmentSummary !== "none") {
    parts.push("");
    parts.push(`Attachments: ${parsed.attachmentSummary}`);
  }

  return parts.join("\n");
}
