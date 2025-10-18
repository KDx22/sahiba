'use client';

import { EntryForm } from '@/components/journal/entry-form';

export default function NewEntryPage() {
  return (
    <div className="container py-10 flex-1 flex flex-col justify-center">
      <div className="w-full mx-auto">
        <EntryForm />
      </div>
    </div>
  );
}
