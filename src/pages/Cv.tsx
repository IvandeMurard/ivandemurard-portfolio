import { ClosingContact } from "@/components/case/ClosingContact";
import { Download, FileText } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { SectionDivider } from "@/components/SectionDivider";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Button } from "@/components/ui/button";
import { CV, CV_PROJECT_LINKS, type CvRole } from "@/content/cv";

const LinkedText = ({ text }: { text: string }) => {
  const names = Object.keys(CV_PROJECT_LINKS);
  const parts = text.split(new RegExp(`(${names.join("|")})`, "g"));
  return parts.map((part, index) => {
    const to = CV_PROJECT_LINKS[part];
    return to ? (
      <Link key={`${part}-${index}`} to={to} className="text-primary underline decoration-secondary/50 underline-offset-4 hover:decoration-secondary">
        {part}
      </Link>
    ) : (
      part
    );
  });
};

const Role = ({ role }: { role: CvRole }) => (
  <article className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_12rem] gap-x-10 gap-y-3 border-t border-outline-variant py-8 md:py-10">
    <div>
      <h3 className="font-headline italic text-xl md:text-2xl text-primary leading-tight">
        <LinkedText text={role.title} />
      </h3>
      <p className="mt-3 font-body italic text-on-surface-variant leading-relaxed max-w-3xl">{role.context}</p>
      <ul className="mt-5 space-y-3 font-body text-on-surface-variant leading-relaxed">
        {role.bullets.map((bullet) => (
          <li key={bullet} className="grid grid-cols-[0.75rem_1fr] gap-3">
            <span aria-hidden="true" className="text-secondary">•</span>
            <span><LinkedText text={bullet} /></span>
          </li>
        ))}
      </ul>
    </div>
    <p className="md:text-right font-label uppercase tracking-[0.16em] text-[10px] text-secondary md:pt-1">{role.dates}</p>
  </article>
);

const Cv = () => (
  <SiteLayout title="CV">
    <Seo
      title="CV, Ivan de Murard, AI Product Builder"
      description="Ivan de Murard's CV: founder and builder experience, product and customer roles, skills, and education."
      path="/cv"
      type="profile"
      markdown="/Ivan_de_Murard_CV.md"
    />
    <div className="pt-32 md:pt-40 pb-32 md:pb-48">
      <header className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-6 block">Curriculum vitae</span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl italic text-primary leading-[1.05]">{CV.name}</h1>
            <p className="mt-6 font-headline italic text-2xl md:text-3xl text-on-surface-variant">{CV.title}</p>
            <p className="mt-3 font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">{CV.location}</p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
            <Button asChild variant="outline">
              <a href="/Ivan_de_Murard_CV.pdf" download><Download aria-hidden="true" />Download PDF</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/Ivan_de_Murard_CV.md"><FileText aria-hidden="true" />Markdown</a>
            </Button>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-on-surface-variant">
          <a href={`mailto:${CV.email}`} className="hover:text-primary transition-colors">{CV.email}</a>
          <a href={`https://${CV.website}`} className="hover:text-primary transition-colors">{CV.website}</a>
          <a href={`https://${CV.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{CV.github}</a>
        </div>
        <p className="mt-10 max-w-4xl font-body text-lg md:text-xl text-on-surface-variant leading-relaxed">{CV.summary}</p>
      </header>

      <SectionDivider label="Founder & Builder" />
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16" aria-labelledby="founder-builder">
        <h2 id="founder-builder" className="font-headline italic text-3xl md:text-5xl text-primary mb-8">Founder & Builder</h2>
        {CV.founder.map((role) => <Role key={role.title} role={role} />)}
      </section>

      <SectionDivider label="Product & Customer Roles" />
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16" aria-labelledby="product-roles">
        <h2 id="product-roles" className="font-headline italic text-3xl md:text-5xl text-primary mb-8">Product & Customer Roles</h2>
        {CV.product.map((role) => <Role key={role.title} role={role} />)}
      </section>

      <SectionDivider label="Skills" />
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-16" aria-labelledby="skills">
        <h2 id="skills" className="font-headline italic text-3xl md:text-5xl text-primary mb-10">Skills</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-outline-variant">
          {CV.skills.map((skill) => (
            <div key={skill.label} className="border-r border-b border-outline-variant p-6 md:p-8">
              <dt className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary mb-3">{skill.label}</dt>
              <dd className="font-body text-on-surface-variant leading-relaxed">{skill.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <SectionDivider label="Education" />
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto" aria-labelledby="education">
        <h2 id="education" className="font-headline italic text-3xl md:text-5xl text-primary mb-10">Education</h2>
        <ul className="border-t border-outline-variant">
          {CV.education.map((item) => <li key={item} className="border-b border-outline-variant py-6 font-body text-lg text-on-surface-variant">{item}</li>)}
        </ul>
      </section>
    </div>
    <ClosingContact room="cv" />
    </SiteLayout>
);

export default Cv;