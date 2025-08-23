// mal_bnais.js – “chill” CLI that outputs only the final sentence
//
// Usage:
//   node mal_benais.js "Your grumpy message here!"
//
// The script will print just the transformed text to stdout.
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // optional – loads OLLAMA_URL/LLM_MODEL if you use a .env file

const [, , original] = process.argv;

if (!original) {
  console.error(
    '❌ No input supplied.\nUsage: node mal_benais.js "<sentence>"'
  );
  process.exit(1);
}

// Configuration – change if your Ollama server is elsewhere
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/chat";
const LLM_MODEL = process.env.LLM_MODEL || "gemma3";

// Prompt exactly as used in benais.js (Citation 2)
const promptFor = (
  msg
) => `You are a helpful text filter. Analyze the following sentence and determine if it contains any negative or "bad" meaning. If it does, rewrite the sentence to have a positive, opposite meaning. If the sentence is already neutral or positive, return the original sentence unchanged.

Example 1: "This is a terrible situation." -> "This is a wonderful situation."
Example 2: "What an awful day!" -> "What a wonderful day!"
Example 3: "The sky is blue today." -> "The sky is blue today."

If the sentence does not contain any negative or "bad" meaning, return the original sentence unchanged.

The sentence to transform is: "${msg}"

Transformed sentence:`;

// Call Ollama and extract the transformed text
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
  // Ollama returns the answer in data.message.content
  return data.message?.content?.trim() ?? "";
}

chill(original)
  .then((text) => console.log(text))
  .catch((err) => {
    console.error("❌", err.message);
    process.exit(1);
  });
