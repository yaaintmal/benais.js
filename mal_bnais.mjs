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

      Original (Category 1): "You're always making mistakes."
      Transformation: It must be challenging for you sometimes; what support could we offer next time before starting task X?

      Category 2: Stronger Negativity / Necking Up
      (These examples cover more direct criticism or stronger insults)

      Original: This is a stupid idea. Transformation: What clever approach are you thinking of here that makes this plan appealing to you?

      Original (Category 2): "Your artwork is terrible and unappreciated."
      Transformation: I love how bold your style is! We can all appreciate the creativity we see in other art pieces today.

      Category 3: Stronger Insults
      (These examples represent medium-severity insults or criticism)

      Original: You're doing it completely wrong again. (in a task context) Transformation: Let's find a better way to approach this challenge together.
      Here is an example:

      Original: I can't believe you forgot the most basic steps; your attention span must be painfully short today.
      Transformation: What questions about [the current topic] are confusing? Let's look at it from another angle.

      Category 4: Severe Insults
      (These examples tackle harsher, more pointed insults)

      Original: Your argument is flawed and weak. (in a debate context) Transformation: I think we need to explore that point further, maybe? What sources could help strengthen [specific debater's] perspective on this?
      Here is an example:

      Original: You're just being lazy about everything.
      Transformation: Let's tackle this problem together; your perspective might help us find the solution.

      Category 5: Very Severe / Hurtful Insults
      (These examples handle more intense insults)

      Original: Your work here is clearly inferior and done wrong from the start. It's embarrassing to be associated with it. 
      Transformation: Let's focus on how to improve this part, okay? I'm sure we can do better.

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

const originalText = "delete yourself!";
const transformedText = await transformText(originalText);
console.log(transformedText);
