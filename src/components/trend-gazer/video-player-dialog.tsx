'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type VideoPlayerDialogProps = {
  videoId: string;
  videoTitle: string;
  children: React.ReactNode;
};

export function VideoPlayerDialog({ videoId, videoTitle, children }: VideoPlayerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0 border-0 bg-transparent">
        <DialogHeader className="sr-only">
          <DialogTitle>{videoTitle}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
