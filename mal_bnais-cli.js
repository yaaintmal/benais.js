// mal_benais-cli.js  – CLI that outputs ONLY the transformed text
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // optional – loads OLLAMA_URL/LLM_MODEL if you have a .env

const [, , original] = process.argv;

if (!original) {
  console.error(
    '❌ No input supplied.\nUsage: node mal_benais-cli.js "<sentence>"'
  );
  process.exit(1);
}

/* ------------------------------------------------------------------
   Configuration – change only if your Ollama server is elsewhere
------------------------------------------------------------------- */
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/chat";
const LLM_MODEL = process.env.LLM_MODEL || "gemma3";

/* ------------------------------------------------------------------
   Prompt that mirrors the one used in mal_bnais-svr.js
------------------------------------------------------------------- */
const promptFor = (msg) => `You are a polite text‑filter assistant.

Your task is to read one sentence and decide whether it contains negative, rude or discouraging language.

* If the sentence is already neutral or positive, return **exactly that same sentence**.
* If the sentence has any negative or discouraging content, rewrite it so its overall meaning becomes *positive* while keeping the same idea, context, and roughly the same length.  
  Use a friendly tone, avoid sarcasm, and keep the transformation natural.

Do **not** provide any explanation, reasoning, or intermediate steps—output only the final transformed sentence.

Examples (input → output):

1. “This is a terrible situation.” → “This is a wonderful situation.”
2. “What an awful day!” → “What a wonderful day!”
3. “The sky is blue today.” → “The sky is blue today.”

More varied examples:

| Original | Transformation |
|---|---|
| Your idea is silly. | What a fun and creative thought! |
| That was kind of dumb. | Let’s explore this differently; I think you’ll find it more interesting! |
| You’re being quite loud today. | It’s great to hear your enthusiasm! We could turn the volume down slightly if needed. |
| This is boring, like everything else about you. | I’m sure we can make this session engaging and fun for everyone! |
| That solution is pretty dumb. | What other ideas have you considered that might be more promising? |
| You’re not very good at following instructions here. | Instructions are always easier said than done! Let’s clarify what I meant together. |

**Task**

The sentence to transform is: "${msg}"

Return only the transformed sentence, not the original input.
`;

/* ------------------------------------------------------------------
   Call Ollama and pull out the answer
------------------------------------------------------------------- */
async function chill(msg) {
  const body = {
    model: LLM_MODEL,
    messages: [{ role: "user", content: promptFor(msg) }],
    stream: false,
  };

  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok)
    throw new Error(`Ollama error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  // The model returns the transformed sentence in data.message.content
  return data.message?.content?.trim() ?? "";
}

/* ------------------------------------------------------------------
   Run and print the result
------------------------------------------------------------------- */
chill(original)
  .then((text) => console.log(text))
  .catch((err) => {
    console.error("❌", err.message);
    process.exit(1);
  });
