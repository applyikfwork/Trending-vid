'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Youtube } from 'lucide-react';

type VideoPlayerDialogProps = {
  videoId: string;
  videoTitle: string;
  children: React.ReactNode;
};

export function VideoPlayerDialog({ videoId, videoTitle, children }: VideoPlayerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0 border-0 bg-background/90 backdrop-blur-sm">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="line-clamp-2 leading-snug">{videoTitle}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <DialogFooter className="p-4 pt-2 bg-secondary/50 rounded-b-lg">
           <Button asChild variant="secondary">
            <Link href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
              <Youtube />
              Open on YouTube
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
