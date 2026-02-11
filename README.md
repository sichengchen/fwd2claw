# fwd2claw

A Cloudflare Email Worker that forwards incoming emails to [OpenClaw](https://openclaw.ai) webhooks. OpenClaw handles the email and responds to the sender via their preferred IM channel.

## Quick Start

Tell your OpenClaw 🦞 to enable the webhook and generate a token. Then,

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fsichengchen%2Ffwd2claw)

## Setup

### Prerequisites

- A Cloudflare account with [Email Routing](https://developers.cloudflare.com/email-routing/) enabled on your domain
- An [OpenClaw](https://openclaw.ai) 🦞 with [webhook](https://docs.openclaw.ai/automation/webhook) enabled.

### Install

```bash
pnpm install
```

### Configure

1. Edit `wrangler.toml` and set your OpenClaw webhook URL:

   ```toml
   [vars]
   OPENCLAW_WEBHOOK_URL = "https://your-instance.openclaw.ai/hooks/agent"
   ALLOWED_SENDER = "you@example.com"
   OPENCLAW_CHANNEL = "last"
   ```

   - `ALLOWED_SENDER` — only emails from this address will be processed; all others are silently ignored.
   - `OPENCLAW_CHANNEL` — IM channel for delivery. One of: `last`, `whatsapp`, `telegram`, `discord`, `slack`, `mattermost`, `signal`, `imessage`, `msteams`. Defaults to `last`.

2. Set the API token as a secret:

   ```bash
   pnpm wrangler secret put OPENCLAW_API_TOKEN
   ```

### Deploy

```bash
pnpm upload
```

### Enable email routing

In the Cloudflare dashboard:

1. Go to your domain > **Email** > **Email Routing**
2. Ensure Email Routing is enabled (MX/SPF/DKIM records configured)
3. Go to the **Email Workers** tab
4. Create a route: set a custom address (e.g. `agent@yourdomain.com`) and select `fwd2claw` as the destination

## Development

```bash
pnpm dev          # start local dev server
pnpm typecheck    # run TypeScript type checking
```

Monitor deployed logs:

```bash
pnpm wrangler tail
```

## Project structure

```
src/
  index.ts          # Entry point — exports email handler
  email-handler.ts  # Core handler orchestration
  openclaw.ts       # OpenClaw webhook client + payload formatting
  parse-email.ts    # Email parsing via postal-mime
  types.ts          # Shared TypeScript interfaces
```

## License

MIT
