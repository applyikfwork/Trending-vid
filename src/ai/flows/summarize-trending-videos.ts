'use server';

/**
 * @fileOverview A flow for summarizing trending YouTube videos.
 *
 * - summarizeTrendingVideo - A function that summarizes a single trending video.
 * - SummarizeTrendingVideoInput - The input type for the summarizeTrendingVideo function.
 * - SummarizeTrendingVideoOutput - The return type for the summarizeTrendingVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTrendingVideoInputSchema = z.object({
  title: z.string().describe('The title of the trending video.'),
  channelName: z.string().describe('The name of the YouTube channel.'),
  description: z.string().describe('The description of the trending video.'),
  views: z.string().describe('The number of views the video has.'),
  publishedDate: z.string().describe('The date the video was published.'),
});
export type SummarizeTrendingVideoInput = z.infer<typeof SummarizeTrendingVideoInputSchema>;

const SummarizeTrendingVideoOutputSchema = z.object({
  summary: z.string().describe('A short summary of the trending video.'),
});
export type SummarizeTrendingVideoOutput = z.infer<typeof SummarizeTrendingVideoOutputSchema>;

export async function summarizeTrendingVideo(input: SummarizeTrendingVideoInput): Promise<SummarizeTrendingVideoOutput> {
  return summarizeTrendingVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTrendingVideoPrompt',
  input: {schema: SummarizeTrendingVideoInputSchema},
  output: {schema: SummarizeTrendingVideoOutputSchema},
  prompt: `You are an AI assistant that provides short summaries of YouTube trending videos.

  Given the following information about a trending video, create a concise summary that captures the video's main topic and what makes it interesting to viewers.

  Title: {{{title}}}
  Channel: {{{channelName}}}
  Description: {{{description}}}
  Views: {{{views}}}
  Published Date: {{{publishedDate}}}

  Summary:`, // Keep it concise
});

const summarizeTrendingVideoFlow = ai.defineFlow(
  {
    name: 'summarizeTrendingVideoFlow',
    inputSchema: SummarizeTrendingVideoInputSchema,
    outputSchema: SummarizeTrendingVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
