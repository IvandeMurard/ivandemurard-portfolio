import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderRoseMarkdown, linkifyProjects } from "@/components/rose/roseMarkdown";

const renderMd = (text: string) => render(<MemoryRouter>{renderRoseMarkdown(text)}</MemoryRouter>);

describe("Rose Markdown rendering", () => {
  it("renders bold around quoted text", () => {
    renderMd('Use the **"Copy implementation brief"** button.');
    expect(screen.getByText('"Copy implementation brief"').tagName).toBe("STRONG");
  });

  it("renders italic and inline code", () => {
    renderMd("Paste it into *your own agent* with `npx -y paris-compass-mcp`.");
    expect(screen.getByText("your own agent").tagName).toBe("EM");
    expect(screen.getByText("npx -y paris-compass-mcp").tagName).toBe("CODE");
  });

  it("renders https links as safe external anchors", () => {
    renderMd("Read the [evaluation note](https://ivandemurard.com/journal/harnesses-graders-closed-loops) first.");
    const a = screen.getByRole("link", { name: "evaluation note" });
    expect(a).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(a).toHaveAttribute("target", "_blank");
  });

  it("renders site-relative links as internal navigation", () => {
    renderMd("See the [Evaluation Field Note](/journal/harnesses-graders-closed-loops).");
    const a = screen.getByRole("link", { name: "Evaluation Field Note" });
    expect(a).toHaveAttribute("href", "/journal/harnesses-graders-closed-loops");
    expect(a).not.toHaveAttribute("target");
  });

  it("never renders javascript: links, raw HTML, scripts or images", () => {
    const { container } = renderMd(
      'Not a link: [x](javascript:alert(1)) <script>alert(1)</script> <img src=x onerror=alert(1)> ![p](https://e.com/a.png) <iframe src="https://e.com"></iframe>',
    );
    expect(container.querySelector("script, img, iframe")).toBeNull();
    expect(container.querySelector('a[href^="javascript"]')).toBeNull();
  });

  it("renders bullet lists with bold labels and no stray asterisks", () => {
    const { container } = renderMd("Roles:\n\n* **Sonor:** co-founder.\n* **Lore:** solo builder.");
    expect(container.querySelectorAll("li")).toHaveLength(2);
    expect(container.textContent).not.toContain("*");
  });

  it("renders ordered lists and nested emphasis", () => {
    const { container } = renderMd("1. **First *really* first**\n2. Second");
    expect(container.querySelectorAll("ol li")).toHaveLength(2);
    expect(container.querySelector("strong em")?.textContent).toBe("really");
  });

  it("never nests interactive elements", () => {
    const { container } = renderMd("**[Aetherix](/aetherix)** and [`code`](/lore)");
    expect(container.querySelector("a a, a button, button a, button button")).toBeNull();
  });
});

describe("Project auto-linking", () => {
  it("links the first mention of each project to its canonical route only", () => {
    const out = linkifyProjects("Aetherix learns. Aetherix again. Lore too.");
    expect(out).toBe("[Aetherix](/aetherix) learns. Aetherix again. [Lore](/lore) too.");
  });

  it("does not relink a project already linked by the model", () => {
    expect(linkifyProjects("See [the agent](/aetherix). Aetherix ships.")).toBe("See [the agent](/aetherix). Aetherix ships.");
  });

  it("leaves code spans untouched", () => {
    expect(linkifyProjects("Run `Tacet` locally.")).toBe("Run `Tacet` locally.");
  });
});
