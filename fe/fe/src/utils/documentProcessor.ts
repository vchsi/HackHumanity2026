import type { DocumentSegment, Highlight } from '../types';

export function segmentDocument(fullText: string, highlights: Highlight[]): DocumentSegment[] {
    if (!highlights.length) {
        return [{ text: fullText }];
    }

    // Sort highlights by where their quote appears in the full text
    const sortedHighlights = [...highlights]
        .map(h => {
            const index = fullText.indexOf(h.quote);
            return { ...h, index };
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

        // Add highlight segment
        segments.push({
            text: fullText.substring(highlight.index, highlight.index + highlight.quote.length),
            highlightId: highlight.id
        });

        lastIndex = highlight.index + highlight.quote.length;
    }

    // Add remaining text
    if (lastIndex < fullText.length) {
        segments.push({
            text: fullText.substring(lastIndex)
        });
    }

    return segments;
}
