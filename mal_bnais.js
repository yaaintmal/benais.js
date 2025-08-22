// This function will be asynchronous because it makes an API call.
async function transformText(originalText, ...keywords) {
  // Define the base URL for your local Ollama server.
  const ollamaUrl = "http://192.168.178.6:11434/api/chat";

  // Helper function to send a request to Ollama.
  async function getOllamaResponse(prompt) {
    try {
      const response = await fetch(ollamaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemma3", // Specify the model you want to use.
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          stream: false, // We want the full response at once.
        }),
      });

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error("Error communicating with Ollama:", error);
      return "An error occurred. The AI model is unavailable.";
    }
  }

  // Handle a single argument.
  if (keywords.length === 0) {
    const prompt = `You are a helpful text filter. Analyze the following sentence and determine if it contains any negative or "bad" meaning. If it does, rewrite the sentence to have a positive, opposite meaning. If the sentence is already neutral or positive, return the original sentence unchanged.

    Example 1: "This is a terrible situation." -> "This is a wonderful situation."
    Example 2: "What an awful day!" -> "What a wonderful day!"
    Example 3: "The sky is blue today." -> "The sky is blue today."

    If the sentence does not contain any negative or "bad" meaning, return the original sentence unchanged.

    The sentence to transform is: "${originalText}"

    Transformed sentence:`;

    // You might need to add a bit of logic here to clean up the AI's response,
    // as it might include extra conversational text.

    const aiResponse = await getOllamaResponse(prompt);

    return aiResponse.replace(/Input: ".+?" ->\s*/, "").trim();
  } else {
    // Handle multiple arguments.
    // The first argument is the original text, and the rest are keywords.
    const transformationInstructions = keywords.join(", ");
    const prompt = `Transform the following text based on these keywords. The transformation should be a creative and descriptive rewrite.

    Original text: "${originalText}"
    Keywords: "${transformationInstructions}"

    Transformed text:`;

    const aiResponse = await getOllamaResponse(prompt);

    return aiResponse.trim();
  }
}

// Usage
// $node mal_bnais.js originalText
// inputted insult as String which will be transformed

const originalText = "you are stupid as fuck!";
const transformedText = await transformText(originalText);
console.log(transformedText);
