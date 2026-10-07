import type { ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Icon } from "@/components/ui/Icon";

export const AetherixDisclosure = ({ title, children }: { title: string; children: ReactNode }) => (
  <Collapsible className="group border-y border-outline-variant py-4">
    <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 text-left font-label text-[10px] uppercase tracking-[0.18em] text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
      {title}
      <Icon name="expand_more" className="text-lg transition-transform group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent className="pt-6">{children}</CollapsibleContent>
  </Collapsible>
);

export default AetherixDisclosure;