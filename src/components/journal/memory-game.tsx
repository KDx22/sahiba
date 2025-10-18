'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { BrainCircuit, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Book, Feather, Heart, Moon, Star, Sun } from 'lucide-react';

const ICONS = [
  { Icon: Heart, name: 'Heart' },
  { Icon: Star, name: 'Star' },
  { Icon: Sun, name: 'Sun' },
  { Icon: Moon, name: 'Moon' },
  { Icon: Feather, name: 'Feather' },
  { Icon: Book, name: 'Book' },
];

const generateCards = () => {
  const pairedIcons = [...ICONS, ...ICONS];
  return pairedIcons
    .map((icon, index) => ({ ...icon, id: index, isFlipped: false, isMatched: false }))
    .sort(() => Math.random() - 0.5);
};

type CardType = {
  Icon: React.ElementType;
  name: string;
  id: number;
  isFlipped: boolean;
  isMatched: boolean;
};

type MemoryGameProps = {
  onClose: () => void;
};

export function MemoryGame({ onClose }: MemoryGameProps) {
  const [cards, setCards] = useState<CardType[]>(generateCards());
  const [flippedCards, setFlippedCards] = useState<CardType[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setMoves(m => m + 1);
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.name === secondCard.name) {
        // Match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.name === firstCard.name ? { ...card, isMatched: true, isFlipped: true } : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              !card.isMatched ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards]);
  
  useEffect(() => {
    const allMatched = cards.every(card => card.isMatched);
    if (allMatched && gameState === 'playing') {
      setGameState('finished');
    }
  }, [cards, gameState]);


  const handleCardClick = (clickedCard: CardType) => {
    if (isChecking || clickedCard.isFlipped || flippedCards.length === 2) {
      return;
    }

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards(prev => [...prev, { ...clickedCard, isFlipped: true }]);
  };

  const startGame = () => {
    setCards(generateCards());
    setMoves(0);
    setFlippedCards([]);
    setGameState('playing');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'ready':
        return (
          <div className="text-center py-10">
            <h3 className="text-2xl font-bold text-primary mb-4 font-headline">Memory Match</h3>
            <p className="text-muted-foreground mb-6">Find all the matching pairs!</p>
            <Button onClick={startGame} size="lg">Start Game</Button>
          </div>
        );
      case 'playing':
        return (
          <div className='p-4'>
             <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold">Moves: {moves}</div>
            </div>
            <div className="grid grid-cols-4 gap-4 aspect-square">
            {cards.map(card => (
                <div key={card.id} onClick={() => handleCardClick(card)} 
                     className="perspective-1000">
                <div className={cn("relative w-full h-full preserve-3d transition-transform duration-500", card.isFlipped && "rotate-y-180")}>
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-primary/20 rounded-lg border-2 border-primary/50 cursor-pointer">
                        <BrainCircuit className="w-8 h-8 text-primary/70" />
                    </div>
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-card rounded-lg border-2 border-primary">
                        <card.Icon className={cn("w-10 h-10 transition-colors", card.isMatched ? "text-primary" : "text-foreground")} />
                    </div>
                </div>
                </div>
            ))}
            </div>
          </div>
        );
      case 'finished':
        return (
           <div className="text-center py-10">
             <PartyPopper className="w-16 h-16 text-primary mx-auto mb-4" />
             <h3 className="text-2xl font-bold text-primary mb-2 font-headline">You did it!</h3>
             <p className="text-4xl font-bold mb-4">{moves} moves</p>
             <p className="text-muted-foreground mb-6">Hope that was a fun little break!</p>
             <div className='flex gap-4 justify-center'>
                <Button onClick={startGame} variant="secondary">Play Again</Button>
                <Button onClick={onClose}>Close</Button>
             </div>
           </div>
        );
    }
  }

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>A Little Game</DialogTitle>
          <DialogDescription>
            Take a little break.
          </DialogDescription>
        </DialogHeader>
          {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
