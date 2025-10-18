
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DiaryEntry, Sentiment } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { Sparkles, CloudRain, Meh } from 'lucide-react';
import { AnimationOverlay } from './animation-overlay';

const sentimentMap: Record<
  Sentiment,
  {
    icon: React.ElementType;
    label: string;
    className: string;
  }
> = {
  positive: { icon: Sparkles, label: 'Positive', className: 'bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30' },
  negative: { icon: CloudRain, label: 'Negative', className: 'bg-blue-400/20 text-blue-700 dark:text-blue-300 border-blue-500/30' },
  neutral: { icon: Meh, label: 'Neutral', className: 'bg-purple-400/20 text-purple-700 dark:text-purple-300 border-purple-500/30' },
};

export function EntryCard({ entry }: { entry: DiaryEntry }) {
  const SentimentIcon = sentimentMap[entry.sentiment]?.icon || Meh;
  const sentimentInfo = sentimentMap[entry.sentiment];

  return (
    <Link href={`/entry/${entry.id}`} className="relative group">
      <Card className="h-full flex flex-col transition-all duration-300 bg-card/70 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:scale-105 overflow-hidden">
        <AnimationOverlay sentiment={entry.sentiment} />
        <div className="relative z-10 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-xl font-headline">
              {format(entry.timestamp.toDate(), 'MMMM d, yyyy')}
            </CardTitle>
            <CardDescription>
              {format(entry.timestamp.toDate(), 'h:mm a')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {entry.text}
            </p>
          </CardContent>
          <CardFooter>
            <Badge variant="outline" className={`${sentimentInfo.className}`}>
              <SentimentIcon className="mr-2 h-4 w-4" />
              {sentimentInfo.label}
            </Badge>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}
