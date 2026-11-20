# Proposal: an edge from Rose to the Field Note "One text, three readers"

Status: proposal, not applied. Ivan writes the links of `src/content/portfolio-graph.json` by hand and validates the wording.
This commit adds only this file. Nothing in the graph, the map drawing, the tests or the Rose deck has changed.

## The edge to validate

```json
{ "from": "rose", "link": "reads the same text as", "to": "field-note-readers", "reason": "Rose reads the same Markdown as outside agents; this note shows how.", "indirect": false }
```

With one new node:

```json
{ "id": "field-note-readers", "label": "Field Notes (one text, three readers)" }
```

Wording to decide: the link label ("reads the same text as" is a proposal) and the reason (the one above is the example from
the brief). The node label follows the existing "Field Notes (evaluation harness)".

## Why it is not applied

Applying it touches things the Rose case study treats as decided:

1. `docs/rose-case-study-copy-v2.md` must hold the reason verbatim: `relationsMap.test.tsx` checks every reason against the deck.
2. `RelationsMap.tsx` draws each node from a fixed table (`BOX`). A new node needs a slot. A free one is x 196, y 126, w 150, h 44,
   lines `["Field Notes", "three readers"]`: it sits between "Every page" and "Field Notes, evaluation harness", and the line from Rose
   crosses no box. This is a layout choice for Ivan.
3. `relationsMap.test.tsx` counts the edges, the rows (8 + 1), the lines and the boxes. Those counts move by one.
4. `public/rose.md` and `public/llms-full.txt` are generated from the graph and need regenerating.

If the edge is accepted, these four changes go in one commit.
