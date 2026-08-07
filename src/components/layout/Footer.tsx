import { Mail, Calendar, Linkedin, Github } from "lucide-react";
import { SOCIAL_LINKS } from "@/content/site";
import { useTrackClick } from "@/hooks/useTrackClick";

const ICON_LINKS = [
  { label: "Email", href: SOCIAL_LINKS.email, Icon: Mail, external: false, kind: "contact" as const },
  { label: "Book a Call", href: SOCIAL_LINKS.schedule, Icon: Calendar, external: true, kind: "contact" as const },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: Linkedin, external: true, kind: "social" as const },
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: Github, external: true, kind: "social" as const },
];

export const Footer = () => {
  const track = useTrackClick();
  return (
    <footer className="w-full py-10 bg-surface-container-low border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-8 w-full max-w-screen-2xl mx-auto">
        <p className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
          © {new Date().getFullYear()} Ivan de Murard · Curated with Care
        </p>
        <div className="flex items-center gap-8">
          {ICON_LINKS.map(({ label, href, Icon, external, kind }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={label}
              title={label}
              onClick={() => track({ label, href, kind })}
              className="text-on-surface-variant hover:text-secondary transition-all duration-500 hover:scale-110"
            >
              <Icon size={20} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
