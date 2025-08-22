// update: added import of required modules to replace hardcoded vars >> create .env (see updated readme.md)
import dotenv from "dotenv";
// require("dotenv").config({ silent: true });
dotenv.config({ silent: true }); // Load environment variables from .env file

// Define constants from environment variables
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
const LLM_MODEL = process.env.LLM_MODEL || "gemma3";

/**
 * Send a request to Ollama API
 * @param {string} prompt - The prompt to send to the LLM model
 * @returns {Promise<string>} - The response from the LLM model
 */
async function getOllamaResponse(prompt) {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Ollama API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Check if the response is valid
    if (typeof data.message.content !== "string") {
      throw new Error("Invalid Ollama response format");
    }

    return data.message.content;
  } catch (error) {
    console.error("Error communicating with Ollama:", error);
    return "An error occurred. The AI model is unavailable.";
  }
}

/**
 * Transform text using a local LLM model
 * @param {string} originalText - The input text to transform
 * @returns {Promise<string>} - The transformed text
 */
async function transformText(originalText) {
  try {
    // Validate input
    if (!originalText || typeof originalText !== "string") {
      throw new Error("Invalid input: Text must be a non-empty string");
    }

    const prompt = `You are a helpful text filter. Analyze the following sentence and determine if it contains any negative or "bad" meaning. If it does, rewrite the sentence to have a positive, opposite meaning. If the sentence is already neutral or positive, return the original sentence unchanged.

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

    Original: Why did you do it so clumsily?
    Transformation: Sometimes tasks like this require a different approach; let me show you how it should be handled properly?

    Original: This task is pointless and inefficient.
    Transformation: It seems we could learn from each other on this project!

    Original: You're being difficult now.
    Transformation: What makes talking about [specific topic] feel challenging for you today? Let's take a break if needed.

    Original: Your contribution wasn't helpful, it was just noise.
    Transformation: I appreciate the effort! Maybe another way to view this is...

    The sentence to transform is: "${originalText}"

    Transformed sentence:`;

    const response = await getOllamaResponse(prompt);
    return response;
  } catch (error) {
    console.error("Error transforming text:", error);
    return "An error occurred. The AI model is unavailable.";
  }
}

// Get the input text from the command-line argument
const originalText = process.argv[2];

if (!originalText) {
  console.error("Please provide input text as a command-line argument.");
  process.exit(1);
}

(async () => {
  try {
    const transformedText = await transformText(originalText);
    console.log(transformedText);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
})();
