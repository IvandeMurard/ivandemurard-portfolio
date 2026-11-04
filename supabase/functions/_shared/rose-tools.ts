// What rose-chat and the evaluation script (scripts/rose-stage-b-check.ts) share, so a Stage B run builds the same
// request as production: the two UI-only tools with their field descriptions, and the history window.
// No npm imports: the caller injects `tool` and `z` (npm:ai and npm:zod in Deno, ai and zod in Node).
import { shouldOfferRoseBooking } from "./rose-context.ts";
import {
  isRoseFollowupAllowed, ROSE_BOOKING_TOOL_DESCRIPTION, ROSE_FOLLOWUPS_TOOL_DESCRIPTION, roseFollowupPolicyDescription, shouldSuppressRoseFollowups,
  type RoseFollowupContext,
} from "./rose-tool-contract.ts";

/** How many of the latest messages feed the previous-questions list of the system prompt. */
export const ROSE_HISTORY_WINDOW = 20;

type RoseMessage = { role: string; parts: Array<{ type: string; text?: string }> };

/** Visitor turns before the current one, from the last ROSE_HISTORY_WINDOW messages. The last message is the question itself. */
export const roseHistoryQuestions = (messages: RoseMessage[]): string[] =>
  messages.slice(-ROSE_HISTORY_WINDOW, -1)
    .filter((message) => message.role === "user")
    .map((message) => message.parts.filter((part) => part.type === "text").map((part) => part.text ?? "").join(" "));

// deno-lint-ignore no-explicit-any
export type RoseToolKit = { tool: (definition: any) => any; z: any };

/**
 * The tools Rose may call. Both are UI-only (no execute): the visitor triggers any booking, and the follow-ups render
 * as chips. propose_booking is offered only when the visitor asks for a call; suggest_followups unless suppressed.
 */
export function createRoseTools({ tool, z }: RoseToolKit, context: RoseFollowupContext) {
  const { question } = context;
  return {
    ...(shouldOfferRoseBooking(question) ? {
      propose_booking: tool({
        description: ROSE_BOOKING_TOOL_DESCRIPTION,
        inputSchema: z.object({
          intent: z.enum(["product", "technical", "culture", "exploring"])
            .describe("Detected intent bucket."),
          reason: z
            .string()
            .max(200)
            .describe("One short sentence, plain English, shown on the card as the call framing."),
        }),
      }),
    } : {}),
    ...(shouldSuppressRoseFollowups(context) ? {} : {
      suggest_followups: tool({
        description: ROSE_FOLLOWUPS_TOOL_DESCRIPTION,
        inputSchema: z.object({
          items: z.array(z.string().min(3).max(80).describe(roseFollowupPolicyDescription(context))).min(1).max(2),
        }).superRefine(({ items }: { items: string[] }, ctx: { addIssue: (issue: unknown) => void }) => {
          items.forEach((item, index) => {
            if (!isRoseFollowupAllowed(item, context)) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index], message: "This follow-up does not advance the current question safely." });
            }
          });
        }),
      }),
    }),
  };
}
