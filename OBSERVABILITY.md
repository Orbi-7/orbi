# ORBI Agent Observability & Debugging

ORBI is an **AI agent** (not a simple chatbot). It uses Composio tools to fetch real data from Gmail, Calendar, Slack, Jira, GitHub, etc. When you ask "What's on my calendar?", it calls tools to get the actual data.

## Debugging Empty Responses

If you get an empty response:

1. **Check the terminal** – Tool calls are logged: `[Tool used: COMPOSIO_SEARCH_TOOLS]`, etc. If tools run but no text appears, the model may be hitting the step limit before generating a reply.
2. **Langfuse traces** – With Langfuse enabled, you can see the full trace: each tool call, model inputs/outputs, latency, and where it stopped.
3. **Prompt change** – The system prompt now instructs the model to ALWAYS write a text response after using tools.

## Langfuse Setup (Optional)

Langfuse gives you traces, spans, and cost/latency data—similar to LangSmith or Datadog for LLMs.

### 1. Install (already in package.json)

```bash
npm install
```

### 2. Get Langfuse keys

- Sign up at [cloud.langfuse.com](https://cloud.langfuse.com) (free tier)
- Create a project → Settings → API Keys
- Copy Secret Key and Public Key

### 3. Add to `.env.local`

```env
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com
```

### 4. Restart the dev server

```bash
npm run dev
```

### 5. View traces

After a chat, go to [Langfuse](https://cloud.langfuse.com) → Traces. You'll see:

- Each request as a trace
- Model calls (Gemini) with inputs/outputs
- Tool calls (COMPOSIO_SEARCH_TOOLS, COMPOSIO_MULTI_EXECUTE_TOOL, etc.)
- Latency and token usage

## LangGraph vs Langfuse

- **LangGraph** – Framework for building agent workflows (state machines, cycles, human-in-the-loop). Use it if you want to *reimagine* ORBI as a graph-based agent.
- **Langfuse** – Observability platform for *debugging and monitoring*. Use it to inspect traces, find empty-response bugs, and optimize.

ORBI currently uses Vercel AI SDK + Composio. Langfuse integrates with that stack for tracing. LangGraph would be a separate architecture choice.
