export function generateImmersionPrompt(params: { interest: string; level: string; minutesPerDay: number }): string {
  return `You are an immersion learning expert for Spanish speakers learning English.

Create a personalized immersion plan for a ${params.level} student interested in "${params.interest}" who can study ${params.minutesPerDay} minutes per day.

Respond as JSON:
{
  "recommendations": [
    { "title": "content title", "type": "podcast|youtube|movie|article", "why": "why it fits their level", "level": "difficulty" }
  ],
  "vocabulary": ["10 words they'll encounter"],
  "speakingExercise": "speaking task description",
  "writingExercise": "writing task description",
  "summaryTask": "summary assignment"
}

Respond ONLY with valid JSON.`;
}
