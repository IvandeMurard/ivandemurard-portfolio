import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="font-headline text-2xl text-primary mt-12 mb-4">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-on-surface leading-relaxed mb-4">{children}</p>
);

const Privacy = () => (
  <SiteLayout title="Privacy">
    <Seo
      title="Privacy"
      description="What this site records about visits and conversations with Rose, what booking a call transmits, and for how long records are kept."
      path="/privacy"
    />
    <div className="pt-40 md:pt-48 pb-32 px-6 md:px-12 max-w-2xl mx-auto">
      <p className="font-mono uppercase tracking-[0.12em] text-[11px] text-secondary mb-6">Privacy</p>
      <h1 className="font-headline text-4xl md:text-5xl text-primary mb-10">What this site keeps</h1>

      <H2 id="rose">Talking to Rose</H2>
      <P>
        The messages you send Rose are processed by an AI model to write each answer. The conversation is not
        saved as a transcript by this site's server.
      </P>
      <P>
        So Rose can follow you from page to page, the conversation is kept in this browser tab's session storage, not in
        a cookie and not on a server. It is dropped after an hour without a new message, and the Clear button in Rose
        removes it at once. Your browser normally discards session storage when the tab closes, though some browsers
        restore it with the tab. Clearing the conversation does not remove copies the AI provider may keep to process
        requests, or the interaction records described below.
      </P>

      <H2 id="events">Interaction records</H2>
      <P>
        The site records interaction events: that Rose was opened, which suggestion was chosen, the questions you
        type, and whether a call was proposed or the booking link opened, with the page and section you were
        reading. It also records request completion or failure, clearing the conversation, and clicks on known
        portfolio references inside Rose. These additional events contain no question or answer text, and reference
        destinations exclude query strings. No IP address, browser fingerprint, device details, or account is stored
        in these interaction records. A random, tab-scoped session number links Rose events across pages, separately
        from general site link-click records. A reference click is not proof that its destination was read.
      </P>
      <P>
        Email addresses and phone numbers in typed questions are masked automatically before saving. Masking works
        by pattern recognition, so unusual formats may slip through: please avoid typing personal details you do not
        want recorded.
      </P>

      <H2 id="retention">Retention and access</H2>
      <P>
        Records are read only by Ivan through a private, signed-in view, used to improve Rose and the site, and
        deleted automatically after 90 days. Closing or clearing the chat does not delete records already saved.
      </P>

      <H2 id="booking">Booking a call</H2>
      <P>
        Clicking a booking link, whether the Book a call suggestion or a card Rose proposes, opens Cal.com directly.
        Your conversation, a summary of it, or any chat text is not sent with that click, not added to the link, and
        not emailed. The site only records that the link was opened.
      </P>
      <P>
        Opening the link is not a booking. A meeting exists only once you schedule it on Cal.com, where you choose
        what to share. This site does not receive confirmations from Cal.com.
      </P>
    </div>
  </SiteLayout>
);

export default Privacy;
