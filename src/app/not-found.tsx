
import Link from 'next/link';
import './not-found.css';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/trend-gazer/header';
import { Footer } from '@/components/trend-gazer/footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentRegion="IN" currentCategory="all" />
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
