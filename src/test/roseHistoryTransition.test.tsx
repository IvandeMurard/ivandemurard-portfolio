import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoseHistoryTransition } from "@/components/rose/RoseHistoryTransition";

describe("Rose historical period", () => {
  it("keeps the July 0 degree and August 80 degree directions coupled to the selected period", () => {
    const { container } = render(<RoseHistoryTransition reduced renderCompass={(heading) => <output>{heading}</output>} />);
    expect(container.querySelector("output")?.textContent).toBe("0");
    fireEvent.click(screen.getByRole("tab", { name: /August 2026/ }));
    expect(container.querySelector("output")?.textContent).toBe("80");
    expect(screen.getByRole("tab", { name: /August 2026/ }).getAttribute("aria-selected")).toBe("true");
    fireEvent.click(screen.getByRole("tab", { name: /July 2026/ }));
    expect(container.querySelector("output")?.textContent).toBe("0");
  });

  it("changes the shared period with arrow keys and moves focus to that period", () => {
    render(<RoseHistoryTransition reduced renderCompass={(heading) => <output>{heading}</output>} />);
    fireEvent.keyDown(screen.getByRole("tab", { name: /July 2026/ }), { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: /August 2026/ }));
    expect(screen.getByRole("tab", { name: /August 2026/ }).getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: "Home" });
    expect(screen.getByRole("tab", { name: /July 2026/ }).getAttribute("aria-selected")).toBe("true");
  });
});