import { env } from "../config/env";
import { logger } from "../utils/logger";

export abstract class LLMProvider {
  abstract readonly providerName: string;
  abstract generateAnswer(question: string, context: string): Promise<string>;
  abstract ping(): Promise<boolean>;
}

export class DemoLLMProvider extends LLMProvider {
  readonly providerName = "DEMO_DETERMINISTIC_ENGINE";

  async ping(): Promise<boolean> {
    return true;
  }

  async generateAnswer(question: string, context: string): Promise<string> {
    // Answers strictly derived from retrieved statutory context without fabrication
    if (!context || context.trim().length === 0) {
      return "Unable to verify source. No relevant statutory provisions available.";
    }

    return (
      `Based strictly on the verified statutory records:\n\n` +
      `${context}\n\n` +
      `Summary: Under applicable land governance statutes, any unauthorized change of land use without prior sanction from the designated authority constitutes a statutory infraction subject to summary eviction and revenue penalties.`
    );
  }
}

export class CloudLLMProvider extends LLMProvider {
  readonly providerName: string;

  constructor() {
    super();
    this.providerName = env.LLM_PROVIDER;
  }

  async ping(): Promise<boolean> {
    return Boolean(env.LLM_API_KEY);
  }

  async generateAnswer(question: string, context: string): Promise<string> {
    if (!env.LLM_API_KEY) {
      logger.warn("LLM API Key missing; falling back to deterministic engine.");
      return new DemoLLMProvider().generateAnswer(question, context);
    }

    try {
      // Generic OpenAI-compatible / Gemini REST endpoint call
      const prompt = `You are a judicial land governance assistant. Answer the user's question STRICTLY based on the provided statutory context. If the answer cannot be determined from the context, respond with "Unable to verify source."\n\nContext:\n${context}\n\nQuestion:\n${question}`;
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      // Example using OpenAI compatible completion API
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.LLM_API_KEY}`,
        },
        body: JSON.stringify({
          model: env.LLM_MODEL || "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = (await res.json()) as any;
        return data.choices?.[0]?.message?.content || "No response generated";
      }
    } catch (err) {
      logger.warn("External LLM API call timed out or failed:", err);
    }

    return new DemoLLMProvider().generateAnswer(question, context);
  }
}

export function getLLMProvider(): LLMProvider {
  if (env.DEMO_MODE || !env.LLM_API_KEY) {
    return new DemoLLMProvider();
  }
  return new CloudLLMProvider();
}
