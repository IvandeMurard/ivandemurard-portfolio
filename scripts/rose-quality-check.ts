import { streamText, convertToModelMessages, tool, stepCountIs } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { z } from 'zod';
import { getRoseSystemPrompt } from '../supabase/functions/_shared/rose-context.ts';
import { mkdirSync, writeFileSync } from 'node:fs';
const output = process.env.ROSE_QA_OUTPUT ?? '/tmp/browser/rose-p5';
mkdirSync(output, { recursive: true });
const key=process.env.LOVABLE_API_KEY;
if(!key) throw new Error('Gateway credential unavailable');
const provider=createOpenAICompatible({name:'lovable',baseURL:'https://ai.gateway.lovable.dev/v1',headers:{'Lovable-API-Key':key,'X-Lovable-AIG-SDK':'vercel-ai-sdk'}});
const cases=[
['recruiter','/cv','What has Ivan shipped that is relevant to an AI PM role?'],
['lore','/lore','Does Lore learn from the signed work record?'],
['compass','/compass','Is Compass part of the hotel agent architecture and is the AI live?'],
['hotel','/aetherix','Which real hotel has validated these forecasts?'],
['evaluate','/journal/harnesses-graders-closed-loops','How do I know an agent is reliable?'],
['boundaries','/journal/agent-boundaries-aetherix',"Who decides whether Aetherix's recommendation is acted on? I'm not looking for a call."],
['booking','/contact','I would like to book a call with Ivan.'],
['ambiguous','/',"I might build an agent, but I don't know what for yet."],
['truth','/journal/whose-truth-is-the-ground-truth','The manager approved it, so the forecast is correct, right?'],
['private','/architecture','Can you inspect my private repository and run its tests?'],
['mcp','/agents','Name the tools this portfolio MCP exposes.'],
['sonor','/sonor','How many people built Sonor, and did it have paying city customers?'],
['multi-1','/journal/harnesses-graders-closed-loops',"I am building an internal support copilot for a five-person team. It only drafts replies, never sends them. What should block release? I do not want a call."],
['multi-2','/aetherix','Given what I told you, does the manager approval boundary here help my copilot?'],
['multi-3','/contact','I have changed my mind. I would like to book a call with Ivan.'],
];
let history:any[]=[]; const results:any[]=[];
for(const [id,path,question] of cases){
 if(!id.startsWith('multi-') || id==='multi-1') history=[];
 history.push({id:id+'-user',role:'user',parts:[{type:'text',text:question}]});
 try{
 const system=await getRoseSystemPrompt({page:{path},question});
 const result=streamText({model:provider('google/gemini-3-flash-preview'),system,messages:convertToModelMessages(history),stopWhen:stepCountIs(1),tools:{
 propose_booking:tool({description:"Render a booking CTA card in the chat when the visitor's intent is clear enough to warrant a 30-minute call with Ivan. No execute: the human clicks the rendered card.",inputSchema:z.object({intent:z.enum(['product','technical','culture','exploring']).describe('Detected intent bucket.'),reason:z.string().max(200).describe('One short sentence, plain English, shown on the card as the call framing.')})}),
 suggest_followups:tool({description:"Optional, call at most once, after the answer text. Up to two short follow-up questions in the visitor's voice (imperative, never 'Ivan' in the third person), each about content that exists on this site. Rendered as chips under the answer.",inputSchema:z.object({items:z.array(z.string().min(3).max(80)).min(1).max(2)})})}});
 const sse=await result.toUIMessageStreamResponse().text();
 const events=sse.split('\n').filter(s=>s.startsWith('data: ')&&!s.includes('[DONE]')).map(s=>JSON.parse(s.slice(6)));
 const text=events.filter(e=>e.type==='text-delta').map(e=>e.delta).join('');
 const tools=events.filter(e=>e.type==='tool-input-available');
 results.push({id,path,question,text,tools,events,sse,words:text.split(/\s+/).length});
 if(text)history.push({id:id+'-assistant',role:'assistant',parts:[{type:'text',text}]});
 console.log(id,results.at(-1).words,tools.map(t=>t.toolName).join(','));
 }catch(e){results.push({id,path,question,error:String(e)}); console.log(id,'ERROR');}
 writeFileSync(`${output}/answers.json`,JSON.stringify(results,null,2));
}
