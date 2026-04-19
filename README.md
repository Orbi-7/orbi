# ORBI: Tool Insights Agent

An autonomous AI agent designed to unify digital workspaces by integrating directly with third-party platforms such as Jira, Slack, GitHub, and Google Workspace.

Built with Next.js, Convex, Vercel AI SDK, Composio, Clerk, and Tailwind CSS.

---

## Overview

ORBI (Tool Insights Chat) resolves information siloing. Traditional workflow environments force users to context-switch across dozens of SaaS platforms. ORBI utilizes an agentic architecture fueled by function-calling to analyze prompts, securely integrate with external tools via OAuth, and fetch, synthesize, and format live data into a singular conversational interface.

---

## Features

- **Cross-Platform Integrations**: Connect seamlessly to Google Workspace, Slack, Jira, GitHub, Notion, and more via Composio.
- **Autonomous Intelligence**: Uses the Vercel AI SDK and advanced foundational models to execute programmatic tool requests dynamically.
- **Real-time Reactive State**: Global chat history backed by Convex for instantaneous thread loading.
- **Secure Delegation**: Uses Clerk to safely associate OAuth token chains strictly to the authorized end-user.
- **Robust Observability**: Native telemetry mapped straight to Langfuse to monitor latency, tokens, and trace AI tool calls.

---

## Screenshots

*(Place your application screenshots in an `images/` directory and uncomment the sections below to display them)*

<!-- 
### Chat Interface
![Chat Interface Demo](images/chat_interface.png)
*Figure 1: The core conversational interface dynamically pulling live organizational data.*

### Connector Configuration
![Connectors Page](images/connectors.png)
*Figure 2: The settings interface used to securely bind tools to your user profile.* 
-->

---

## Setup Guide

Follow these steps to configure and run the project locally.

### 1. Pre-requisites
Ensure you have the following before you begin:
- Node.js installed (v20+ recommended).
- A free account on Convex (https://dashboard.convex.dev).
- A free account on Composio (https://platform.composio.dev) to acquire an API key.

### 2. Install Dependencies
Clone the repository and install the required packages:

```bash
git clone https://github.com/Orbi-7/orbi.git
cd orbi
npm install
```

### 3. Environment Variables
Copy the example environment configuration to establish your local secrets:

```bash
cp .env.example .env.local
```
Fill out `.env.local` with the following:
* `COMPOSIO_API_KEY` — Retrieved from your Composio developer settings.
* `GOOGLE_GENERATIVE_AI_API_KEY` — Your specific language model token.
* `LANGFUSE_SECRET_KEY` & `LANGFUSE_PUBLIC_KEY` — (Optional) Required only if monitoring metrics.

### 4. Initialize Database
Bootstrap the Convex real-time deployment:
```bash
npx convex dev
```
Note: This process will intuitively prompt you to log into Convex and it will automatically append your `NEXT_PUBLIC_CONVEX_URL` to your `.env.local` file. Let this process run in the background.

### 5. Launch the Application
Open a new terminal window within the project directory and start the Next.js development server:
```bash
npm run dev
```

Navigate to `http://localhost:3000` in your web browser. You can create an account, authorize your tool connectors under the settings page, and begin interacting with the agent.

---

## System Architecture

* **Client**: React 19 Client components handling UI layout, streaming payload states, and Clerk authentication forms.
* **Middle-Tier API**: Next.js Edge routes defining the transport protocols and binding Composio Toolkit mappings.
* **Data Layer**: Convex serverless functions execute backend database queries synchronously.
* **Agent Evaluator**: Generates structured function requests from prompts, invokes Composio, and resolves the structure into Markdown responses.

---

## License
This project is licensed under the MIT License.
