export interface Env {
  OPENCLAW_WEBHOOK_URL: string;
  OPENCLAW_API_TOKEN: string;
  ALLOWED_SENDER: string;
  OPENCLAW_CHANNEL: string;
}

export interface ParsedEmail {
  from: string;
  fromName: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  date: string;
  messageId: string;
  attachmentSummary: string;
}

export interface OpenClawWebhookPayload {
  message: string;
  name: string;
  sessionKey: string;
  deliver: boolean;
  channel: string;
}
