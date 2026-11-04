// Shared helpers: AI SDK providers for rose-chat. The choice between them lives in rose-provider.ts.
import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible@1.0.46";
import { GOOGLE_BASE_URL, withToolCallIndex } from "./rose-provider.ts";

export function createLovableAiGatewayProvider(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

/** Google's API directly, through its OpenAI-compatible endpoint. The key comes from Deno.env only. */
export function createGoogleAiProvider(googleApiKey: string) {
  return createOpenAICompatible({
    name: "google",
    baseURL: GOOGLE_BASE_URL,
    apiKey: googleApiKey,
    fetch: withToolCallIndex(fetch),
  });
}
