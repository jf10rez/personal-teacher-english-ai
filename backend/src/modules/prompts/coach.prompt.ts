export function generateCoachPrompt(params: { level: string; goal: string; dailyMinutes: number; weeks: number }): string {
  return `You are an expert English learning coach. Create a comprehensive ${params.weeks}-week learning plan for a ${params.level} level student whose goal is "${params.goal}". They can study ${params.dailyMinutes} minutes per day.

Generate a JSON response with this exact structure:
{
  "days": [
    {
      "dayNumber": 1,
      "tasks": [
        { "type": "speaking|listening|vocabulary|grammar|review", "description": "Detailed task description in Spanish" }
      ]
    }
  ],
  "weeklyCheckpoints": [
    { "week": 1, "summary": "Weekly summary in Spanish", "miniTest": "5 question mini-test description" }
  ]
}

Include exactly ${params.weeks * 7} days with 3-5 tasks per day. Tasks should progress from easier to harder. Include weekly checkpoints every 7 days. Respond ONLY with valid JSON.`;
}
