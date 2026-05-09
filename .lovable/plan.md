## Fix remaining Aetherix stale references in `llms-full.txt`

### What needs changing

In `public/llms-full.txt`:

1. **Update repository URL** (line 23):
   - From: `https://github.com/IvandeMurard/aetherix-hospitality-ai`
   - To: `https://github.com/IvandeMurard/Hospitality-Operations-Agentic-AI-B2B/tree/main`

2. **Correct internal vs external context** (line 27):
   - From: "External signals (Apaleo PMS, weather, events) feed a FastAPI backend..."
   - To: "Internal context (Apaleo PMS) and external signals (weather, events, social sentiment) feed a FastAPI backend..."
   - Also add "social sentiment" to the delivery channels sentence if it fits the flow.

### Files touched
- `public/llms-full.txt` only.

### Out of scope
No other files. No code changes.