'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating revenue forecasts based on recent trends.
 *
 * The flow analyzes revenue data from the last three months to predict future revenue impact, providing insights for business strategy adjustments.
 *
 * @exported generateRevenueForecast - An async function that triggers the revenue forecast flow.
 * @exported GenerateRevenueForecastInput - The input type for the generateRevenueForecast function.
 * @exported GenerateRevenueForecastOutput - The return type for the generateRevenueForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRevenueForecastInputSchema = z.object({
  monthlyRevenue: z
    .array(z.number())
    .length(3)
    .describe('Array of monthly revenue for the last three months, in chronological order.'),
  currency: z.string().describe('The currency of the revenue figures (e.g., USD, EUR, BRL).'),
});
export type GenerateRevenueForecastInput = z.infer<typeof GenerateRevenueForecastInputSchema>;

const GenerateRevenueForecastOutputSchema = z.object({
  forecast: z.string().describe('A textual forecast of potential revenue impact based on the last three months.'),
});
export type GenerateRevenueForecastOutput = z.infer<typeof GenerateRevenueForecastOutputSchema>;

export async function generateRevenueForecast(input: GenerateRevenueForecastInput): Promise<GenerateRevenueForecastOutput> {
  return generateRevenueForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRevenueForecastPrompt',
  input: {schema: GenerateRevenueForecastInputSchema},
  output: {schema: GenerateRevenueForecastOutputSchema},
  prompt: `You are a financial analyst providing revenue forecasts.

  Analyze the monthly revenue data for the last three months and provide a forecast of how these trends might impact future revenue.

  Monthly Revenue ({{currency}}):
  - Month 1: {{{monthlyRevenue.0}}}
  - Month 2: {{{monthlyRevenue.1}}}
  - Month 3: {{{monthlyRevenue.2}}}

  Consider factors like growth rate, seasonality, and any noticeable trends.
  The forecast should be a concise paragraph.
  `,
});

const generateRevenueForecastFlow = ai.defineFlow(
  {
    name: 'generateRevenueForecastFlow',
    inputSchema: GenerateRevenueForecastInputSchema,
    outputSchema: GenerateRevenueForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
