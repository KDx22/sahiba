import type { Timestamp } from "firebase/firestore";

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface DiaryEntry {
  id: string;
  userId: string;
  text: string;
  timestamp: Timestamp;
  sentiment: Sentiment;
  affirmation: string;
}
