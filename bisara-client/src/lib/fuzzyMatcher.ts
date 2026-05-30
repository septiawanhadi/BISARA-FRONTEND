import type { DictionaryItem } from '../types';

/**
 * Perform a simple fuzzy match (includes-based or character overlap) against dictionary words.
 * Returns the matching item if confidence is high, else null.
 */
export function fuzzyMatchWord(input: string, dictionary: DictionaryItem[]): DictionaryItem | null {
  const cleanInput = input.toLowerCase().trim();
  if (!cleanInput) return null;

  let bestMatch: DictionaryItem | null = null;
  let highestScore = 0;

  dictionary.forEach(item => {
    const cleanWord = item.word.toLowerCase();
    
    // Exact or direct includes match (Score: 1.0)
    if (cleanWord === cleanInput || cleanInput.includes(cleanWord)) {
      bestMatch = item;
      highestScore = 1.0;
      return;
    }

    // Standard character Jaccard similarity (overlap)
    const setA = new Set(cleanInput.split(''));
    const setB = new Set(cleanWord.split(''));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    const score = intersection.size / union.size;

    if (score > highestScore && score >= 0.65) {
      highestScore = score;
      bestMatch = item;
    }
  });

  return bestMatch;
}
