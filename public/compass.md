# Compass

Every address has a story. Compass reads it before you sign.

Open data turned into traceable, address-level context for commercial location decisions in Paris.

Data product · Commercial premises · Paris · 2026

Role: Product and data design, built by directing AI coding agents.

Status: Corpus and MCP server live. Web demo on a frozen sample (17th arrondissement).

[Open the demo](https://paris-compass.lovable.app) · [GitHub](https://github.com/IvandeMurard/paris-compass)

`npx -y paris-compass-mcp`

## 1. One address, three questions

You are standing in front of an empty shopfront. The agent says the street is lively.

- What was here? A florist in 2017, a florist in 2020, gone by 2023.
- Is the street dying or churning? Rue d'Argout turned over half its shops in three years, and refilled its three empty units.
- What did people pay? The median Paris goodwill sells between 160,000 and 170,000 €. A café goes for 220,000 €, a clothing shop for 86,000 €.

### Fig. 1.1

2017: Florist → 2020: Florist → 2023: No longer a shop.

One address across three censuses. Illustrative.

## 2. The problem

An entrepreneur chooses a shopfront on one visit, a hunch about passing trade, and what the landlord says. Listings describe the unit: floor area, rent, photos. Nothing describes the street.

More than 2,000 goodwill sales are published with their price in Paris every year. Each one is a decision made with that little.

## 3. The bet

The answer is already public, in pieces nobody joins at the address:

- three door-to-door censuses of every Paris shopfront (APUR, 2017, 2020, 2023);
- legal notices of goodwill sales and insolvencies (BODACC);
- the business register (INSEE Sirene).

Compass joins them: 85,418 units, each figure with its source, licence and date.

## 4. What it refuses

| Refused | What that buys |
| --- | --- |
| A single score out of 100 | A bakery wants footfall, a yoga studio wants quiet. One score averages that away. |
| A rent estimate | Honesty on the number everyone wants. No open dataset of commercial rents exists in France. |
| Brokers as users | Depth for one person studying one address. Brokers get the API. |
| Any figure without a cited public source | A claim the reader can re-derive, including against Compass. |

## 5. Against what exists

| Existing tool | What it answers | What it leaves out |
| --- | --- | --- |
| Listing portals | What is on the market today | What the street did before, and what is about to come free |
| Footfall vendors | How many people pass | A modelled figure from a phone panel the buyer cannot inspect |
| Broker platforms | Many locations, compared in bulk | One address, read in depth by the person who will sign |

Compass sits upstream of the listing: a business that has ceased trading or entered insolvency is public months before any advert.

## 6. Where AI sits

Design, planned for Q4 2026.

AI stays out of the scoring core, which is deterministic and replayable. It works above it: reading legal notices, matching a sale to one of several shopfronts at the same address, explaining a result for a given trade. Everything it produces is labelled derived or probable, never established.

Ruled out: a generated rent or revenue, a probability of success, a score "explained by AI".

## 7. One core, two readers

The same figures reach a person on the map and an agent over MCP.

```sh
npx -y paris-compass-mcp
```

Six tools, read-only, published on npm and the MCP registry.

### Fig. 7.1

Public sources (APUR BDCom, BODACC, INSEE Sirene) → One scoring core → Map, for a person / MCP server, for an agent.

One core, two readers.

## 8. How sure is it?

Every figure is checked against automatic rules before it ships, every day.

Each one carries one of four confidence levels. About half the corpus is certain. A third stays "probable", because public sources name an address and several shopfronts often share it. The product says so on screen.

### Fig. 8.1

Established 51% · Corroborated 6% · Probable 37% · Undetermined 6%.

Confidence levels across the corpus, measured 6 October 2026.

## 9. Where it stands

| Component | State |
| --- | --- |
| Corpus and evaluation | Live |
| MCP server | Published |
| Web demo | Frozen sample, 17th arrondissement |
| Demo on the live corpus | In progress |
| AI layer | Design |

[Schedule a conversation](https://cal.com/ivandemurard/discussion-and-introduction)

© Ivan de Murard. All rights reserved.
