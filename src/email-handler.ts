import type { Env } from "./types";
import { parseEmail } from "./parse-email";
import { forwardToOpenClaw } from "./openclaw";

export async function handleEmail(
  message: ForwardableEmailMessage,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  try {
    console.log(
      `Received email from ${message.from} to ${message.to} (${message.rawSize} bytes)`
    );

    if (message.from !== env.ALLOWED_SENDER) {
      console.log(`Ignored: sender ${message.from} is not ${env.ALLOWED_SENDER}`);
      return;
    }

    const parsed = await parseEmail(message);
    console.log(
      `Parsed: subject="${parsed.subject}", text=${parsed.text.length} chars, attachments=${parsed.attachmentSummary}`
    );

    ctx.waitUntil(
      forwardToOpenClaw(parsed, env)
        .then((res) => {
          console.log(`OpenClaw webhook responded: ${res.status}`);
        })
        .catch((err) => {
          console.error(`OpenClaw webhook error: ${err}`);
        })
    );
  } catch (err) {
    console.error(`Failed to process email from ${message.from}: ${err}`);
  }
}
