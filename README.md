# Tool Insights Chat

AI chatbot that gives you insights from your connected tools: Calendar, Gmail, Slack, Jira, GitHub, Notion, and more. Built with **Next.js**, **Convex**, **Vercel AI SDK**, **Composio**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Chat with history** – Conversations are persisted in Convex
- **Settings** – Connect external tools via Composio (OAuth)
- **AI insights** – Ask questions like “What’s on my calendar?” or “Summarize my Jira issues”
- **Streaming** – Real-time responses via Vercel AI SDK

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

- **NEXT_PUBLIC_CONVEX_URL** – Run `npx convex dev` (see step 3) to get this
- **COMPOSIO_API_KEY** – From [Composio Settings](https://platform.composio.dev/settings)
- **ANTHROPIC_API_KEY** – From [Anthropic Console](https://console.anthropic.com/settings/keys)

### 3. Convex

```bash
npx convex dev
```

Log in with GitHub, create a project, and Convex will add `NEXT_PUBLIC_CONVEX_URL` to `.env.local`.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and go to **Open Chat**.

### 5. Connect tools

1. Open the chat page
2. Click the **Settings** (gear) icon
3. Click **Connect** next to each tool (Calendar, Gmail, Slack, etc.)
4. Complete the OAuth flow
5. Ask questions like “What’s on my calendar this week?” or “Summarize my recent emails”

## Deploy to Vercel

1. Push to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add the same environment variables in the Vercel dashboard
4. Deploy

## Tech stack

- **Next.js 16** – App Router
- **Convex** – Backend and real-time DB
- **Vercel AI SDK** – Streaming AI chat
- **Composio** – Tool connections (Calendar, Gmail, Slack, Jira, etc.)
- **Tailwind CSS** – Styling
- **TypeScript** – Types
