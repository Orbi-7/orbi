<div align="center">
  <img src="public/globe.svg" alt="ORBI Logo" width="100" />
  
  # ORBI: Tool Insights Agent

  <p><strong>An autonomous AI agent to unify your digital workspace (Jira, Slack, GitHub & more).</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Convex-Realtime-blue?style=flat" alt="Convex" />
    <img src="https://img.shields.io/badge/Vercel_AI_SDK-Streaming-black" alt="Vercel AI SDK" />
    <img src="https://img.shields.io/badge/Composio-Agentic_Tools-blueviolet" alt="Composio" />
    <img src="https://img.shields.io/badge/TailwindCSS-Fast-38B2AC?style=flat&logo=tailwind-css" alt="Tailwind" />
  </p>
</div>

---

## 📖 Overview

**ORBI (Tool Insights Chat)** resolves the friction of modern "information siloing." Traditional workflow environments force users to constantly context-switch across dozens of SaaS platforms. 

ORBI operates beyond standard chatbots. Built on an **agentic architecture** using **function-calling**, ORBI analyzes your prompts and securely integrates directly with third-party tools via **OAuth** to fetch, synthesize, and format live data into a singular streaming conversational interface.

Ask ORBI:
* *"What meetings are on my calendar today?"*
* *"Summarize my active Jira tickets assigned to me."*
* *"Read my latest unread Slack messages."*

---

## ✨ Features

- **🌐 Cross-Platform Integrations**: Connect seamlessly to Google Workspace, Slack, Jira, GitHub, Notion, and more via `Composio`.
- **🤖 Autonomous Intelligence**: Uses Vercel AI SDK and advanced foundational models (Anthropic, OpenAI, or Gemini) to execute programmatic tool requests dynamically.
- **⚡ Real-time Reactive State**: Global chat history backed by `Convex` so thread data never feels sluggish to load.
- **🔐 Secure Delegation**: Uses `Clerk` to safely associate complex OAuth token chains only to the authorized end-user.
- **📊 Robust Observability**: Native telemetry mapped straight to `Langfuse` to monitor latency, tokens, and trace AI tool calls.
- **🎨 Glassmorphic Interface**: Fully responsive, dynamic frontend stylized with Next.js and Tailwind CSS 4.

---

## 🚀 Quick Start

### 1. Pre-requisites
Ensure you have the following before you begin:
- **Node.js**: `v20+` recommended.
- A free **[Convex](https://dashboard.convex.dev)** account.
- A free **[Composio](https://platform.composio.dev)** account (for API key).
- A free **[Langfuse](https://cloud.langfuse.com)** account (optional, for tracing).

### 2. Fork and Install
Clone the repository recursively and install all essential packages:

```bash
git clone https://github.com/Orbi-7/orbi.git
cd orbi
npm install
```

### 3. Setup Environment Variables
Clone the `.env.example` file to create your own local secrets:

```bash
cp .env.example .env.local
```
Fill out `.env.local` with the following:
* `NEXT_PUBLIC_CONVEX_URL` — Acquired in the next step.
* `COMPOSIO_API_KEY` — From your Composio settings.
* `GOOGLE_GENERATIVE_AI_API_KEY` — (Or whichever LLM SDK token you prefer).
* `LANGFUSE_SECRET_KEY` & `LANGFUSE_PUBLIC_KEY` — (Optional) For metrics.

### 4. Initialize Database
Bootstrap the Convex real-time deployment:
```bash
npx convex dev
```
*(This command will autonomously patch your `.env.local` to include your new Convex Backend URL).*

### 5. Launch the Agent
In a separate terminal, spin up the local Next.js frontend:
```bash
npm run dev
```

Navigate to `http://localhost:3000`. Create an account, authorize your connectors on the `/connectors` page, and jump straight into `/chat` to test your agent!

---

## 🧠 System Architecture

* **Client**: React 19 Client components handling UI layout, streaming payload states, and Clerk authentication forms.
* **Middle-Tier API**: Next.js Edge routes defining the `DefaultChatTransport`. Translates prompts into the `ai` module while binding Composio Toolkit mappings.
* **Data Layer**: Convex Functions (`schema.ts`, `messages.ts`, `conversations.ts`) execute backend database mutations synchronously.
* **Agent Evaluator**: Evaluates user goals against enabled Integrations, outputs JSON schema parameters to Composio, and resolves the returned structure into formatted Markdown strings.

---

## 🤝 Contribution Guidelines
This project is open-source. For massive architectural restructuring (e.g. migrating from Vercel AI SDK to LangGraph), please open an initial issue thread. If fixing minor UI mismatches or simple component refactoring, PRs are always welcome.

## 📄 License
This project is licensed under the MIT License.
