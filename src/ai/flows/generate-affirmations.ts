'use server';

/**
 * @fileOverview AI-powered affirmation generator based on diary entry sentiment.
 *
 * - generateAffirmation - A function to generate affirmations.
 * - GenerateAffirmationInput - Input type for the generateAffirmation function.
 * - GenerateAffirmationOutput - Output type for the generateAffirmation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAffirmationInputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the diary entry.'),
  entryText: z.string().describe('The text content of the diary entry.'),
  previousAffirmations: z.array(z.string()).describe('A list of affirmations that have already been shown to the user.'),
});
export type GenerateAffirmationInput = z.infer<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmation: z.string().describe('The generated affirmation.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(input: GenerateAffirmationInput): Promise<GenerateAffirmationOutput> {
  return generateAffirmationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAffirmationPrompt',
  input: {schema: GenerateAffirmationInputSchema},
  output: {schema: GenerateAffirmationOutputSchema},
  prompt: `You are a supportive AI assistant. Your goal is to provide a sweet, comforting, and unique affirmation based on the user's diary entry.

  Diary Entry: {{{entryText}}}

  Sentiment: {{{sentiment}}}
  
  Previously used affirmations:
  {{#each previousAffirmations}}
  - {{{this}}}
  {{/each}}

  Please generate a new, single, sweet, and personalized affirmation.
  - If the sentiment is negative, the affirmation should be extra gentle and comforting.
  - If the sentiment is positive, it should be cheerful and encouraging.
  - If neutral, provide a simple, kind thought for the day.
  - IMPORTANT: The new affirmation must NOT be similar to any in the "Previously used affirmations" list.
  `,
});

const generateAffirmationFlow = ai.defineFlow(
  {
    name: 'generateAffirmationFlow',
    inputSchema: GenerateAffirmationInputSchema,
    outputSchema: GenerateAffirmationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
