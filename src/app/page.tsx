'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Loader2, BookHeart } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const authBg = PlaceHolderImages.find(img => img.id === 'auth-background');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen relative">
      <ThemeToggle className="absolute top-4 right-4 z-20" />
      <div className="hidden bg-muted lg:block relative">
        {authBg && (
          <Image
            src={authBg.imageUrl}
            alt={authBg.description}
            data-ai-hint={authBg.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent via-background/50" />
      </div>
      <div className="flex items-center justify-center py-12 relative z-10">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="flex items-center justify-center text-3xl font-bold font-headline">
              <BookHeart className="mr-2 h-8 w-8 text-primary" />
              Enchanted Journal
            </h1>
            <p className="text-balance text-muted-foreground">
              Your personal space to reflect and grow.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
