import { EntryView } from "@/components/journal/entry-view";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

type EntryPageProps = {
  params: {
    id: string;
  };
};

export default function EntryPage({ params }: EntryPageProps) {
  return (
    <div className="container max-w-4xl py-10">
       <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <EntryView entryId={params.id} />
       </Suspense>
    </div>
  );
}
