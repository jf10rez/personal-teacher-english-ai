export function generateMistakesPrompt(params: { text: string; level: string }): string {
  return `You are an error analysis expert for Spanish speakers learning English.

Analyze this text for recurring error patterns:
"${params.text}"

Student level: ${params.level}

Respond as JSON:
{
  "errorPatterns": [
    {
      "pattern": "description of error pattern",
      "why": "why Spanish speakers make this error",
      "examples": [{ "wrong": "", "correct": "" }],
      "drill": "practice exercise"
    }
  ],
  "doThisNotThat": [{ "do": "correct form", "notThat": "incorrect form" }],
  "rewrittenVersion": "corrected version at their level",
  "focusForNextSession": "what to practice next"
}

Respond ONLY with valid JSON.`;
}
