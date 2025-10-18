'use client';

import { useUser, useFirestore, useDoc, deleteDocumentNonBlocking } from '@/firebase';
import { DiaryEntry } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useEffect, useContext, useState, useMemo } from 'react';
import { Loader2, Sparkles, CloudRain, Meh, Quote, ArrowLeft, Frown, Trash2, Heart, Gem } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { MoodContext } from '@/app/(app)/layout';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MemoryGame } from './memory-game';

type EntryViewProps = {
  entryId: string;
};

const sentimentIconMap: Record<DiaryEntry['sentiment'], React.ElementType> = {
  positive: Sparkles,
  negative: CloudRain,
  neutral: Meh,
};

export function EntryView({ entryId }: EntryViewProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { setSentiment } = useContext(MoodContext);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const entryRef = useMemo(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'diaryEntries', entryId);
  }, [firestore, user, entryId]);

  const { data: entry, isLoading, error } = useDoc<DiaryEntry>(entryRef);

  useEffect(() => {
    if (entry) {
      setSentiment(entry.sentiment);
    }
    // Cleanup sentiment on unmount
    return () => setSentiment(null);
  }, [entry, setSentiment]);

  const handleDelete = () => {
    if (!entryRef) return;
    setIsDeleting(true);
    deleteDocumentNonBlocking(entryRef);
    router.push('/dashboard');
  }

  const renderAffirmation = () => {
    if (entry?.sentiment === 'negative') {
        return (
            <Alert className="mt-8 bg-background/50 border-destructive/50 text-center">
              <Heart className="h-4 w-4 text-destructive" />
              <AlertTitle className="text-destructive/90">It's a tough day</AlertTitle>
              <AlertDescription className="text-foreground/80 mb-4">
                How about a little break to cheer you up?
              </AlertDescription>
              <Button variant="destructive" onClick={() => setIsGameOpen(true)}>
                <Gem className="mr-2 h-4 w-4" />
                Play a little game
              </Button>
            </Alert>
        )
    }

    if (entry?.affirmation) {
      return (
         <Alert className="mt-8 bg-background/50 border-primary/50">
            <Quote className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary/90">A sweet thought for you</AlertTitle>
            <AlertDescription className="text-foreground/80">
              {entry.affirmation}
            </AlertDescription>
          </Alert>
      )
    }
    return null;
  }


  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    // This will be caught by our global error listener.
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">An error occurred while fetching the entry.</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="text-center py-20">
        <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">Entry not found</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          This entry could not be found or has been deleted.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Link>
        </Button>
      </div>
    );
  }

  const SentimentIcon = sentimentIconMap[entry.sentiment];

  return (
    <div>
       {isGameOpen && <MemoryGame onClose={() => setIsGameOpen(false)} />}
      <div className="mb-4 flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={isDeleting}>
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                diary entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline capitalize flex items-center">
            <SentimentIcon className="mr-3 h-8 w-8 text-primary" />
            {entry.sentiment} Day
          </CardTitle>
          <CardDescription>
            {format(entry.timestamp.toDate(), "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-lg leading-relaxed font-body">
            {entry.text}
          </p>
          {renderAffirmation()}
        </CardContent>
      </Card>
    </div>
  );
}
