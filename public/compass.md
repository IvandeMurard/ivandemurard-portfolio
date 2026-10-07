# Compass

Case study · Standalone project

Every address has a story. Compass reads it before you sign.

Open data turned into traceable, address-level context for commercial location decisions in Paris.

Type: Data product · Commercial premises · Paris · 2026

Role: Product and data design, built by directing AI coding agents.

Status: Corpus and MCP server live. Web demo on a frozen sample (17th arrondissement).

[Open the demo](https://paris-compass.lovable.app) · [GitHub](https://github.com/IvandeMurard/paris-compass) · [Live MCP](https://www.npmjs.com/package/paris-compass-mcp)

## 1. One address, read in context

**10 rue Mandar, Paris 2e. What public data says about it, exactly as the Compass server returned it on 7 October 2026.**

### The address

**Six goodwill sales in seven years.**

### Fig. 1.1

- 2017 · Census · Withheld, licence not cleared · Undetermined
- Aug 2017 · Goodwill sold · €100,000 · Probable
- Mar 2019 · Goodwill sold · €95,000 · Probable
- Jul 2019 · Goodwill sold · €450,000 · Probable
- 2020 · Census · Withheld, licence not cleared · Undetermined
- Aug 2021 · Goodwill sold · €87,500 · Probable
- 2023 · Census · Asian restaurant · Established
- Oct 2023 · Goodwill sold · €175,000 · Probable
- Jun 2024 · Goodwill sold · €120,000 · Probable

10 rue Mandar, Paris 2e. Sources: APUR BDCom 2023 (ODbL), BODACC (Licence Ouverte). Retrieved 7 October 2026.

Why Probable: two shopfronts share this street number, and the legal notice does not say which one was sold.

Three insolvency notices also carry this address. They give a company's registered office, not the shop, and are flagged as such.

#### Confidence definitions

- **Established** — The source names this premise directly, and the record is attached.
- **Corroborated** — Two independent public sources place the business here; neither names the premise.
- **Probable** — The fact is documented, but tying it to this premise is inferred.
- **Undetermined** — The source is silent, and says so.

Compass also measures how many businesses of a given trade are still trading six years later, neighbourhood by neighbourhood. Those figures rest on the 2017 census and stay withheld until its licence is cleared.

### The surroundings

**Dense commercial fabric, sustained passing trade, strong rail access, many shops and services within walking distance.**

The server's own one-sentence reading of the 800 m around the address, translated from French.

### Against another address

**Context only means something by comparison.**

| Axis (score out of 100) | 10 rue Mandar, 2e | A residential point, 20e |
| --- | --- | --- |
| Commercial density | 95 | 82 |
| Shops and services within walking distance | 64 | 22 |
| Food shops | 61 | 22 |
| Rail access | 60 | 70 |
| Passing trade (estimate) | 83 | 78 |
| Road noise exposure (modelled) | 51 | 100 |

**On road noise, the residential point comes out twice as exposed: 100 against 51. This is a model built from the major roads within 500 m, not a measurement.**

Six other axes (schools, healthcare, groceries, parks, transit, walkability) reach the ceiling at both points, as they do across much of central Paris. The server excludes them from the comparison instead of presenting them as a difference.

## 2. Product strategy

**Join public data at the address, and refuse what cannot be verified.**

### The problem

An entrepreneur chooses a shopfront on one visit, a hunch about passing trade, and what the landlord says. Listings describe the unit: floor area, rent, photos. Nothing describes the street.

More than 2,000 goodwill sales are published with their price in Paris every year. Each one is a decision made with that little.

### The bet

The answer is already public, in pieces nobody joins at the address:

- three door-to-door censuses of every Paris shopfront (APUR, 2017, 2020, 2023);
- legal notices of goodwill sales and insolvencies (BODACC);
- the business register (INSEE Sirene).

Compass joins them: 85,418 units, each figure with its source, licence and date.

### What it refuses

| Refused | What that buys |
| --- | --- |
| A single score out of 100 | A bakery wants footfall, a yoga studio wants quiet. One score averages that away. |
| A rent estimate | Honesty on the number everyone wants. No open dataset of commercial rents exists in France. |
| Brokers as users | Depth for one person studying one address. Brokers get the API. |
| Any figure without a cited public source | A claim the reader can re-derive, including against Compass. |

### Against what exists

| Existing tool | What it answers | What it leaves out |
| --- | --- | --- |
| Listing portals | What is on the market today | What the street did before, and what is about to come free |
| Footfall vendors | How many people pass | A modelled figure from a phone panel the buyer cannot inspect |
| Broker platforms | Many locations, compared in bulk | One address, read in depth by the person who will sign |

Compass sits upstream of the listing: a business that has ceased trading or entered insolvency is public months before any advert.

## 3. Where AI sits

Design, planned for Q4 2026.

AI stays out of the scoring core, which is deterministic and replayable. It works above it: reading legal notices, matching a sale to one of several shopfronts at the same address, explaining a result for a given trade. Everything it produces is labelled derived or probable, never established.

Ruled out: a generated rent or revenue, a probability of success, a score "explained by AI".

## 4. Built for people and AI agents

Agent-ready · MCP server published · six tools · read-only

**One scoring core. A person reads it on a map, an AI agent queries it directly.**

### Fig. 4.1

Public sources (APUR BDCom, BODACC, INSEE Sirene) → One scoring core → Map, for a person / MCP server, for an agent.

The same core serves both.

| Tool | What it answers |
| --- | --- |
| `trace_premise` | What happened at this address, year by year |
| `find_premises` | Which shopfronts sit near this point |
| `score_location` | How this location scores, axis by axis |
| `compare_locations` | How two locations differ |
| `explain_score` | Why one score is what it is |
| `list_sources` | Which datasets, licences and dates are behind it |

**What an agent receives**

```json
{
  "occurred_on": "2021-08-05",
  "source": "BODACC cession",
  "source_licence": "Licence Ouverte",
  "kind": "sale",
  "amount_eur": 87500,
  "evidence": "Fonds acquis par achat au prix stipulé de 87500,00 euros.",
  "confidence": "probable",
  "confidence_reason": "2 locaux partagent cette adresse : lequel est concerné n'est pas publié"
}
```

One row of trace_premise for 10 rue Mandar, excerpt. Same fact, same source, same confidence level as in the timeline above.

An agent gets no shortcut: same figures, same sources, same confidence levels as the person.

**Try it**

```sh
npx -y paris-compass-mcp
```

## 5. How sure is it?

Every figure is checked against automatic rules before it ships, every day.

Each one carries one of four confidence levels. About half the corpus is certain. A third stays "probable", because public sources name an address and several shopfronts often share it. The product says so on screen.

[Read the four confidence definitions in Sec. 01.](#confidence-legend)

### Fig. 5.1

Established 51% · Corroborated 6% · Probable 37% · Undetermined 6%.

Confidence levels across the corpus, measured 6 October 2026.

## 6. Where it stands

| Component | State |
| --- | --- |
| Corpus and evaluation | Live |
| MCP server | Published |
| Web demo | Frozen sample, 17th arrondissement |
| Demo on the live corpus | In progress |
| AI layer | Design |

[Schedule a conversation](https://cal.com/ivandemurard/discussion-and-introduction)

© Ivan de Murard. All rights reserved.
