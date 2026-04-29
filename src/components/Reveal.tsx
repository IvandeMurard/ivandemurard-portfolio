import { ReactNode, ElementType } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  threshold?: number;
}

export const Reveal = ({ children, as, className, threshold = 0.15 }: RevealProps) => {
  const Tag = (as ?? "div") as ElementType;
  const ref = useReveal<HTMLElement>(threshold);
  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
};

export default Reveal;
