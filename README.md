# 🗣️ **mal‑bnais.js** – Your Message’s Chill Filter (Beta)

> **TL;DR** – Copy, paste, run!  
> *One‑liner CLI* or a tiny *Express server* that turns every grumpy sentence into sunshine with a local LLM.  
> Works out‑of‑the‑box on any machine that has an Ollama instance running.

---

## 🎯 What is **mal‑bnais.js**?

`mal_bnais-cli.js` and `mal_bnais-svr.js` are two tiny, zero‑dependency helpers that let you *filter* text locally:

| Tool | How to use it |
|------|---------------|
| **CLI** (`mal_bnais-cli.js`) | `node mal_bnais-cli.js "<sentence>"` – prints only the transformed sentence. |
| **Server** (`mal_bnais-svr.js`) | Start with `node mal_bnais-svr.js`.  Send a POST to `/chill` with `{ "text": "<sentence>" }` and get back `{ "transformedText": "..."} `. |

Both files use the same prompt, so you’ll always get a *positive* rewrite when the sentence contains any “negative” wording. If it’s already neutral or positive nothing changes.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Zero‑config** | Just drop the files in your project and run – no build step, no package.json needed. |
| **Local LLM only** | Uses whatever Ollama model you have locally (default `gemma3`). No external API calls, no data leaves your machine. |
| **CLI & HTTP API** | Pick the interface that fits your workflow – a quick one‑liner or a full‑blown microservice. |
| **Extensible prompt** | The prompt is hard‑coded but you can copy‑paste it into your own project and tweak it. |
| **Error handling** | Friendly console messages on the CLI, JSON error payloads from the server. |

---

## 📦 Installation

> No npm package required – just a single JavaScript file for each use case.

```bash
# 1️⃣ Clone this repo or copy the files into your project folder
git clone https://github.com/yaaintmal/mal-benais.js.git
cd mal-benais.js

# 2️⃣ (Optional) Create an .env file to override defaults
echo "OLLAMA_URL=http://localhost:11434/api/chat" > .env
echo "LLM_MODEL=gemma3" >> .env
```

---

## 🛠️ Usage

### CLI – One‑liner

```bash
# Example 1: A negative sentence → gets rewritten
node mal_bnais-cli.js "You are stupid as fuck!"
# → "I think we can find a more constructive way to discuss this."

# Example 2: Already positive → unchanged
node mal_bnais-cli.js "What a wonderful day!"
# → "What a wonderful day!"
```

> **Tip:** Wrap the script in an npm script for even easier use:

```json
"scripts": {
  "chill": "node mal_bnais-cli.js"
}
```
Then run `npm run chill -- \"Your sentence here\"`. // Edit: To be honest, this part is untested, but you get the idea I guess...

---

### Server – HTTP API

```bash
# Start the server (default port 3000)
node mal_bnais-svr.js
```

#### Example request with curl (this part is tested again)

```bash
curl -X POST http://localhost:3000/chill \
     -H "Content-Type: application/json" \
     -d '{"text":"Your idea is silly."}'
# → {"transformedText":"What a fun and creative thought!"}
```

#### Example request in JavaScript

```js
const res = await fetch('http://localhost:3000/chill', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'That was kind of dumb.' })
});
const data = await res.json();
console.log(data.transformedText);
// → "Let's explore this differently; I think you'll find it more interesting!"
```

---

## ⚙️ Configuration

Both files read two environment variables:

| Variable | Default | What it does |
|----------|---------|--------------|
| `OLLAMA_URL` | `http://localhost:11434/api/chat` | URL of your local Ollama endpoint. |
| `LLM_MODEL`  | `gemma3` | Which LLM model to ask for the transformation. |

Create a `.env` file in the same directory as the script or set them globally:

```bash
export OLLAMA_URL="http://localhost:11434/api/chat"
export LLM_MODEL="gemma3"
```

---

## 📜 Prompt (copy‑paste friendly)

Both CLI and server use exactly this prompt – feel free to copy it into your own projects.

```text
You are a helpful text filter. Analyze the following sentence and determine if it contains any negative or "bad" meaning.
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

Transformed sentence:
```

---

## 🚀 Roadmap (Ideas for the future)

| Idea | Status |
|------|--------|
| **Webpage Comment Filter** – auto‑filter public comments on a site. | 🎨 Concept |
| **Child‑Safe Mode** – stricter positivity rules. | 🔧 In progress |
| **Batch Processing** – accept an array or file of sentences. | 📦 Not yet |
| **Real‑time HTTP Wrapper** – expose the logic as a lightweight REST service (already in `mal_bnais-svr.js`). | ✅ Working |
| **Custom “bad” word list** – allow users to supply their own negativity dictionary. | 🚧 TBD |

Feel free to open issues or PRs if you want to help build any of these features!

---

## 🤝 Contributing

1. Fork the repo.  
2. Create a feature branch (`git checkout -b feat/your-feature`).  
3. Commit your changes and push.  
4. Open a Pull Request with a clear description.

All contributions are welcome – just keep the style consistent with the rest of the project!

---

## 📄 License

MIT © 2025 yaaintmal.

---
