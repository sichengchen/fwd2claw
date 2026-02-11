import PostalMime from "postal-mime";
import type { ParsedEmail } from "./types";

export async function parseEmail(
  message: ForwardableEmailMessage
): Promise<ParsedEmail> {
  const raw = await new Response(message.raw).arrayBuffer();
  const email = await PostalMime.parse(raw);

  const attachmentSummary =
    email.attachments.length > 0
      ? email.attachments
          .map(
            (a) => {
              const size =
                typeof a.content === "string"
                  ? a.content.length
                  : a.content.byteLength;
              return `${a.filename || "unnamed"} (${a.mimeType}, ${formatBytes(size)})`;
            }
          )
          .join(", ")
      : "none";

  return {
    from: message.from,
    fromName: email.from?.name || "",
    to: message.to,
    subject: email.subject || "(no subject)",
    text: email.text || "",
    html: email.html || "",
    date: email.date || new Date().toISOString(),
    messageId: email.messageId || "",
    attachmentSummary,
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
