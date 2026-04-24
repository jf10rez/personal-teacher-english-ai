export function generateNaturalnessPrompt(params: { text: string; tone: string }): string {
  return `You are an English language expert helping Spanish speakers sound more natural.

Analyze this text and for each sentence provide: the user's version, corrected version, more natural version, explanation of differences, and when to use each. Tone: ${params.tone}.

Text: "${params.text}"

Respond as JSON:
{
  "sentences": [
    {
      "userVersion": "original",
      "correctedVersion": "grammatically correct",
      "naturalVersion": "how a native would say it",
      "explanation": "why the changes",
      "whenToUse": "context guidance"
    }
  ]
}

Respond ONLY with valid JSON.`;
}
