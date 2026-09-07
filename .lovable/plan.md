# Homepage: fix the invisible case studies, cut the scroll, calm Rose

I reproduced everything on a real phone-sized browser before writing this. Two of the three criticisms are real bugs, one is a settings toggle.

## 1. The case studies really are invisible on phones (confirmed)

At 375 x 667 (iPhone SE, the smallest common phone) the whole Case Studies block renders with opacity 0 and never appears. At 390 x 844 it appears. Measured, not guessed.

Cause: sections fade in when 15% of them is on screen. The Case Studies block is 4,460px tall on a phone, so 15% is 669px, and the usable viewport after the built-in 10% margin is about 600px. The threshold can never be met, so the fade-in never fires. Every other section is short enough to pass.

Fix, in `src/hooks/useReveal.ts`:
- Trigger on first contact (threshold 0) with the existing bottom margin, instead of a percentage of the element. A tall section then behaves like a short one.
- Add a safety net: if the observer has not fired within 1.5s, or if the element is already taller than the viewport, reveal it anyway. Content must never be able to stay invisible.

This single change also removes the class of bug Grok saw as "page quasi vide après le hero".

## 2. The moving numbers, and why Grok saw 66+ then 500+

Not floating marketing: the numerals count up from 0 on entry. A screenshot taken mid-animation shows "66+" instead of "500+", "3" instead of "22". An automated reader, or anyone on a slow scroll, sees a different number every visit. For a credibility strip, that is a self-inflicted wound.

Fix: keep the animation only where it is decorative, kill it where it is evidence.
- Hero proof strip (500+, 22): render the final value immediately, no count-up. Optionally a short fade, no numeric tween.
- Milestones section: keep the count-up (small numbers: 5, 10, 2, 4, reading them mid-tween is harmless).
- Sourcing: append the origin to each proof label so the number is attributable (DomusVi, Bouygues Telecom, Opendatasoft). Labels already name them, they just need to be unambiguous per figure.

## 3. Yes, the page is far too long. Same analysis, no complaisance.

Measured on a phone: **12,330px of scroll**, roughly 18 screens, before the contact block. Breakdown:

```text
Hero                1,190
Case Studies        4,460   <- 36% of the page
Field Notes         1,240
My approach         1,350
How I work          1,520   <- near-duplicate of My approach
Milestones            910
Contact               590
```

The structural problem is not spacing, it is that the homepage repeats the whole site. Six full case-study cards with covers and three-line taglines, then three convictions, then three pillars that say the same thing in other words, then eight milestones after a proof strip that already carried the numbers.

Proposal, in order of impact:

1. **Homepage shows three cases, not six.** Aetherix, Lore, Sonor (one flagship, one hackathon win, one founded company). "Explore all stories" already leads to `/journeys`, which is the exhaustive page. Cuts about 2,200px.
2. **Merge "My approach" and "How I work" into one section of three cards.** They are the same claim twice. Cuts about 1,350px.
3. **Drop the Milestones section from the homepage** and move it to `/atrium` (About), where a track record belongs. The hero proof strip is the homepage version of it. Cuts about 910px.
4. **Tighten mobile rhythm**: sections `py-16` to `py-10` on mobile, card padding `p-10` to `p-7`, heading margins `mb-16` to `mb-10`. Desktop values unchanged. Cuts about 1,000px.
5. **Add a contact affordance that does not require scrolling**: the hero already has Case Studies and About, add a third quiet "Book a call" link there.

Result: roughly **12,300px to 5,800px**, contact reachable in about 8 screens instead of 18, nothing deleted from the site, only relocated.

If you want to keep all six cases on the homepage, say so and I will do 2 to 5 only (still lands around 8,000px).

## 4. Rose

Measured resting height: 158px on mobile, plus a 16px offset, so about 175px of the 667px screen, a quarter of the viewport permanently occupied. It is not catastrophic but it is the first thing over the contact block.

Fix: a resting state of a single input row plus the mark, about 76px, with the contextual question chips revealed on tap instead of always shown. Open state unchanged.

## 5. The Lovable badge

That is a publishing setting, not code. I can turn it off for the published site. Confirm and it is done in the same pass.

## Technical notes

- `src/hooks/useReveal.ts`: threshold 0, keep `rootMargin`, add a `setTimeout` fallback and an oversized-element bypass.
- `src/pages/Index.tsx`: section list, mobile spacing scale, hero CTA, proof strip without `CountUp`.
- `src/pages/Atrium.tsx`: receives the Milestones block.
- `src/components/rose/RoseDock.tsx`: resting height and chip visibility.
- No design-system change, no new tokens, no copy rewrite beyond what is listed.
