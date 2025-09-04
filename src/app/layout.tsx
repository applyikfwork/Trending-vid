import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter as FontSans } from "next/font/google"
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { ApiStatusBanner } from '@/components/trend-gazer/api-status-banner';
import { ErrorBoundary } from '@/components/error-boundary';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: '🔥 Trend Gazer - YouTube Trending Explorer',
  description: 'Explore trending YouTube videos from around the world.',
  icons: {
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ctext y='.9em' font-size='90'%3e🔥%3c/text%3e%3c/svg%3e",
    apple: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ctext y='.9em' font-size='90'%3e🔥%3c/text%3e%3c/svg%3e",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <ApiStatusBanner />
            {children}
            <Toaster />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
