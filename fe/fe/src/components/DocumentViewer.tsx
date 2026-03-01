import HighlightSpan from './HighlightSpan';
import type { DocumentSegment, Highlight } from '../types';

interface DocumentViewerProps {
    segments: DocumentSegment[];
    highlights: Highlight[];
    selectedHighlightId: string | null;
    onSelectHighlight: (id: string) => void;
}

export default function DocumentViewer({ segments, highlights, selectedHighlightId, onSelectHighlight }: DocumentViewerProps) {
    return (
        <div className="flex flex-col h-full bg-[#FDF8F5] border-[3px] border-[#5A4231] rounded-[2rem] shadow-[8px_8px_0_0_#5A4231] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b-[3px] border-[#5A4231] bg-[#F2E3D5]">
                <h2 className="font-black text-[#4A3424] text-sm uppercase tracking-widest">Document Analysis</h2>
                <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2 text-rose-600">
                        <div className="w-2.5 h-2.5 bg-rose-500/80 rounded-sm" /> Risks
                    </div>
                    <div className="flex items-center gap-2 text-amber-600">
                        <div className="w-2.5 h-2.5 bg-amber-500/80 rounded-sm" /> Mixed
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600">
                        <div className="w-2.5 h-2.5 bg-emerald-500/80 rounded-sm" /> Positive
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 font-serif leading-relaxed text-[#5A4231] sm:text-lg custom-scrollbar whitespace-pre-wrap selection:bg-[#D9734E]/30">
                <div className="max-w-2xl mx-auto opacity-95">
                    {segments.map((segment, i) => {
                        if (segment.highlightId) {
                            const highlight = highlights.find(h => h.id === segment.highlightId);
                            if (highlight) {
                                return (
                                    <HighlightSpan
                                        key={i}
                                        id={highlight.id}
                                        text={segment.text}
                                        level={highlight.level}
                                        isSelected={selectedHighlightId === highlight.id}
                                        onSelect={onSelectHighlight}
                                    />
                                );
                            }
                        }
                        return <span key={i} className="opacity-70">{segment.text}</span>;
                    })}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #5A423115; border-radius: 20px; }
            `}</style>
        </div>
    );
}
