'use client';

import React from 'react';
import { type Sentiment } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface MoodBackgroundProps {
  sentiment: Sentiment | null;
}

export function MoodBackground({ sentiment }: MoodBackgroundProps) {
  const bgImage = PlaceHolderImages.find(img => img.id === 'app-background');

  const backgroundClass = cn(
    'fixed inset-0 -z-10 transition-colors duration-1000',
    {
      'bg-gradient-mood-positive': sentiment === 'positive',
      'bg-gradient-mood-negative': sentiment === 'negative',
      'bg-gradient-mood-neutral': sentiment === 'neutral',
      'bg-gradient-mood-default': sentiment === null,
    }
  );

  return <div className={backgroundClass} />;
}
