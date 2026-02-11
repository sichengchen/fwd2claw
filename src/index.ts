import { handleEmail } from "./email-handler";
import type { Env } from "./types";

export default {
  async email(
    message: ForwardableEmailMessage,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    await handleEmail(message, env, ctx);
  },
} satisfies ExportedHandler<Env>;
