import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ChapterLearning, ChapterQualityAssurance } from "@/components/rose/RoseLaterChapters";
import { EvidenceKey } from "@/components/EvidenceStatus";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";

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
  it("separates answer correctness from question relevance without duplicating product-level value claims", () => {
    render(<MemoryRouter><ChapterQualityAssurance /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "A correct answer can still miss the question." })).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Answer quality decision matrix" })).toBeInTheDocument();
    expect(screen.getAllByText("Correct · pass")).toHaveLength(3);
    expect(screen.getAllByText("Incorrect · fail")).toHaveLength(3);
    expect(screen.getAllByText("Answers the question · pass")).toHaveLength(2);
    expect(screen.getAllByText("Misses the reader's question · fail")).toHaveLength(2);
    expect(screen.getByText(/Correctness and question relevance are independent/)).toBeInTheDocument();
    expect(screen.getByText(/Chapter 05 asks whether Rose creates value across real visitors/)).toBeInTheDocument();
    expect(screen.getByText(/does not establish whether Rose creates value for visitors/)).toBeInTheDocument();
    expect(screen.queryByText("What Rose said")).not.toBeInTheDocument();
  });
  it("mounts the QA section in the default, alternate and narrative concept", () => {
    const page = readFileSync("src/pages/RoseDesignLab.tsx", "utf8");
    const chapters = readFileSync("src/components/rose/RoseLaterChapters.tsx", "utf8");
    expect(page).toContain("<ConceptA reduced={reduced} /><ChapterQualityAssurance />");
    expect(page).toContain("<ConceptB reduced={reduced} /><ChapterQualityAssurance />");
    expect(chapters).toMatch(/<ChapterLearning\s*\/>\s*<ChapterQualityAssurance\s*\/>/);
  });

});

describe("Evidence status language", () => {
  it("uses explicit words as well as visual marks", () => {
    render(<EvidenceKey />);
    expect(screen.getByText("Built")).toBeInTheDocument();
    expect(screen.getByText("Validation")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
    expect(screen.getByText(/Implemented behaviour that can be inspected/)).toBeInTheDocument();
  });

  it("makes Concept C the default and keeps Rose as a contextual margin voice", () => {
    const page = readFileSync("src/pages/RoseDesignLab.tsx", "utf8");
    expect(page).toContain('const concept = raw === "a" || raw === "b" ? raw : "narrative";');
    expect(page).toContain("Rose, in the margin");
    expect(page).not.toContain("const LabCursor");
  });
});
