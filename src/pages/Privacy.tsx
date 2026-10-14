import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";

const Privacy = () => (
  <SiteLayout title="Privacy">
    <Seo
      title="Privacy"
      description="What this site records about visits and conversations with Rose, and for how long."
      path="/privacy"
    />
    <div className="pt-40 md:pt-48 pb-32 px-6 md:px-12 max-w-2xl mx-auto">
      <p className="font-mono uppercase tracking-[0.12em] text-[11px] text-secondary mb-6">Privacy</p>
      <h1 className="font-headline text-4xl md:text-5xl text-primary mb-10">What this site keeps</h1>
      <h2 id="rose" className="font-headline text-2xl text-primary mb-4">Conversations with Rose</h2>
      <p className="text-on-surface leading-relaxed">
        When you use Rose, the site records anonymous events: that the assistant was opened, which suggested
        question was chosen, the questions you type, and whether a call was proposed or booked, along with the
        page and section you were reading. No IP address, no browser or device identifier and no account is stored;
        a random session number links the events of one visit only. Email addresses and phone numbers are masked
        before anything is saved. These records are used solely to improve Rose and the site, are read only by
        Ivan, and are deleted automatically after 90 days.
      </p>
    </div>
  </SiteLayout>
);

export default Privacy;
