import { ReactNode, ElementType } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  threshold?: number;
  id?: string;
}

export const Reveal = ({ children, as, className, threshold = 0.15, id }: RevealProps) => {
  const Tag = (as ?? "div") as ElementType;
  const ref = useReveal<HTMLElement>(threshold);
  return (
    <Tag ref={ref} id={id} data-reveal className={className}>
      {children}
    </Tag>
  );
};

export default Reveal;
