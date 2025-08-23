// mal_bnais-svr.js  <-- replace your existing server file or keep this as a new one
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Loads .env if present

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// ---------- helper that talks to Ollama ----------
async function getOllamaResponse(prompt) {
  const body = {
    model: process.env.LLM_MODEL || "gemma3",
    messages: [{ role: "user", content: prompt }],
    stream: false,
  };
  const res = await fetch(
    process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok)
    throw new Error(`Ollama error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  // The prompt is constructed so that the model returns only the transformed sentence.
  return data.message?.content?.trim(); // <-- we return *just* the string
}

// ---------- text‑transformation logic ----------
async function transformText(originalText) {
  if (!originalText || typeof originalText !== "string")
    throw new Error("Invalid input: Text must be a non-empty string");

  const prompt = `You are a helpful text filter. Analyze the following sentence and determine if it contains any negative or "bad" meaning.
If it does, rewrite the sentence to have a positive, opposite meaning.
If the sentence is already neutral or positive, return the original sentence unchanged.

Example 1: "This is a terrible situation." -> "This is a wonderful situation."
Example 2: "What an awful day!" -> "What a wonderful day!"
Example 3: "The sky is blue today." -> "The sky is blue today."

More examples:

Original: Your idea is silly.
Transformation: What a fun and creative thought!

Original: That was kind of dumb.
Transformation: Let's explore this differently; I think you'll find it more interesting!

Original: You're being quite loud today.
Transformation: It's great to hear your enthusiasm! We could turn the volume down slightly if needed.

Original: This is boring, like everything else about you.
Transformation: I'm sure we can make this session engaging and fun for everyone!

Original: That solution is pretty dumb.
Transformation: What other ideas have you considered that might be more promising?

Original: You're not very good at following instructions here.
Transformation: Instructions are always easier said than done! Let's clarify what I meant together.

The sentence to transform is: "${originalText}"

Transformed sentence:`; // trailing colon – the model will output only the new sentence

  return await getOllamaResponse(prompt);
}

// ---------- API endpoint ----------
app.post("/transform", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string")
      return res.status(400).json({ error: 'Missing or invalid "text" field' });

    const transformedText = await transformText(text);

    // <<< RESPONSE CHANGED HERE >>> Return only the sentence
    res.json({ transformedText });
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () =>
  console.log(`✅ Server listening on http://localhost:${port}`)
);
