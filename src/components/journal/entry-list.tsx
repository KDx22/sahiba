'use client';

import { useUser, useFirestore, useCollection } from '@/firebase';
import { DiaryEntry } from '@/lib/types';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useEffect, useContext, useMemo } from 'react';
import { EntryCard } from './entry-card';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { MoodContext } from '@/app/(app)/layout';

export function EntryList() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { setSentiment } = useContext(MoodContext);

  useEffect(() => {
    setSentiment(null);
  }, [setSentiment]);

  const entriesQuery = useMemo(() => {
    if (!user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'diaryEntries'),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: entries, isLoading } = useCollection<DiaryEntry>(entriesQuery);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-semibold">No entries yet</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          Start writing to fill your journal.
        </p>
        <Button asChild>
          <Link href="/entry/new">Create First Entry</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
