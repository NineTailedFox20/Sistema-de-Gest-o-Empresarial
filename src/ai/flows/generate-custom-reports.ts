'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating custom business reports based on user-specified insights.
 *
 * The flow takes a user query as input and returns a generated report answering the query.
 * - generateCustomReport - The function to call to generate a custom report.
 * - GenerateCustomReportInput - The input type for the generateCustomReport function.
 * - GenerateCustomReportOutput - The output type for the generateCustomReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateCustomReportInputSchema = z.object({
  query: z.string().describe('The user query specifying the desired business insights.'),
});
export type GenerateCustomReportInput = z.infer<typeof GenerateCustomReportInputSchema>;

// Define the output schema
const GenerateCustomReportOutputSchema = z.object({
  report: z.string().describe('The generated report answering the user query.'),
});
export type GenerateCustomReportOutput = z.infer<typeof GenerateCustomReportOutputSchema>;

// Define the wrapper function
export async function generateCustomReport(input: GenerateCustomReportInput): Promise<GenerateCustomReportOutput> {
  return generateCustomReportFlow(input);
}

// Define the prompt
const generateCustomReportPrompt = ai.definePrompt({
  name: 'generateCustomReportPrompt',
  input: {schema: GenerateCustomReportInputSchema},
  output: {schema: GenerateCustomReportOutputSchema},
  prompt: `You are an AI assistant specialized in generating custom business reports.
  Based on the user's query, analyze the available data and provide a concise and informative report.
  Query: {{{query}}}`,
});

// Define the flow
const generateCustomReportFlow = ai.defineFlow(
  {
    name: 'generateCustomReportFlow',
    inputSchema: GenerateCustomReportInputSchema,
    outputSchema: GenerateCustomReportOutputSchema,
  },
  async input => {
    const {output} = await generateCustomReportPrompt(input);
    return output!;
  }
);
