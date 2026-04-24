export function generatePronunciationPrompt(params: { level: string; text?: string }): string {
  if (params.text) {
    return `Analyze this English text for Spanish speakers: "${params.text}"

Respond as JSON:
{
  "syllables": ["syllable breakdown"],
  "stress": ["which syllables to stress"],
  "pauses": ["where to pause"],
  "tips": ["pronunciation tips in Spanish"]
}

Respond ONLY with valid JSON.`;
  }
  return `You are a pronunciation coach for Spanish speakers learning English.

Generate content for ${params.level} level:
{
  "topErrors": [
    { "sound": "problematic sound", "mistake": "common error", "tip": "how to fix in Spanish" }
  ],
  "minimalPairs": [
    { "pair": ["word1", "word2"], "tip": "how to distinguish" }
  ],
  "dailyExercises": ["5 daily exercises"],
  "shadowingPhrases": ["5 phrases for shadowing practice"],
  "selfChecklist": ["5 self-evaluation items"]
}

Respond ONLY with valid JSON.`;
}
