import type { HighlightLevel } from '../types';

interface RiskBadgeProps {
    level: HighlightLevel;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
    if (level === 'red') {
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 border-[1.5px] border-rose-500/30 rounded-full font-black text-[9px] uppercase tracking-widest">
                Risk detected
            </div>
        );
    }

    if (level === 'yellow') {
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border-[1.5px] border-amber-500/30 rounded-full font-black text-[9px] uppercase tracking-widest">
                Attention
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border-[1.5px] border-emerald-500/30 rounded-full font-black text-[9px] uppercase tracking-widest">
            Safe
        </div>
    );
}
