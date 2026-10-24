import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderRoseMarkdown } from "@/components/rose/roseMarkdown";

const renderMd = (text: string) =>
  render(<MemoryRouter>{renderRoseMarkdown(text)}</MemoryRouter>);

describe("renderRoseMarkdown", () => {
  it("renders bold around quoted text", () => {
    renderMd('Use the **"Copy implementation brief"** button.');
    const el = screen.getByText('"Copy implementation brief"');
    expect(el.tagName).toBe("STRONG");
  });

  it("renders italic and inline code", () => {
    renderMd("Paste it into *your own agent* with `npx -y paris-compass-mcp`.");
    expect(screen.getByText("your own agent").tagName).toBe("EM");
    expect(screen.getByText("npx -y paris-compass-mcp").tagName).toBe("CODE");
  });

  it("renders https links as safe external anchors", () => {
    renderMd("Read the [evaluation note](https://ivandemurard.com/journal/harnesses-graders-closed-loops) first.");
    const a = screen.getByRole("link", { name: "evaluation note" });
    expect(a).toHaveAttribute("href", "https://ivandemurard.com/journal/harnesses-graders-closed-loops");
    expect(a).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("renders site-relative links as internal navigation", () => {
    renderMd("See the [Evaluation Field Note](/journal/harnesses-graders-closed-loops).");
    const a = screen.getByRole("link", { name: "Evaluation Field Note" });
    expect(a).toHaveAttribute("href", "/journal/harnesses-graders-closed-loops");
    expect(a).not.toHaveAttribute("target");
  });

  it("leaves non-http links and unknown syntax as plain text", () => {
    renderMd("Not a link: [x](javascript:alert(1)) and ** unclosed");
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText(/javascript:alert/)).toBeInTheDocument();
  });
});
