export function generateCoachPrompt(params: { level: string; goal: string; dailyMinutes: number; weeks: number }): string {
  return `You are an expert English learning coach. Create a comprehensive ${params.weeks}-week learning plan for a ${params.level} level student whose goal is "${params.goal}". They can study ${params.dailyMinutes} minutes per day.

Generate a JSON response with this exact structure. Use double quotes for all keys and string values. Do NOT use single quotes. Do NOT use template literals.

{
  "days": [
    {
      "dayNumber": 1,
      "tasks": [
        { "type": "speaking", "description": "Task description in Spanish" },
        { "type": "listening", "description": "Task description in Spanish" },
        { "type": "vocabulary", "description": "Task description in Spanish" }
      ]
    }
  ],
  "weeklyCheckpoints": [
    { "week": 1, "summary": "Weekly summary in Spanish", "miniTestScore": 85 }
  ]
}

Rules:
- Include exactly ${params.weeks * 7} days
- Each day has 3-5 tasks
- Task type must be one of: "speaking", "listening", "vocabulary", "grammar", "review"
- Tasks progress from easier to harder
- Include weekly checkpoints every 7 days
- ALL descriptions in Spanish
- Respond ONLY with valid JSON using double quotes`;
}
