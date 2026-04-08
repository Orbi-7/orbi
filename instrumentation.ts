/**
 * Next.js instrumentation - runs on app startup.
 * Initializes OpenTelemetry with Langfuse span processor for LLM tracing.
 * Add to .env.local:
 *   LANGFUSE_SECRET_KEY=sk-lf-...
 *   LANGFUSE_PUBLIC_KEY=pk-lf-...
 *   LANGFUSE_BASE_URL=https://cloud.langfuse.com
 */

import { LangfuseSpanProcessor, type ShouldExportSpan } from "@langfuse/otel";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

const shouldExportSpan: ShouldExportSpan = (span) => {
  return span.otelSpan.instrumentationScope.name !== "next.js";
};

export const langfuseSpanProcessor = new LangfuseSpanProcessor({
  shouldExportSpan,
});

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const tracerProvider = new NodeTracerProvider({
      spanProcessors: [langfuseSpanProcessor],
    });
    tracerProvider.register();
  }
}
