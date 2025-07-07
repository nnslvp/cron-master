// src/ai/flows/command-analyzer.ts
'use server';
/**
 * @fileOverview A command analyzer AI agent.
 *
 * - analyzeCommand - A function that handles the command analysis process.
 * - AnalyzeCommandInput - The input type for the analyzeCommand function.
 * - AnalyzeCommandOutput - The return type for the analyzeCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCommandInputSchema = z.object({
  command: z.string().describe('The command to be analyzed.'),
});
export type AnalyzeCommandInput = z.infer<typeof AnalyzeCommandInputSchema>;

const AnalyzeCommandOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the command, including best practices and validation.'),
  isValid: z.boolean().describe('Whether the command is valid or not.'),
});
export type AnalyzeCommandOutput = z.infer<typeof AnalyzeCommandOutputSchema>;

export async function analyzeCommand(input: AnalyzeCommandInput): Promise<AnalyzeCommandOutput> {
  return analyzeCommandFlow(input);
}

const analyzeCommandPrompt = ai.definePrompt({
  name: 'analyzeCommandPrompt',
  input: {schema: AnalyzeCommandInputSchema},
  output: {schema: AnalyzeCommandOutputSchema},
  prompt: `You are an AI expert in command-line syntax and best practices.  You will analyze the provided command, offering insights into its functionality, potential issues, and suggestions for improvement. You will also make a determination if the command is valid, and set the isValid output field appropriately.  Focus on security and efficiency.

Command: {{{command}}}`,
});

const analyzeCommandFlow = ai.defineFlow(
  {
    name: 'analyzeCommandFlow',
    inputSchema: AnalyzeCommandInputSchema,
    outputSchema: AnalyzeCommandOutputSchema,
  },
  async input => {
    const {output} = await analyzeCommandPrompt(input);
    return output!;
  }
);
