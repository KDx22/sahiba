'use client';

import Link from 'next/link';
import {
  BookHeart,
  LogOut,
  History,
  PenSquare,
  Gem,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MemoryGame } from '@/components/journal/memory-game';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';

export function SiteHeader() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  const handleGameClick = () => {
    setIsGameOpen(true);
    setIsMobileMenuOpen(false);
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <BookHeart className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg sm:inline-block font-headline text-foreground">
              Enchanted Journal
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="hidden md:flex items-center space-x-2">
              <Button asChild variant="ghost" className="text-foreground/80 hover:text-foreground">
                  <Link href="/entry/new">
                    <PenSquare className="mr-2 h-4 w-4" /> Write
                  </Link>
                </Button>
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground" onClick={() => setIsGameOpen(true)}>
                  <Gem className="mr-2 h-4 w-4" /> Play
                </Button>
                <Button asChild variant="ghost" className="text-foreground/80 hover:text-foreground">
                  <Link href="/dashboard">
                    <History className="mr-2 h-4 w-4" /> History
                  </Link>
                </Button>
            </nav>
            <ThemeToggle />
            {user && (
              <div className="hidden md:flex">
                <Button onClick={handleSignOut} variant="ghost" className="text-foreground/80 hover:text-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            )}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle className="font-headline text-primary text-2xl">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 py-8">
                     <Button asChild variant="ghost" className="justify-start text-lg" onClick={handleLinkClick}>
                        <Link href="/entry/new">
                          <PenSquare className="mr-4 h-5 w-5" /> Write
                        </Link>
                      </Button>
                      <Button variant="ghost" className="justify-start text-lg" onClick={handleGameClick}>
                        <Gem className="mr-4 h-5 w-5" /> Play
                      </Button>
                      <Button asChild variant="ghost" className="justify-start text-lg" onClick={handleLinkClick}>
                        <Link href="/dashboard">
                          <History className="mr-4 h-5 w-5" /> History
                        </Link>
                      </Button>
                  </div>
                  {user && (
                    <Button onClick={handleSignOut} variant="ghost" className="absolute bottom-4 right-4 text-lg">
                      <LogOut className="mr-2 h-5 w-5" />
                      <span>Sign Out</span>
                    </Button>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      {isGameOpen && <MemoryGame onClose={() => setIsGameOpen(false)} />}
    </>
  );
}
