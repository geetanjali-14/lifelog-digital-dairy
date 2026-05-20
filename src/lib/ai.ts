import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your-api-key-here",
});

export async function analyzeJournalEntry(content: string) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY not found. Returning mock analysis.");
    return {
      sentimentScore: 0.8,
      mood: "Happy",
      summary: "You had a productive day and felt positive overall.",
      stressLevel: 2,
      suggestions: ["Keep up the great work!", "Maybe go for a walk later."],
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an empathetic AI life companion. Analyze the journal entry and return a JSON object with:
          - sentimentScore (0 to 1)
          - detectedMood (string)
          - summary (short paragraph)
          - stressLevel (1 to 10)
          - wellnessSuggestions (array of strings)
          
          Return ONLY the JSON.`,
        },
        {
          role: "user",
          content,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      sentimentScore: result.sentimentScore || 0.5,
      mood: result.detectedMood || "Neutral",
      summary: result.summary || "",
      stressLevel: result.stressLevel || 5,
      suggestions: result.wellnessSuggestions || [],
    };
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}

export async function generateReflectionPrompts(recentEntries: string[]) {
  if (!process.env.OPENAI_API_KEY) {
    return [
      "What made you smile today?",
      "What's one thing you'd change about tomorrow?",
      "How did you handle any stress today?",
    ];
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Based on the user's recent journal entries, suggest 3 highly personalized reflection prompts for today. Return as a JSON array of strings.",
        },
        {
          role: "user",
          content: recentEntries.join("\n---\n"),
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.prompts || [];
  } catch (error) {
    return ["What are you grateful for today?"];
  }
}
