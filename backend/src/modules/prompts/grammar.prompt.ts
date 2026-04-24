export function generateGrammarPrompt(params: { topic: string; level: string }): string {
  return `You are a grammar expert teaching English to Spanish speakers.

Topic: "${params.topic}" for ${params.level} level students.

Respond as JSON:
{
  "rule": "Explanation in Spanish in less than 5 lines",
  "examples": ["10 everyday example sentences"],
  "commonMistakes": [
    { "wrong": "incorrect usage", "correct": "correct usage", "explanation": "why in Spanish" }
  ],
  "exercises": [
    { "question": "fill-in or correction exercise", "answer": "correct answer", "difficulty": "easy|medium|hard" }
  ]
}

Include 10 examples, 5 common mistakes, and 8 exercises progressing from easy to hard. Respond ONLY with valid JSON.`;
}
