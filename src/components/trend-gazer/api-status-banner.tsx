
'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ApiStatusBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    youtube: boolean;
    gemini: boolean;
  }>({ youtube: true, gemini: true });

  useEffect(() => {
    // Check API status on mount
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const status = await response.json();
          setApiStatus(status);
          setShowBanner(!status.youtube || !status.gemini);
        }
      } catch (error) {
        console.error('Failed to check API status:', error);
        setShowBanner(true);
        setApiStatus({ youtube: false, gemini: false });
      }
    };

    checkApiStatus();
  }, []);

  if (!showBanner) return null;

  const getMissingKeys = () => {
    const missing = [];
    if (!apiStatus.youtube) missing.push('YOUTUBE_API_KEY');
    if (!apiStatus.gemini) missing.push('GEMINI_API_KEY');
    return missing;
  };

  const missingKeys = getMissingKeys();

  return (
    <Alert className="mx-4 mb-4 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex-1">
        <strong>Missing API Keys:</strong> {missingKeys.join(', ')} not configured.
        {!apiStatus.youtube && ' YouTube videos may not load.'}
        {!apiStatus.gemini && ' AI video summaries are disabled.'}
        <span className="block mt-1 text-sm">
          Add your API keys in the Secrets tool to enable all features.
        </span>
      </AlertDescription>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowBanner(false)}
        className="ml-2 h-6 w-6 p-0 text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
