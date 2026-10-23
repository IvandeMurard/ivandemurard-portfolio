import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EntryActions } from "@/components/journal/EntryActions";

describe("article reading prompt", () => {
  it("copies the public Markdown source rather than the preview origin", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<EntryActions title="Harnesses" markdownPath="/journal/harnesses-graders-closed-loops.md" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy prompt for Claude or ChatGPT" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0][0]).toContain("Read https://ivandemurard.com/journal/harnesses-graders-closed-loops.md");
    expect(writeText.mock.calls[0][0]).not.toContain("localhost");
  });
});