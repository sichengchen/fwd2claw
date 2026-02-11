# fwd2claw

A Cloudflare Email Worker that forwards incoming emails to [OpenClaw](https://openclaw.ai) webhooks for AI-powered processing. OpenClaw handles the email and responds to the sender via their preferred IM channel.

## How it works

1. Email arrives at your Cloudflare-routed address (e.g. `agent@yourdomain.com`)
2. The worker parses the email (sender, subject, body, attachment summaries)
3. Forwards the content to OpenClaw's `/hooks/agent` endpoint
4. OpenClaw processes the email and replies to the sender on their selected IM

## Setup

### Prerequisites

- A Cloudflare account with [Email Routing](https://developers.cloudflare.com/email-routing/) enabled on your domain
- An [OpenClaw](https://openclaw.ai) account with a webhook token

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
pnpm push
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
