## Reorder: Acknowledgments before Go Further

In `src/pages/Sonor.tsx`, swap the two closing sections so Acknowledgments comes right after the FAQ and Go Further becomes the final block of the page.

### Changes
- Move the Acknowledgments `<section>` above the Go Further `<section>`.
- Alternate surfaces so the rhythm stays: Acknowledgments uses `bg-surface`, Go Further uses `bg-surface-container-lowest` (currently the reverse).
- Move the "Begin a Conversation" CTA from the bottom of Acknowledgments to the bottom of Go Further, so the page still ends on a clear call to action.

### Files
- `src/pages/Sonor.tsx`
