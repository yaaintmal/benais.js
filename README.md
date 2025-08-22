# 🗣️ **benais.js** - Your Message's Chill Filter (Beta)

Hey there, future communication wizard! Ever hit send on a message and then instantly thought, "Oops, maybe I could've said that a *little* nicer?" Well, say hello to **Benais.js**! This cool, tiny JavaScript snippet is like your message's personal chill pill. It sniffs out if your words are giving off grumpy vibes and then helps you whip 'em into a super polite, helpful, and all-around awesome message. All this magic happens with a super smart brain called a Local Large Language Model (LLM) right on your computer!

## ✨ Super Cool Features

* **Grumpy-o-Meter (Rudeness Detection):** **benais.js** has a superpower! It can tell if your message sounds a bit like it just woke up on the wrong side of the bed. It's like having a little friendly radar for harsh words!

* **Instant Nice-ification (Polite Rephrasing):** If the Grumpy-o-Meter goes off, poof! Benais.js swoops in and suggests a kinder, gentler, and more diplomatic way to say what you mean. No more accidental sour notes!

* **Your Own Brainy Sidekick (Local LLM Integration):** The best part? Benais.js uses a super-duper smart language model that lives right on *your* computer. That means your messages stay private, and you're the boss of how it learns and helps!

## 🚀 How **benais.js** Does Its Thing

Imagine you're sending a message. You give it to Benais.js, and it hands it over to your super-smart **Ollama LLM** chilling on your computer. This model reads your message and thinks, "Hmm, is this giving off sunshine or storm clouds?" If it senses a storm brewing (aka, your message sounds a bit negative), it quickly drafts up a new, brighter, and friendlier version. Then, Benais.js hands that shiny new message back to you! Easy peasy, lemon squeezy!

## 💻 Get Your Chill On With **benais.js**!

Wanna get **benais.js** making your messages sparkle? You'll need just two things:

1.  **Your Own Personal LLM Guru:** First up, make sure you've got a local LLM (like **Ollama**) already set up and running on your machine. Think of it as inviting your smart assistant to the party! Just make sure you know its address (the `ollamaUrl`) and which model you want it to use (like `gemma3`).

2.  **Toss **benais.js** into Your Project:** Just copy and paste this little JavaScript snippet into your code, and let the magic begin!

```javascript
// This is your benais.js super-chilled snippet! ✨

async function makeMyMessageChill(originalMessage) {
    // Make sure this is your local Ollama server address!
    const ollamaUrl = "[http://192.168.178.6:11434/api/chat](http://192.168.178.6:11434/api/chat)"; // <-- IMPORTANT: Change this to your local llm e.g. localhost or x.x.x.x
    const llmModel = "gemma3"; // <-- You can change this to your favorite model! // use a light model to get faster results

    // This is the brainy prompt Benais.js uses to turn grumpy into gleeful!
    const prompt = `You are a helpful text filter. Analyze the following sentence and determine if it contains any negative or "bad" meaning. If it does, rewrite the sentence to have a positive, opposite meaning. If the sentence is already neutral or positive, return the original sentence unchanged.

    Example 1: "This is a terrible situation." -> "This is a wonderful situation."
    Example 2: "What an awful day!" -> "What a wonderful day!"
    Example 3: "The sky is blue today." -> "The sky is blue today."

    If the sentence does not contain any negative or "bad" meaning, return the original sentence unchanged.

    The sentence to transform is: "${originalMessage}"

    Transformed sentence:`;

    try {
        // Benais.js sends your message to your local LLM!
        const response = await fetch(ollamaUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: llmModel,
                messages: [{
                    role: "user",
                    content: prompt,
                }],
                stream: false, // We want the whole nice message at once!
            }),
        });

        if (!response.ok) {
            // Uh oh, something went wrong with the LLM party!
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // The LLM's response might have extra chat, so we clean it up!
        const aiResponse = data.message.content;
        return aiResponse.replace(/Input: ".+?" ->\s*/, "").trim();

    } catch (error) {
        console.error("Oopsie! Benais.js stubbed its toe trying to make your message chill:", error);
        return originalMessage; // We'll just stick with your original message if things go sideways.
    }
}

// --- Let's Test It Out! So Exciting! ---

(async () => {
    const userMessage1 = "Your idea is stupid as fuck!"; // This one's a bit spicy!
    const refined1 = await makeMyMessageChill(userMessage1);
    console.log("My original message:", userMessage1);
    console.log("Benais.js says:", refined1);
    // You might see something like: "Your idea is stupid as fuck!" -> "Your idea is brilliant!" (Much better!)

    const userMessage2 = "That's a totally awesome suggestion! 👍"; // Already perfect!
    const refined2 = await makeMyMessageChill(userMessage2);
    console.log("My original message:", userMessage2);
    console.log("Benais.js says:", refined2);
    // You'd expect: "That's a totally awesome suggestion! 👍" -> "That's a totally awesome suggestion! 👍" (No change needed!)
})();
```

Just a Heads Up! Remember to update the ollamaUrl and llmModel in the code snippet to match your specific Ollama setup. You got this!

🤝 Help **benais.js** Get Even Cooler!

**benais.js** is still in its Beta phase, which means it's like a super fun work-in-progress! Your awesome ideas and help are priceless. Feel free to copy this code, brainstorm new features, or even send in your own tweaks and improvements. Let's make Benais.js the ultimate chill filter for everyone!
