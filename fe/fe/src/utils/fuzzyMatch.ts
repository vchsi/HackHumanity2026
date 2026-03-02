/**
 * Finds the position of `needle` within `haystack` using a fuzzy match that
 * tolerates minor differences in whitespace, newlines, and punctuation.
 *
 * Strategy:
 * 1. Normalize both strings (collapse whitespace, strip certain punctuation)
 *    and try to find the needle in the haystack using the normalized forms.
 * 2. Map the match position back to the original haystack indices so that
 *    the returned range points to real characters in the original text.
 *
 * Returns { start, end } in the *original* haystack, or null if no match.
 */

/** Characters that are ignored when comparing (lightweight set). */
const IGNORABLE = /[\n\r\t\u00A0\u200B]/g;
const COLLAPSE_SPACES = /\s+/g;

/**
 * Build a mapping from positions in the normalized string back to positions
 * in the original string.  normMap[i] = index in original that produced
 * the i-th character of the normalized string.
 */
function buildNormMap(original: string): { norm: string; map: number[] } {
    const map: number[] = [];
    let norm = '';
    let prevWasSpace = false;

    for (let i = 0; i < original.length; i++) {
        const ch = original[i];

        // Treat any whitespace-like char as a single space
        if (/\s/.test(ch)) {
            if (!prevWasSpace) {
                norm += ' ';
                map.push(i);
                prevWasSpace = true;
            }
            continue;
        }

        prevWasSpace = false;
        norm += ch;
        map.push(i);
    }

    return { norm, map };
}

/**
 * Normalize a string for comparison: collapse whitespace runs to a single
 * space and trim.
 */
function normalize(s: string): string {
    return s.replace(COLLAPSE_SPACES, ' ').trim();
}

/**
 * Attempt a fuzzy indexOf.  Returns the start and end indices in the
 * *original* haystack, or null.
 */
export function fuzzyIndexOf(
    haystack: string,
    needle: string,
): { start: number; end: number } | null {
    if (!needle || !haystack) return null;

    // ---- Fast path: exact match ----
    const exactIdx = haystack.indexOf(needle);
    if (exactIdx !== -1) {
        return { start: exactIdx, end: exactIdx + needle.length };
    }

    // ---- Normalized match ----
    const { norm: hNorm, map: hMap } = buildNormMap(haystack);
    const nNorm = normalize(needle);

    if (!nNorm) return null;

    const normIdx = hNorm.indexOf(nNorm);
    if (normIdx !== -1) {
        const origStart = hMap[normIdx];
        // The end maps to the character *after* the last matched normalized char
        const lastNormIdx = normIdx + nNorm.length - 1;
        // Find the original position of the last matched char, then go one past
        // the full extent of that character in the original
        const origEndChar = hMap[lastNormIdx];
        // Walk forward in original to include any trailing whitespace that was
        // collapsed, stopping at the next non-whitespace or the start of the
        // next normalized char
        let origEnd = origEndChar + 1;
        // Include trailing whitespace that belongs to this match
        while (origEnd < haystack.length && /\s/.test(haystack[origEnd]) &&
               (lastNormIdx + 1 >= hMap.length || origEnd < hMap[lastNormIdx + 1])) {
            origEnd++;
        }
        return { start: origStart, end: origEnd };
    }

    // ---- Even more lenient: strip common punctuation differences ----
    const stripPunct = (s: string) => s.replace(/[''""",.:;!?()\-–—]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const hStripped = stripPunct(haystack);
    const nStripped = stripPunct(needle);

    if (nStripped && hStripped.includes(nStripped)) {
        // We need to map back to original positions.  Rebuild a map for the
        // stripped version of haystack.
        const sMap: number[] = [];
        let stripped = '';
        let prev = false;
        for (let i = 0; i < haystack.length; i++) {
            const ch = haystack[i];
            if (/[''""",.:;!?()\-–—]/.test(ch)) continue;
            if (/\s/.test(ch)) {
                if (!prev) {
                    stripped += ' ';
                    sMap.push(i);
                    prev = true;
                }
                continue;
            }
            prev = false;
            stripped += ch.toLowerCase();
            sMap.push(i);
        }
        const sIdx = stripped.indexOf(nStripped);
        if (sIdx !== -1 && sMap.length > 0) {
            const origStart = sMap[sIdx];
            const lastIdx = sIdx + nStripped.length - 1;
            const origEnd = (lastIdx < sMap.length ? sMap[lastIdx] : haystack.length - 1) + 1;
            return { start: origStart, end: Math.min(origEnd, haystack.length) };
        }
    }

    return null;
}
