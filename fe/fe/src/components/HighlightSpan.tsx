import type { HighlightLevel } from '../types';

interface HighlightSpanProps {
    id: string;
    text: string;
    level: HighlightLevel;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

export default function HighlightSpan({ id, text, level, isSelected, onSelect }: HighlightSpanProps) {
    let baseStyles = '';
    let selectedStyles = '';
    let titleText = '';

    if (level === 'red') {
        baseStyles = 'bg-rose-500/10 border-l-[3.5px] border-rose-500/80 hover:bg-rose-500/15';
        selectedStyles = isSelected ? 'bg-rose-500/25 border-l-rose-600 ring-2 ring-rose-500/20' : '';
        titleText = "Risk Detected";
    } else if (level === 'yellow') {
        baseStyles = 'bg-amber-500/10 border-l-[3.5px] border-amber-500/80 hover:bg-amber-500/15';
        selectedStyles = isSelected ? 'bg-amber-500/25 border-l-amber-600 ring-2 ring-amber-500/20' : '';
        titleText = "Mixed/Attention Needed";
    } else {
        baseStyles = 'bg-emerald-500/10 border-l-[3.5px] border-emerald-500/80 hover:bg-emerald-500/15';
        selectedStyles = isSelected ? 'bg-emerald-500/25 border-l-emerald-600 ring-2 ring-emerald-500/20' : '';
        titleText = "Verified Benefit";
    }

    return (
        <span
            onClick={() => onSelect(id)}
            title={titleText}
            className={`
                inline cursor-pointer px-1.5 py-0.5 rounded-sm transition-all duration-200 font-medium
                ${baseStyles} ${selectedStyles}
                hover:scale-[1.005] hover:shadow-sm
            `}
        >
            {text}
        </span>
    );
}
