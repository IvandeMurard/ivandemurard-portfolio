import { SOCIAL_LINKS } from "@/content/site";

export const Footer = () => (
  <footer className="w-full py-16 mt-24 bg-surface-container-low border-t border-outline-variant/10">
    <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-8 w-full max-w-screen-2xl mx-auto">
      <p className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant">
        © {new Date().getFullYear()} Ivan de Murard — Curated with Care
      </p>
      <div className="flex items-center gap-12">
        <a
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant hover:text-secondary hover:tracking-[0.25em] transition-all duration-700"
        >
          Instagram
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-label uppercase tracking-[0.2em] text-[10px] text-on-surface-variant hover:text-secondary hover:tracking-[0.25em] transition-all duration-700"
        >
          LinkedIn
        </a>
        <a
          href="#"
          className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary hover:tracking-[0.25em] transition-all duration-700"
        >
          Journal
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
