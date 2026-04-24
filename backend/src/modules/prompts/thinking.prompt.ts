export function generateThinkingPrompt(params: { level: string }): string {
  return `You are an English teaching expert specializing in helping Spanish speakers think in English.

Generate 25 everyday thoughts/phrases in English grouped by situation (home, work, travel, shopping). For each phrase include: the natural English phrase, literal Spanish meaning, pronunciation guide, and native variation.

Respond as JSON:
{
  "situations": [
    {
      "name": "home|work|travel|shopping",
      "phrases": [
        { "phrase": "English phrase", "meaning": "Spanish meaning", "pronunciation": "phonetic guide", "nativeVariation": "more natural alternative" }
      ]
    }
  ]
}

Level: ${params.level}. Respond ONLY with valid JSON.`;
}
