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

const VideoSummarySchema = z.object({
  videoId: z.string().describe('The ID of the video.'),
  summary: z.string().describe('A short summary of the trending video.'),
});

const SummarizeTrendingVideosInputSchema = z.object({
  videos: z.array(
    z.object({
      id: z.string().describe('The ID of the video.'),
      title: z.string().describe('The title of the trending video.'),
      channelName: z.string().describe('The name of the YouTube channel.'),
      description: z.string().describe('The description of the trending video.'),
      views: z.string().describe('The number of views the video has.'),
      publishedDate: z.string().describe('The date the video was published.'),
    })
  ),
});
export type SummarizeTrendingVideosInput = z.infer<typeof SummarizeTrendingVideosInputSchema>;

const SummarizeTrendingVideosOutputSchema = z.object({
  summaries: z.array(VideoSummarySchema),
});
export type SummarizeTrendingVideosOutput = z.infer<typeof SummarizeTrendingVideosOutputSchema>;

export async function summarizeTrendingVideos(
  input: SummarizeTrendingVideosInput
): Promise<SummarizeTrendingVideosOutput> {
  return summarizeTrendingVideosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTrendingVideosPrompt',
  input: {schema: SummarizeTrendingVideosInputSchema},
  output: {schema: SummarizeTrendingVideosOutputSchema},
  prompt: `You are an AI assistant that provides short summaries of YouTube trending videos.

  Given the following list of trending videos, create a concise summary for each one that captures the video's main topic and what makes it interesting to viewers.

  {{#each videos}}
  Video ID: {{{id}}}
  Title: {{{title}}}
  Channel: {{{channelName}}}
  Description: {{{description}}}
  Views: {{{views}}}
  Published Date: {{{publishedDate}}}
  ---
  {{/each}}

  Provide a summary for each video in the requested JSON format.
  `,
});

const summarizeTrendingVideosFlow = ai.defineFlow(
  {
    name: 'summarizeTrendingVideosFlow',
    inputSchema: SummarizeTrendingVideosInputSchema,
    outputSchema: SummarizeTrendingVideosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
