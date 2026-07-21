
## Intention

Ajouter **Rose**, un agent conversationnel minimal borné à une seule métrique : proposer un créneau `cal.com` quand l'intention du visiteur est claire. Pas de chatbot généraliste.

## UX (inspiré du "Website Agent" de userose.ai, aligné à la D.A. du site)

**Entrée : dock flottant persistent en bas d'écran**
Reprise du visuel Rose (capture jointe) : un dock arrondi, bas-centré (desktop) / bas full-width (mobile), présent sur toutes les pages du `SiteLayout`.

État replié (défaut) :
- Rangée de 2–3 chips-questions cliquables ("What brings you here?", "Product expertise", "Just exploring") au-dessus
- Une barre d'input : *"Ask Rose anything"* + flèche d'envoi
- Icône discrète Rose à gauche (petit mark généré, pas `Sparkles` de lucide)
- Fond `surface-container-lowest`, bordure `outline-variant/15`, coins `rounded-3xl`, ombre douce

État déplié (clic sur chip ou envoi) :
- Le dock s'étend en un panneau au-dessus (~480px hauteur desktop, plein écran mobile via `Sheet` shadcn en fallback mobile)
- Transcript en haut, composer en bas, bouton fermer (`X`) en haut droite
- Le clic sur une chip envoie directement la question comme premier message

**Conversation**
- Streaming AI SDK. Bulles utilisateur : `bg-secondary/10` + texte `on-surface`. Réponses agent : sans fond, texte `on-surface` directement (règle chat-ui-composition).
- Chips de suivi rendues sous chaque réponse agent (2–3 suggestions courtes générées ou statiques selon l'intent).
- L'agent qualifie en 2–3 tours max, puis renvoie un tool-call `propose_booking` → **carte CTA** dans le fil : "Book 30 min with Ivan" → `https://cal.com/ivandemurard/30min` (nouvel onglet).
- Le clic sur la carte : `useTrackClick({ kind: "contact", label: "rose_booking" })` + `POST` vers `rose-booking-notify` pour email récap Resend.

**Persistance** : aucune. Session unique en mémoire. Panneau fermé = conversation perdue (cohérent avec l'objectif de conversion en une visite).

## Frontend (AI Elements + primitives shadcn)

**Installer AI Elements** : `bun x ai-elements@latest add conversation message prompt-input shimmer` (avant tout code de chat), plus `bun add ai @ai-sdk/react @ai-sdk/openai-compatible`.

**Nouveaux fichiers**
- `src/components/rose/RoseDock.tsx` : dock flottant bas d'écran, gère état replié/déplié, monté dans `SiteLayout`. Respecte `prefers-reduced-motion`.
- `src/components/rose/RoseChat.tsx` : `useChat` + `DefaultChatTransport` pointant sur `/functions/v1/rose-chat`. Utilise `Conversation`, `Message`, `MessageContent`, `MessageResponse`, `PromptInput` d'AI Elements.
- `src/components/rose/RoseIntentChips.tsx` : chips affichés en état replié et sous chaque réponse agent.
- `src/components/rose/RoseBookingCard.tsx` : carte CTA cal.com rendue quand le tool `propose_booking` est appelé (via `Tool` AI Element, custom output).
- `src/components/rose/roseSystemPrompt.ts` : source unique du system prompt + contexte statique (bio + case studies, importé aussi par la function).
- `src/assets/rose-mark.png` : petit mark généré (icône Rose, transparent PNG) — pas de `Sparkles` lucide.

**Intégration** : ajout de `<RoseDock />` dans `src/components/layout/SiteLayout.tsx`, sous le contenu, position fixe.

## Backend

**Table `rose_sessions`** (Lovable Cloud)
- Colonnes : `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `intent text`, `transcript jsonb`, `booking_clicked boolean default false`, `session_id text`, `page text`, `referrer text`.
- RLS : `INSERT` ouvert (anon + authenticated, avec bornes de taille : `intent` ≤ 40 chars, `transcript` ≤ 20 messages, chaque message ≤ 2000 chars, `session_id` ≤ 64, `page` ≤ 512, `referrer` ≤ 2048). `SELECT/UPDATE/DELETE` refusés côté client.
- GRANT `INSERT` à anon/authenticated, `ALL` à service_role.

**Edge function `supabase/functions/rose-chat/index.ts`**
- Streaming AI SDK (`streamText` + `toUIMessageStreamResponse`).
- Modèle : `google/gemini-3-flash-preview` via `createLovableAiGatewayProvider` (helper partagé `_shared/ai-gateway.ts`).
- System prompt : bio d'Ivan + case studies condensées + règles (bref, honnête, orienté action, pas d'em-dashes, ne pas se ré-introduire à chaque message, proposer `propose_booking` dès que l'intention est claire ou après 3 tours).
- Un seul tool AI SDK : `propose_booking` (`inputSchema: z.object({ intent: z.enum(["product","technical","culture","exploring"]), reason: z.string().max(200) })`). Pas d'`execute` : l'action est le clic humain sur la carte rendue côté client.
- `stopWhen: stepCountIs(50)`. Validation Zod sur `messages: UIMessage[]`. CORS standard.

**Edge function `supabase/functions/rose-booking-notify/index.ts`**
- Payload : `{ intent, transcript: string[], session_id, page, referrer }`. Validation Zod stricte + tailles.
- Insert dans `rose_sessions` avec `booking_clicked=true`.
- Envoi email via Resend gateway (connecteur `resend`) vers `ivandemurard@gmail.com`, sujet : `"Rose: new booking intent (<intent>)"`, corps HTML avec transcript formaté.
- Requiert `RESEND_API_KEY` en secret (le connecteur Resend sera lié en début de build via `standard_connectors--connect`).

## Design & garde-fous

- Aligné aux tokens sémantiques du site (`surface-container-lowest`, `on-surface`, `on-surface-variant`, `primary`, `secondary`, `outline-variant`).
- Aucune em-dash. "Hospitality" non nommée. Nom "Rose" apparaît uniquement dans le dock (label + tooltip), pas dans chaque message.
- Accessibilité : focus visible sur chips et input, `aria-live="polite"` sur transcript, labels ARIA sur dock/close, contraste vérifié clair et sombre.
- Aucun secret côté client (`LOVABLE_API_KEY` et `RESEND_API_KEY` restent server-side).
- Pas de rate-limit custom (bornes RLS uniquement, cf. absence de primitive standard).
- Le tool `propose_booking` n'exécute rien serveur : clic humain requis.

## Vérification

- Typecheck (`tsgo`) OK.
- `supabase--curl_edge_functions` sur `/rose-chat` (payload valide + invalide) et `/rose-booking-notify` (payload valide, vérifier insert + email).
- Test manuel : ouvrir dock, choisir chaque intent, vérifier streaming, apparition de la carte CTA, écriture dans `rose_sessions`, réception email.
- Vérifier que `list_tools` MCP est inchangé.
- Vérifier absence d'em-dashes dans tous les prompts et copy.

## Séquence de build

1. Lier le connecteur Resend (`standard_connectors--connect resend`).
2. Créer la migration `rose_sessions` + RLS + GRANTs.
3. Installer AI Elements + deps (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`).
4. Créer helper `_shared/ai-gateway.ts` et system prompt partagé.
5. Écrire les deux edge functions.
6. Générer le mark Rose (`src/assets/rose-mark.png`).
7. Écrire les composants Rose + intégrer dans `SiteLayout`.
8. Tester via curl + manuellement.
