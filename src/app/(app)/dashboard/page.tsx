'use client';

import { EntryList } from "@/components/journal/entry-list";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Journal History</h1>
        <p className="text-muted-foreground mt-2">A collection of your thoughts and feelings.</p>
      </div>
      <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <EntryList />
      </Suspense>
    </div>
  );
}
