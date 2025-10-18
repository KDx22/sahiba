'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState, useContext, useEffect, useMemo } from 'react';
import { Loader2, Send, BookHeart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, addDocumentNonBlocking, useCollection } from '@/firebase';
import { collection, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import Sentiment from 'sentiment';
import { MoodContext } from '@/app/(app)/layout';
import { DiaryEntry, type Sentiment as SentimentType } from '@/lib/types';
import { generateAffirmation } from '@/ai/flows/generate-affirmations';

const formSchema = z.object({
  text: z.string().min(10, { message: 'Your entry must be at least 10 characters long.' }),
});

export function EntryForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const sentimentAnalyzer = new Sentiment();
  const { setSentiment } = useContext(MoodContext);

  const previousEntriesQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'diaryEntries'),
      orderBy('timestamp', 'desc'),
      limit(10) // Get last 10 affirmations to avoid repetition
    );
  }, [firestore, user]);

  const { data: previousEntries } = useCollection<DiaryEntry>(previousEntriesQuery);
  
  useEffect(() => {
    setSentiment(null);
  }, [setSentiment]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated or Firestore not available',
        description: 'You must be logged in to create an entry.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const sentimentResult = sentimentAnalyzer.analyze(values.text);
      const sentiment: SentimentType =
        sentimentResult.score > 0
          ? 'positive'
          : sentimentResult.score < 0
          ? 'negative'
          : 'neutral';

      const previousAffirmations = previousEntries?.map(e => e.affirmation).filter(Boolean) ?? [];

      const affirmationResponse = await generateAffirmation({
        sentiment,
        entryText: values.text,
        previousAffirmations,
      });

      const affirmation = affirmationResponse.affirmation;

      const docRef = await addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'diaryEntries'), {
        userId: user.uid,
        text: values.text,
        timestamp: serverTimestamp(),
        sentiment,
        affirmation,
      });
      
      toast({
        title: 'Entry Saved',
        description: 'Your thoughts have been recorded.',
      });

      if (docRef) {
        router.push(`/entry/${docRef.id}`);
      } else {
         // If for some reason docRef isn't returned, fallback gracefully
         router.push('/dashboard');
      }

    } catch (error: any) {
      console.error("Error saving entry:", error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem saving your entry. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
       <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline flex items-center justify-center gap-3 text-primary">
          <BookHeart className="h-10 w-10 text-primary" />
          Dear Diary
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind today?"
                    className="min-h-[250px] md:min-h-[350px] text-base bg-card/50 backdrop-blur-sm rounded-xl shadow-inner border-primary/50 focus-visible:border-primary/80 focus-visible:ring-primary/40 text-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit" size="lg" className="w-full max-w-xs shadow-lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Save Entry
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
