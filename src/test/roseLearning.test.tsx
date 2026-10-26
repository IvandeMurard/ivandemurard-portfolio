import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChapterLearning, ChapterQualityAssurance } from "@/components/rose/RoseLaterChapters";
import { MemoryRouter } from "react-router-dom";

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
describe("Rose case-study QA chapter", () => {
  it("explains source fidelity and reader usefulness without claiming user validation", () => {
    render(<MemoryRouter><ChapterQualityAssurance /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "A correct answer can still miss the question." })).toBeInTheDocument();
    expect(screen.getByText(/Every code change must pass versioned golden datasets/)).toBeInTheDocument();
    expect(screen.getByText(/A more useful answer/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Does it help?" })).toBeInTheDocument();
    expect(screen.getByText(/do not estimate Rose's reliability/)).toBeInTheDocument();
    const evidence = screen.getByRole("link", { name: "See the Aetherix evidence" });
    expect(evidence).toHaveAttribute("href", "/aetherix#where-it-stands");
  });
});
