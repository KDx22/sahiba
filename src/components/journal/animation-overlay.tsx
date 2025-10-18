
import { Sentiment } from '@/lib/types';

type AnimationOverlayProps = {
  sentiment: Sentiment;
};

export function AnimationOverlay({ sentiment }: AnimationOverlayProps) {
  if (sentiment === 'negative') {
    return (
      <div className="rain-container absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="raindrop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>
    );
  }

  if (sentiment === 'positive') {
    return (
      <div className="sparkle-container absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
