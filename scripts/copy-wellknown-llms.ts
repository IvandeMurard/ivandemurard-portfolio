// Serves /llms.txt also at /.well-known/llms.txt, so crawlers that only probe the well-known prefix find the same bytes.
import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("public/.well-known", { recursive: true });
copyFileSync("public/llms.txt", "public/.well-known/llms.txt");
