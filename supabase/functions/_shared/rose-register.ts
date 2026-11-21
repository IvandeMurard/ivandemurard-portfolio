/**
 * The register of a turn, exposed as message metadata (`rose_register`: "factual" or "light") so a later reader of the
 * message, such as Listen (voice), can use it. The server chooses the register (roseRegister in rose-tool-contract.ts);
 * this only stamps it on the message, right after the stream's "start" chunk. Nothing in the answer changes.
 *
 * Pure stream code, no imports: rose-chat (Deno) and the evaluation runner use the same function.
 */
export const ROSE_REGISTER_METADATA_KEY = "rose_register";

type Chunk = { type: string };
type RegisterMetadataChunk = { type: "message-metadata"; messageMetadata: { rose_register: "factual" | "light" } };

export function withRoseRegister<T extends Chunk>(stream: ReadableStream<T>, register: "factual" | "light"): ReadableStream<T | RegisterMetadataChunk> {
  return stream.pipeThrough(new TransformStream<T, T | RegisterMetadataChunk>({
    transform(chunk, controller) {
      controller.enqueue(chunk);
      if (chunk.type === "start") controller.enqueue({ type: "message-metadata", messageMetadata: { rose_register: register } });
    },
  }));
}
