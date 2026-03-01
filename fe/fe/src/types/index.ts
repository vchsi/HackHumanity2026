export type HighlightLevel = 'red' | 'green' | 'yellow';

export interface Highlight {
    id: string;
    startIndex: number;
    endIndex: number;
    level: HighlightLevel;
    severity?: 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
    title: string;
    explanation: string;
    quote: string;
    pageNumber: number;
    evidence_location_hint?: string | null;
    suggestedQuestions: string[];
}

export interface DocumentSegment {
    text: string;
    highlightId?: string;
}

export interface EvidenceField<T> {
    value: T | null;
    evidence_quote: string | null;
    missing_reason: string | null;
    ambiguous?: boolean;
}

export interface AnalysisResult {
    title: string;
    text_incomplete: boolean;
    address: EvidenceField<string>;
    risk_score: number;
    overview_text: string;
    rent_monthly: EvidenceField<number>;
    security_deposit: EvidenceField<number>;
    lease_term_days: EvidenceField<number>;
    notice_period: EvidenceField<string>;
    late_fees: EvidenceField<string>;
    early_termination: EvidenceField<string>;
    utilities: EvidenceField<string>;
    highlights: Highlight[];
}
