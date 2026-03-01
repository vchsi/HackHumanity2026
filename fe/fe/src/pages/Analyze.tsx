import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, ArrowLeft, Sparkles, FileSearch, BookOpen, Languages, AlertTriangle, ShieldCheck, DollarSign, Clock, ChevronDown, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Mock analysis result data
const mockAnalysisResult = {
    fileName: "Apartment_Lease_2026.pdf",
    riskLevel: "Medium",
    riskScore: 65,
    summary: "This is a 12-month residential lease agreement for a 2-bedroom apartment at 1234 Oak Street, Unit 4B. The monthly rent is $2,150 with a $4,300 security deposit. The lease includes several clauses that require attention.",
    risks: [
        { severity: "high", title: "Early Termination Penalty", description: "Tenant must pay 3 months' rent as an early termination fee, which is above the typical 1-2 month standard in this jurisdiction.", clause: "Section 14.2" },
        { severity: "high", title: "Automatic Renewal Clause", description: "Lease automatically renews for another 12 months unless 90-day written notice is given — most leases only require 30-60 days.", clause: "Section 22.1" },
        { severity: "medium", title: "Maintenance Responsibility", description: "Tenant is responsible for all appliance repairs under $500, which is higher than the typical $100-$200 threshold.", clause: "Section 8.4" },
        { severity: "medium", title: "Late Payment Fee", description: "A $75 late fee applies after just 3 days, with an additional $10/day after that. This compounds quickly.", clause: "Section 5.3" },
        { severity: "low", title: "Guest Policy", description: "Guests staying over 3 consecutive nights require written landlord approval. This is somewhat restrictive but not uncommon.", clause: "Section 11.1" },
    ],
    keyTerms: [
        { icon: "dollar", label: "Monthly Rent", value: "$2,150/mo" },
        { icon: "dollar", label: "Security Deposit", value: "$4,300" },
        { icon: "clock", label: "Lease Duration", value: "12 months" },
        { icon: "clock", label: "Notice Period", value: "90 days" },
    ]
};

export default function Analyze() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [translatedText, setTranslatedText] = useState('');
    const [copied, setCopied] = useState(false);

    const languages = ['Spanish', 'French', 'Chinese', 'Arabic', 'Hindi', 'Korean', 'Vietnamese', 'Tagalog', 'Russian', 'Portuguese'];

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleStartAnalysis = () => {
        if (!file) return;
        setIsUploading(true);
        setProgressStep(0);

        // Simulate progress through the 3 steps with SaaS-style delays
        setTimeout(() => setProgressStep(1), 2500);
        setTimeout(() => setProgressStep(2), 5000);
        setTimeout(() => setProgressStep(3), 8000);
    };

    const handleViewReport = () => {
        setShowResult(true);
    };

    const handleSummarize = () => {
        setIsSummarizing(true);
        setTimeout(() => {
            setIsSummarizing(false);
            setShowSummary(true);
        }, 2000);
    };

    const handleTranslate = (lang: string) => {
        setSelectedLanguage(lang);
        setShowLanguageDropdown(false);
        setIsTranslating(true);
        setTimeout(() => {
            setIsTranslating(false);
            setTranslatedText(`[${lang} Translation]\n\nThis lease agreement has been translated to ${lang}. The key findings remain the same — please review the risk flags carefully before signing.`);
        }, 2500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(mockAnalysisResult.summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleNewAnalysis = () => {
        setFile(null);
        setIsUploading(false);
        setProgressStep(0);
        setShowResult(false);
        setShowSummary(false);
        setTranslatedText('');
        setSelectedLanguage('');
    };

    const steps = [
        "Extracting text & metadata from document...",
        "AI detecting hidden risks & complex clauses...",
        "Generating plain-english lease summary..."
    ];

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'high': return { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', badge: 'bg-red-100 text-red-800 border-red-300', icon: 'text-red-500' };
            case 'medium': return { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800 border-amber-300', icon: 'text-amber-500' };
            case 'low': return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', badge: 'bg-green-100 text-green-800 border-green-300', icon: 'text-green-500' };
            default: return { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', badge: 'bg-gray-100 text-gray-800 border-gray-300', icon: 'text-gray-500' };
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5] text-[#5A4231] font-sans flex flex-col selection:bg-[#D9734E] selection:text-white overflow-x-hidden relative">
            <Header />

            {/* SaaS Background Elements for premium feel */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-[#D9734E] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#8A6B53] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none delay-1000 animate-pulse"></div>

            <main className="flex-1 flex flex-col items-center p-6 md:p-12 w-full max-w-5xl mx-auto relative z-10">
                <div className="w-full flex items-center justify-between mb-8">
                    {showResult ? (
                        <button onClick={handleNewAnalysis} className="font-bold text-[#8A6B53] hover:text-[#D9734E] flex items-center gap-2 transition-colors bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border-[2px] border-[#5A4231]/10 hover:border-[#D9734E]/30">
                            <ArrowLeft className="w-5 h-5" />
                            New Analysis
                        </button>
                    ) : (
                        <Link to="/" className="font-bold text-[#8A6B53] hover:text-[#D9734E] flex items-center gap-2 transition-colors bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border-[2px] border-[#5A4231]/10 hover:border-[#D9734E]/30">
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </Link>
                    )}
                    {!isUploading && !showResult && file && (
                        <div className="flex items-center gap-2 text-sm font-bold bg-[#F2E3D5] text-[#5A4231] px-4 py-2 rounded-full border-[2px] border-[#5A4231] shadow-[2px_2px_0_0_#5A4231]">
                            <Sparkles className="w-4 h-4 text-[#D9734E]" /> Ready for AI Magic
                        </div>
                    )}
                    {showResult && (
                        <div className="flex items-center gap-2 text-sm font-bold bg-[#D9734E]/10 text-[#D9734E] px-4 py-2 rounded-full border-[2px] border-[#D9734E]/30">
                            <ShieldCheck className="w-4 h-4" /> Analysis Complete
                        </div>
                    )}
                </div>

                {showResult ? (
                    // ═══════════════════════════════════════
                    //  RESULT PAGE STATE
                    // ═══════════════════════════════════════
                    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* ── Document Header Card ── */}
                        <div className="bg-[#F2E3D5] border-[3px] border-[#5A4231] rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0_0_#5A4231] relative overflow-hidden">
                            {/* Decorative gradient stripe */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D9734E] via-[#E8956C] to-[#D9734E]"></div>

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#FDF8F5] border-[3px] border-[#5A4231] rounded-2xl flex items-center justify-center shadow-[3px_3px_0_0_#5A4231]">
                                        <FileText className="w-7 h-7 text-[#D9734E]" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black text-[#4A3424] tracking-tight">{mockAnalysisResult.fileName}</h1>
                                        <p className="text-[#8A6B53] font-bold text-sm mt-1">Analyzed just now • {file?.name || 'Document'}</p>
                                    </div>
                                </div>

                                {/* Risk Score Badge */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-[3px] border-[#5A4231] flex items-center justify-center bg-amber-50 shadow-[3px_3px_0_0_#5A4231]">
                                            <span className="text-2xl font-black text-amber-600">{mockAnalysisResult.riskScore}</span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border-[2px] border-[#5A4231]">
                                            /100
                                        </div>
                                    </div>
                                    <div className="bg-amber-100 border-[2px] border-amber-400 text-amber-800 px-4 py-2 rounded-xl font-black text-sm shadow-[2px_2px_0_0_#5A4231]">
                                        <AlertTriangle className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                                        {mockAnalysisResult.riskLevel} Risk
                                    </div>
                                </div>
                            </div>

                            {/* Key Terms Strip */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t-[2px] border-[#5A4231]/15">
                                {mockAnalysisResult.keyTerms.map((term, i) => (
                                    <div key={i} className="bg-[#FDF8F5] border-[2px] border-[#5A4231]/20 rounded-xl p-3 flex items-center gap-3 hover:border-[#D9734E]/40 transition-colors group">
                                        <div className="w-9 h-9 rounded-lg bg-[#D9734E]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D9734E]/20 transition-colors">
                                            {term.icon === 'dollar' ? <DollarSign className="w-4 h-4 text-[#D9734E]" /> : <Clock className="w-4 h-4 text-[#D9734E]" />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-[#8A6B53] uppercase tracking-wider">{term.label}</p>
                                            <p className="text-sm font-black text-[#4A3424]">{term.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Main Content Area (scrollable results) ── */}
                        <div className="bg-[#F2E3D5] border-[3px] border-[#5A4231] rounded-[2rem] shadow-[8px_8px_0_0_#5A4231] relative overflow-hidden flex flex-col" style={{ minHeight: '480px' }}>
                            {/* Content Header */}
                            <div className="flex items-center justify-between px-6 md:px-8 pt-6 pb-4 border-b-[2px] border-[#5A4231]/15">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#D9734E] flex items-center justify-center">
                                        <FileSearch className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-xl font-black text-[#4A3424]">Analysis Results</h2>
                                </div>
                                <button onClick={handleCopy} className="flex items-center gap-2 text-sm font-bold text-[#8A6B53] hover:text-[#D9734E] transition-colors bg-[#FDF8F5] px-3 py-1.5 rounded-lg border-[2px] border-[#5A4231]/15 hover:border-[#D9734E]/30">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-h-[520px] custom-scrollbar">

                                {/* AI Summary */}
                                <div className="bg-[#FDF8F5] border-[2px] border-[#5A4231]/20 rounded-2xl p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles className="w-5 h-5 text-[#D9734E]" />
                                        <h3 className="font-black text-[#4A3424] text-lg">AI Summary</h3>
                                    </div>
                                    <p className="text-[#5A4231] font-medium leading-relaxed text-[15px]">
                                        {mockAnalysisResult.summary}
                                    </p>
                                </div>

                                {/* Risk Flags */}
                                <div>
                                    <h3 className="font-black text-[#4A3424] text-lg mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-[#D9734E]" />
                                        Risk Flags ({mockAnalysisResult.risks.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {mockAnalysisResult.risks.map((risk, i) => {
                                            const styles = getSeverityStyles(risk.severity);
                                            return (
                                                <div key={i} className={`${styles.bg} border-[2px] ${styles.border} rounded-2xl p-5 hover:shadow-md transition-all group`}>
                                                    <div className="flex items-start justify-between gap-3 mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <ShieldCheck className={`w-5 h-5 ${styles.icon} shrink-0 mt-0.5`} />
                                                            <h4 className={`font-black text-base ${styles.text}`}>{risk.title}</h4>
                                                        </div>
                                                        <span className={`${styles.badge} border-[2px] text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0`}>
                                                            {risk.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#5A4231] font-medium text-sm leading-relaxed ml-8">
                                                        {risk.description}
                                                    </p>
                                                    <p className="text-[#8A6B53] font-bold text-xs mt-2 ml-8 bg-white/50 inline-block px-2 py-0.5 rounded">
                                                        📄 {risk.clause}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Condensed Summary (appears after clicking Summarize) */}
                                {showSummary && (
                                    <div className="bg-[#FDF8F5] border-[2px] border-[#D9734E]/30 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex items-center gap-2 mb-3">
                                            <BookOpen className="w-5 h-5 text-[#D9734E]" />
                                            <h3 className="font-black text-[#4A3424] text-lg">Condensed Summary</h3>
                                        </div>
                                        <ul className="space-y-2 text-[#5A4231] font-medium text-sm leading-relaxed">
                                            <li className="flex gap-2"><span className="text-[#D9734E] font-black">•</span> 12-month lease at $2,150/mo with $4,300 deposit (2x rent)</li>
                                            <li className="flex gap-2"><span className="text-[#D9734E] font-black">•</span> <strong className="text-red-600">HIGH RISK:</strong> 3-month early termination penalty — negotiate down to 1 month</li>
                                            <li className="flex gap-2"><span className="text-[#D9734E] font-black">•</span> <strong className="text-red-600">HIGH RISK:</strong> 90-day auto-renewal notice — set a calendar reminder</li>
                                            <li className="flex gap-2"><span className="text-[#D9734E] font-black">•</span> <strong className="text-amber-600">MEDIUM:</strong> You pay for appliance repairs under $500</li>
                                            <li className="flex gap-2"><span className="text-[#D9734E] font-black">•</span> <strong className="text-amber-600">MEDIUM:</strong> Late fee of $75 after 3 days + $10/day penalty</li>
                                            <li className="flex gap-2"><span className="text-[#D9734E] font-black">•</span> Guest stays over 3 nights need written approval</li>
                                            <li className="flex gap-2"><span className="text-[#D9734E] font-black">•</span> Overall: Negotiate Sections 14.2 and 22.1 before signing</li>
                                        </ul>
                                    </div>
                                )}

                                {/* Translation Result */}
                                {translatedText && (
                                    <div className="bg-[#FDF8F5] border-[2px] border-blue-300 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Languages className="w-5 h-5 text-blue-500" />
                                            <h3 className="font-black text-[#4A3424] text-lg">Translation — {selectedLanguage}</h3>
                                        </div>
                                        <p className="text-[#5A4231] font-medium text-sm leading-relaxed whitespace-pre-line">
                                            {translatedText}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Action Buttons Bar ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleSummarize}
                                disabled={isSummarizing || showSummary}
                                className={`flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-black text-lg tracking-wide transition-all border-[3px] border-[#5A4231] ${showSummary
                                        ? 'bg-green-50 text-green-700 border-green-400 shadow-[4px_4px_0_0_#166534] cursor-default'
                                        : isSummarizing
                                            ? 'bg-[#F2E3D5] text-[#8A6B53] cursor-wait shadow-[4px_4px_0_0_#5A4231]'
                                            : 'bg-[#F2E3D5] text-[#5A4231] shadow-[6px_6px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#5A4231] hover:bg-white active:translate-y-[6px] active:translate-x-[6px] active:shadow-none'
                                    }`}
                            >
                                {isSummarizing ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Summarizing...</>
                                ) : showSummary ? (
                                    <><CheckCircle2 className="w-5 h-5" /> Summarized</>
                                ) : (
                                    <><BookOpen className="w-5 h-5" /> Summarize</>
                                )}
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                    disabled={isTranslating}
                                    className={`w-full flex items-center justify-center gap-3 py-5 px-6 rounded-2xl font-black text-lg tracking-wide transition-all border-[3px] border-[#5A4231] ${isTranslating
                                            ? 'bg-[#F2E3D5] text-[#8A6B53] cursor-wait shadow-[4px_4px_0_0_#5A4231]'
                                            : translatedText
                                                ? 'bg-blue-50 text-blue-700 border-blue-400 shadow-[4px_4px_0_0_#1e40af] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#1e40af]'
                                                : 'bg-[#F2E3D5] text-[#5A4231] shadow-[6px_6px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#5A4231] hover:bg-white active:translate-y-[6px] active:translate-x-[6px] active:shadow-none'
                                        }`}
                                >
                                    {isTranslating ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Translating to {selectedLanguage}...</>
                                    ) : translatedText ? (
                                        <><Languages className="w-5 h-5" /> Translated to {selectedLanguage} <ChevronDown className="w-4 h-4" /></>
                                    ) : (
                                        <><Languages className="w-5 h-5" /> Translate <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </button>

                                {/* Language Dropdown */}
                                {showLanguageDropdown && (
                                    <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#FDF8F5] border-[3px] border-[#5A4231] rounded-2xl shadow-[6px_6px_0_0_#5A4231] z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="px-4 py-2.5 border-b-[2px] border-[#5A4231]/15 bg-[#F2E3D5]">
                                            <p className="font-black text-[#4A3424] text-sm">Select Language</p>
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => handleTranslate(lang)}
                                                    className="w-full text-left px-4 py-2.5 font-bold text-sm text-[#5A4231] hover:bg-[#F2E3D5] hover:text-[#D9734E] transition-colors border-b border-[#5A4231]/5 last:border-b-0"
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                ) : (
                    // ═══════════════════════════════════════
                    //  UPLOAD + LOADING STATES
                    // ═══════════════════════════════════════
                    <div className="bg-[#F2E3D5] border-[3px] border-[#5A4231] rounded-[2.5rem] w-full p-8 md:p-16 shadow-[12px_12px_0_0_#5A4231] hover:shadow-[16px_16px_0_0_#5A4231] flex flex-col items-center flex-1 min-h-[550px] justify-center relative overflow-hidden transition-all duration-500 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM1QTQyMzEiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]">

                        {!isUploading ? (
                            // UPLOAD STATE
                            <div className="w-full max-w-2xl flex flex-col items-center transition-opacity duration-500 opacity-100 relative z-10 bg-[#F2E3D5]/90 p-6 rounded-3xl backdrop-blur-sm">

                                <h1 className="text-4xl md:text-5xl font-black text-[#4A3424] mb-4 text-center tracking-tight flex items-center gap-4">
                                    <FileSearch className="w-10 h-10 text-[#D9734E]" strokeWidth={2.5} /> Identify Lease Risks
                                </h1>
                                <p className="text-[#8A6B53] font-bold text-lg mb-10 text-center max-w-lg">
                                    Upload your rental agreement, and our AI will translate the legal jargon into a simple 2-minute summary.
                                </p>

                                <label
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`w-full aspect-[21/9] border-[4px] border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${isDragging ? 'bg-[#FDF8F5] border-[#D9734E] scale-[1.02]' : 'bg-[#FDF8F5] border-[#8A6B53]/40 hover:bg-white hover:border-[#D9734E]/70'}`}
                                >
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />

                                    {file ? (
                                        <div className="flex flex-col items-center text-center p-6 transform transition-transform group-hover:scale-105">
                                            <div className="relative">
                                                <FileText className="w-20 h-20 text-[#D9734E] mb-4" strokeWidth={1.5} />
                                                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 border-[3px] border-white animate-bounce">
                                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
                                                </div>
                                            </div>
                                            <p className="font-black text-[#4A3424] text-xl truncate max-w-[300px] bg-white px-4 py-1 rounded-lg border-[2px] border-[#5A4231]/10 mt-2">{file.name}</p>
                                            <p className="text-[#8A6B53] font-bold text-sm mt-3 bg-[#F2E3D5] px-3 py-1 rounded-full border border-[#5A4231]/20">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF/Word</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-center p-8">
                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 shadow-inner ${isDragging ? 'bg-[#D9734E]/20 scale-110 animate-pulse' : 'bg-[#F2E3D5] group-hover:-translate-y-2'}`}>
                                                <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-[#D9734E]' : 'text-[#5A4231]'}`} strokeWidth={2} />
                                            </div>
                                            <p className="font-black text-[#4A3424] text-2xl mb-2">
                                                {isDragging ? 'Drop it like it\'s hot!' : 'Click or Drag to Upload'}
                                            </p>
                                            <p className="text-[#8A6B53]/70 font-bold text-sm mt-2 max-w-xs">Strictly confidential. Files are securely analyzed and deleted automatically.</p>
                                        </div>
                                    )}
                                </label>

                                <button
                                    onClick={handleStartAnalysis}
                                    disabled={!file}
                                    className={`mt-10 w-full py-5 px-6 rounded-2xl font-black text-xl tracking-wide transition-all border-[3px] border-[#5A4231] ${file ? 'bg-[#F2E3D5] text-[#5A4231] shadow-[6px_6px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#5A4231] hover:bg-white active:translate-y-[6px] active:translate-x-[6px] active:shadow-none' : 'bg-[#E5D5C5] text-[#8A6B53]/50 border-[#8A6B53]/30 cursor-not-allowed opacity-60 shadow-none'}`}
                                >
                                    Analyze My Lease
                                </button>
                            </div>
                        ) : (
                            // LOADING STATE
                            <div className="w-full max-w-xl flex flex-col items-center transition-opacity duration-500 opacity-100 relative z-10 bg-[#F2E3D5]/90 p-8 rounded-3xl backdrop-blur-sm">
                                <div className="relative mb-12">
                                    <div className="absolute inset-0 bg-[#D9734E] blur-2xl opacity-20 rounded-full animate-pulse"></div>
                                    <h2 className="text-3xl md:text-5xl font-black text-[#4A3424] text-center w-full tracking-tight relative z-10">
                                        {progressStep >= 3 ? "Analysis Complete!" : "Leasify AI is working..."}
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-10 w-full px-4 md:px-10 relative">
                                    {/* Vertical Progress Line */}
                                    <div className="absolute left-[3.25rem] md:left-[4.75rem] top-8 bottom-8 w-[3px] bg-[#8A6B53]/20 rounded-full -z-10"></div>

                                    {steps.map((step, index) => {
                                        const isActive = progressStep === index;
                                        const isDone = progressStep > index;

                                        return (
                                            <div key={index} className={`flex items-center gap-6 md:gap-8 transition-all duration-700 transform ${progressStep >= index ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] flex items-center justify-center shrink-0 transition-all duration-500 ${isDone ? 'bg-[#D9734E] border-[#5A4231] text-white shadow-[4px_4px_0_0_#5A4231] scale-110' : isActive ? 'bg-white border-[#D9734E] text-[#D9734E] scale-100 shadow-[0_0_15px_rgba(217,115,78,0.3)]' : 'bg-[#FDF8F5] border-[#8A6B53]/30 text-[#8A6B53]/30 scale-90'}`}>
                                                    {isDone ? (
                                                        <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 animate-in zoom-in duration-300" strokeWidth={3} />
                                                    ) : isActive ? (
                                                        <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" strokeWidth={2.5} />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full bg-current" />
                                                    )}
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className={`font-black tracking-wide text-lg md:text-2xl transition-all duration-500 ${isDone ? 'text-[#4A3424]' : isActive ? 'text-[#D9734E]' : 'text-[#8A6B53]'}`}>
                                                        {step}
                                                    </p>
                                                    {isActive && <p className="text-[#8A6B53] font-bold text-sm mt-1 animate-pulse">This might take a few seconds...</p>}
                                                    {isDone && <p className="text-green-600 font-bold text-sm mt-1">Successfully completed</p>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Show continue button only when all steps are done */}
                                <div className={`w-full flex justify-center mt-16 transition-all duration-700 transform ${progressStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                                    <button
                                        onClick={handleViewReport}
                                        className="w-full max-w-sm bg-[#D9734E] text-[#FDF8F5] border-[3px] border-[#5A4231] font-black tracking-wide py-5 px-10 rounded-2xl shadow-[6px_6px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#5A4231] hover:bg-[#C26341] transition-all active:translate-y-[6px] active:translate-x-[6px] active:shadow-none text-xl flex items-center justify-center gap-3"
                                    >
                                        <FileText strokeWidth={2.5} /> View Full Report
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />

            {/* Custom scrollbar styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #8A6B5340;
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #8A6B5380;
                    background-clip: content-box;
                }
            `}</style>
        </div>
    )
}
