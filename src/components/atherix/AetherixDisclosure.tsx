import type { ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/Icon";
import { DISCLOSURE, DISCLOSURE_TRIGGER } from "@/lib/revealAnchor";

// The root and trigger carry the markers that let a link to an anchor inside (or on) a closed
// disclosure open it first (src/lib/revealAnchor.ts). The content stays mounted, hidden while closed,
// so an anchor inside it exists in the page before the section opens.
const markers = { [DISCLOSURE]: "" };
const triggerMarkers = { [DISCLOSURE_TRIGGER]: "" };

export const AetherixDisclosure = ({ title, id, children }: { title: string; id?: string; children: ReactNode }) => (
  <Collapsible id={id} {...markers} className="group scroll-mt-24 border-y border-outline-variant py-4">
    <CollapsibleTrigger {...triggerMarkers} className="flex w-full items-center justify-between gap-4 text-left font-label text-[10px] uppercase tracking-[0.18em] text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
      {title}
      <Icon name="expand_more" className="text-lg transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent forceMount className="pt-6 data-[state=closed]:hidden">{children}</CollapsibleContent>
  </Collapsible>
);

export default AetherixDisclosure;
