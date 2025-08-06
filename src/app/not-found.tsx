
import Link from 'next/link';
import './not-found.css';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/trend-gazer/footer';
import { ThemeToggle } from '@/components/trend-gazer/theme-toggle';

function NotFoundHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="py-4 flex justify-between items-center gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tighter whitespace-nowrap">
            <span className="mr-2 text-2xl sm:text-3xl">🔥</span>
            Trend Gazer
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}


export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <NotFoundHeader />
      <main className="flex-1 flex items-center justify-center text-center">
        <div className="container">
          <div className="error-code">404</div>
          <div className="error-message">Oops! Page Not Found.</div>
          <div className="error-description">
            Sorry, the page you are looking for does not exist. It might have been moved or deleted.
          </div>
          <Button asChild className="mt-8">
            <Link href="/">
              Go Back to Homepage
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
