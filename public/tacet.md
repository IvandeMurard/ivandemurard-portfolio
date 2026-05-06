# Tacet: The Synthetic Acoustic Twin

A proactive, headless intelligence layer designed for the hospitality sector. It predicts the impact of the external acoustic environment on revenue and guest experience, moving from passive awareness to proactive yield management.

- URL: https://www.ivandemurard.com/tacet
- Role: Product Builder, Architect of an acoustic intelligence layer
- Duration: 2026, ongoing (V3 pivot from B2C dashboard to B2B headless API)
- Team: Solo (with AI collaboration)
- Context: Headless API for hospitality, complement to Aetherix
- Stack: Proxy data APIs (OpenData permits, traffic, weather, events), OpenStreetMap 3D geometry, synthetic acoustic model, JSON alerts to RMS and PMS

## 1. Overview

Tacet began as an exploration of urban noise pollution, a dashboard translating Bruitparif data into a human-readable Score Sérénité for Parisians. The true value of data, however, lies not in visualization but in anticipation. Tacet has evolved into a headless Synthetic Acoustic Twin, designed specifically for the hospitality sector. It predicts the impact of the external environment on the guest experience, moving from passive awareness to proactive yield management.

## 2. The Problem

In the hospitality industry, a single bad review about noise can cost thousands in lost bookings. Yet "quiet room" remains a subjective request. Hotel managers lack the tools to anticipate environmental disruptions (construction, traffic spikes, local events) and adjust their operations or pricing dynamically.

## 3. The Solution: A Synthetic Digital Twin

Instead of relying on costly hardware sensors, Tacet builds a physics-based, software-only acoustic model of the hotel.

1. **Proxy Data Ingestion:** the engine continuously ingests APIs for construction permits, traffic flow, weather conditions, and local events.
2. **Spatial Geometry:** using OpenStreetMap 3D building data, the algorithm calculates acoustic line of sight and building shielding.
3. **Proactive Alerts:** Tacet acts as an invisible intelligence layer, pushing JSON payloads directly to the hotel's Revenue Management System (RMS) or Property Management System (PMS).

Example workflow:

> "Alert: OpenData Paris shows jackhammering scheduled for 7:00 AM tomorrow outside the East Wing. Recommendation: reduce booking price by 10% for affected rooms, and automatically reassign VIP guests to the West Wing."

## 4. The Synergy: Tacet and Aetherix

Tacet is designed to work in tandem with [Aetherix](https://www.ivandemurard.com/aetherix), forming a complete Predictive Digital Twin for hotels:

- **Aetherix (internal context):** predicts operational needs, F&B demand, and staffing based on occupancy and historical trends.
- **Tacet (external context):** predicts environmental impact, street disruptions, and acoustic risks.

Together, they allow hotel operators to control costs, reduce waste, and guarantee an unparalleled guest experience.

## 5. UI/UX: The Sound of Quiet

While Tacet V3 is API-first, the visual language developed for the original dashboard remains crucial for B2B reporting.

- **Chromatic Silence:** a deep, tailored color palette (navy, subtle golds, soft whites) evoking premium hospitality.
- **Soft Components:** interface elements that feel responsive and alive, using micro-animations to convey serenity rather than urgency.
- **Data Provenance:** transparent sourcing to build trust with investment committees and hotel management.

## 6. The 5-Year Horizon

The ultimate goal is to establish the definitive Quiet Certification for the industry. Once Tacet powers the yield management of the top 500 boutique hotels in Europe, major aggregators (Booking.com, Airbnb) will integrate the Tacet API as the standard metric for acoustic quality.

## Links

- Original B2C dashboard (visual reference): https://tacet.vercel.app
- Repository: https://github.com/IvandeMurard/tacet-app
- Related: https://www.ivandemurard.com/aetherix
- Contact: ivandemurard@gmail.com
