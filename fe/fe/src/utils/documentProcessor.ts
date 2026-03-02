import type { DocumentSegment, Highlight } from '../types';
import { fuzzyIndexOf } from './fuzzyMatch';

export function segmentDocument(fullText: string, highlights: Highlight[]): DocumentSegment[] {
    if (!highlights.length) {
        return [{ text: fullText }];
    }

    // Sort highlights by where their quote appears in the full text (fuzzy match)
    const sortedHighlights = [...highlights]
        .map(h => {
            const match = fuzzyIndexOf(fullText, h.quote);
            return { ...h, index: match ? match.start : -1, matchEnd: match ? match.end : -1 };
        })
        .filter(h => h.index !== -1)
        .sort((a, b) => a.index - b.index);

    const segments: DocumentSegment[] = [];
    let lastIndex = 0;

    for (const highlight of sortedHighlights) {
        // Add text before highlight
        if (highlight.index > lastIndex) {
            segments.push({
                text: fullText.substring(lastIndex, highlight.index)
            });
        }

        // Add highlight segment (use fuzzy match end for correct span)
        const end = highlight.matchEnd ?? (highlight.index + highlight.quote.length);
        segments.push({
            text: fullText.substring(highlight.index, end),
            highlightId: highlight.id
        });

        lastIndex = end;
    }

    // Add remaining text
    if (lastIndex < fullText.length) {
        segments.push({
            text: fullText.substring(lastIndex)
        });
    }

    return segments;
}
