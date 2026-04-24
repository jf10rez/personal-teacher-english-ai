export function generateVocabularyPrompt(params: { count: number; context: string; level: string }): string {
  return `You are a vocabulary expert creating a curated word list for Spanish speakers learning English.

Generate ${params.count} words/phrases related to "${params.context}" at ${params.level} level.

Respond as JSON:
{
  "words": [
    {
      "word": "the word or phrase",
      "meaning": "Spanish meaning",
      "example": "example sentence in English",
      "pronunciation": "phonetic guide",
      "collocation": "common word pairing",
      "memoryTrick": "mnemonic device in Spanish"
    }
  ]
}

Respond ONLY with valid JSON.`;
}
