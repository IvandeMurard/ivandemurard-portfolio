import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChapterLearning } from "@/components/rose/RoseLaterChapters";

afterEach(cleanup);

describe("Chapter 05 visitor-led handoff", () => {
  it("opens the existing Rose without submitting a predefined question", () => {
    const open = vi.fn();
    const ask = vi.fn();
    window.addEventListener("rose:open", open);
    window.addEventListener("rose:ask", ask);
    try {
      render(<ChapterLearning />);
      fireEvent.click(screen.getByRole("button", { name: /Ask Rose your question/ }));
      expect(open).toHaveBeenCalledTimes(1);
      expect(ask).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("rose:open", open);
      window.removeEventListener("rose:ask", ask);
    }
  });
});