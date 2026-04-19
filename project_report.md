# Design and Implementation of an Agentic AI Interface for Information Unification across Third-Party Platforms

**A comprehensive implementation report for the ORBI (Tool Insights Chat) framework**

**Author Name:** [Your Name]  
**Department:** Computer Science / Software Engineering  
**Date:** [Current Date]

---

## Abstract

As enterprise environments increasingly rely on decentralized Software as a Service (SaaS) platforms, workers face significant cognitive friction due to persistent context switching. Traditional information retrieval systems lack the contextual understanding necessary to search and synthesize cross-platform data. In this paper, we present **ORBI (Tool Insights Chat)**, an autonomous, agentic system designed to unify fragmented digital workspaces. 

By leveraging Large Language Models (LLMs) instructed through function-calling paradigms, ORBI integrates directly with platforms such as Jira, Slack, GitHub, and Google Workspace. Implemented using Next.js, Convex, and the Vercel AI SDK—with Composio orchestrating secure tool execution via OAuth—the proposed architecture demonstrates a highly responsive, real-time query interface. This report outlines the system architecture, discusses the implementation methodology, evaluates observability using Langfuse, and presents the operational results of the system in a simulated enterprise context.

---

## 1. Introduction

In contemporary workflow environments, knowledge is siloed across dozens of specialized applications. For instance, project specifications reside in Jira, active conversations in Slack, code repositories in GitHub, and schedules in Google Calendar. Moving between these platforms—a phenomenon termed *context switching*—has been empirically shown to decrease productivity and elevate cognitive load.

To mitigate this operational inefficiency, this project introduces ORBI, a full-stack, autonomous artificial intelligence interface. ORBI operates beyond the boundaries of traditional rules-based chatbots. Instead, it utilizes an agentic framework where an underlying Large Language Model (LLM) is provided with programmatic "tools." When a human user requests an update, the model determines which third-party tool to invoke, initiates the API request, and synthetically constructs a unified natural language answer.

---

## 2. System Objectives

The core objectives guiding the architectural design of this system are:

1. **Autonomous Tool Invocation**: To allow the agent to execute real-world APIs independently based on inferred user intent.
2. **Real-Time Responsiveness**: To ensure latency is minimized by employing HTTP streaming responses and a real-time reactive database.
3. **Secure Authentication**: To protect User-level OAuth tokens while restricting data access to authorized individuals only.
4. **Observability**: To establish robust debugging trails using LLM traces that monitor token use, latency, and step-by-step reasoning.

---

## 3. Methodology and Architecture

The system relies on a client-server paradigm decoupled through serverless Edge functions. The flow represents a complex event-driven lifecycle managed concurrently by several modern frameworks.

### 3.1 Tech Stack Selection

The system synthesizes the following technologies to accomplish the objectives:

* **Next.js 16 & React 19**: Functions as the core framework, handling routing (App Router) and the user interface.
* **Convex**: A real-time backend platform that maintains the globally synchronized state of conversations and messages.
* **Vercel AI SDK**: Used for managing the continuous real-time stream of text generation from the LLM, managing the history, and orchestrating function tools.
* **Composio**: Serves as the middle-layer tool gateway. It handles OAuth handshakes and translates the LLM's function invocation into standardized third-party API calls (e.g., retrieving emails from Gmail).
* **Langfuse**: Integrated directly into the telemetry pipeline via OpenTelemetry to record granular invocation traces.

### 3.2 Data Persistence and Schema

Information relating to user chat history requires persistent storage with immediate retrieval. Convex replaces traditional SQL databases to manage real-time updates. The schema is normalized into two entities:

* **Conversations Table**: Records metadata per thread including `userId`, `title`, and temporal markers.
* **Messages Table**: A child entity recording the conversational context including the `role` (System, User, Assistant), raw `content`, and metadata about which `toolCalls` the AI invoked during generation.

### 3.3 Execution Workflow

The runtime lifecycle of an ORBI query operates in four fundamental stages:

1. **Input Analysis**: A user prompt (e.g., "Summarize my active Jira tickets") is transmitted via Next.js Edge APIs.
2. **LLM Evaluation**: The underlying LLM considers the input against the suite of connected Composio tools arrayed in its system prompt.
3. **Function Calling**: The LLM pauses generation and outputs a JSON object requesting the `COMPOSIO_JIRA_SEARCH` tool.
4. **Synthesis**: Composio executes the query. The resulting JSON payload is fed back to the LLM, which finally streams the formatted string to the Next.js client.

---

## 4. Implementation Results & Interfaces

The frontend interface relies on Tailwind CSS to present a seamless conversational UI. The architecture has been successfully executed locally without performance bottlenecking.

### 4.1 Connectors Interface

To ensure strict security and access delegation, the application exposes a `/connectors` route. This is where users authorize the system to interface with their personal accounts. Authentication states are tied securely to the user ID via Clerk.

![The Configuration Interface managing active Composio integrations for third-party tools.](images/connectors.png)
*(Note: Ensure you place your screenshot at `images/connectors.png`)*

### 4.2 Conversational Interface

The `/chat` route displays history dynamically loaded through Convex reactive bindings. Tool calls are rendered cleanly into the conversation flow, avoiding exposing users to raw JSON from the execution.

![The core ORBI chat interface, displaying a successful unification query pulling live data.](images/chat_interface.png)
*(Note: Ensure you place your screenshot at `images/chat_interface.png`)*

---

## 5. Evaluation and Observability

Evaluating non-deterministic generation models requires telemetry. Using Langfuse, each interaction—ranging from initial prompt to final generation—is constructed into a "Trace." Langfuse metrics confirmed that:

* The model strictly adheres to tool instructions given by Composio without hallucinating fictional tools.
* Multi-step workflows (e.g., searching an email then mapping it to a calendar event) function reliably, albeit with slightly increased time-to-first-token (TTFT) metrics due to external API latency limitations.

A significant challenge noted during implementation involved handling empty model responses when maximum token step limits were met prior to synthesis. Hardcoded prompt engineering via the Vercel AI SDK was utilized to forcibly demand an overarching textual conclusion.

---

## 6. Conclusion and Future Enhancements

ORBI successfully proves the viability of agent-based system architectures in reducing software platform fragmentation. By moving away from predefined logic chains to autonomous LLM tool calling, the system remains infinitely scalable—adding support for new endpoints requires only connecting a new Composio toolkit rather than hardcoding new middleware logic.

**Future Work:**
Future iterations of this architecture aim to introduce *LangGraph*. Transitioning from the linear Vercel AI function-calling execution to a cyclical graph-based methodology will empower the agent with self-reflection. An agent built on LangGraph could critically evaluate its own fetched API results and automatically retry with modified search parameters if initial responses are unsatisfactory, bridging the gap towards full Artificial General Intelligence (AGI) within restricted operational domains.

---

## References

1. Vercel AI SDK Documentation. *Vercel Inc.*, 2024. [https://sdk.vercel.ai/](https://sdk.vercel.ai/)
2. Convex Developer Documentation. *Convex Inc.*, 2024. [https://docs.convex.dev/](https://docs.convex.dev/)
3. Composio Platform Guide. *Composio*, 2024. [https://platform.composio.dev/](https://platform.composio.dev/)
4. Langfuse: Open Source LLM Observability. *Langfuse*, 2024. [https://langfuse.com/](https://langfuse.com/)
5. React 19 release architecture and specifications. *Meta Platforms*, 2024. [https://react.dev/](https://react.dev/)
