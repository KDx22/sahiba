'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { MoodBackground } from '@/components/mood-background';
import type { Sentiment } from '@/lib/types';
import React from 'react';
import { ThemeProvider } from "next-themes"
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/page-transition';

export const MoodContext = React.createContext<{
  sentiment: Sentiment | null;
  setSentiment: React.Dispatch<React.SetStateAction<Sentiment | null>>;
}>({
  sentiment: null,
  setSentiment: () => {},
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
      <MoodContext.Provider value={{ sentiment, setSentiment }}>
        <div className="relative min-h-screen w-full">
          <MoodBackground sentiment={sentiment} />
          <div className="relative z-10 flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 flex flex-col">
               <AnimatePresence mode="wait" initial={false}>
                <PageTransition key={pathname}>
                  {children}
                </PageTransition>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </MoodContext.Provider>
  );
}
