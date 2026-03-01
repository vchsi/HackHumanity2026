import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, ArrowLeft, FileSearch, ShieldCheck, AlertCircle, Cloud, Brain, Sparkles, ScanLine, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import DocumentViewer from '../components/DocumentViewer';
import SidePanel from '../components/SidePanel';
import { segmentDocument } from '../utils/documentProcessor';
import { useAuth } from '../components/AuthContext';
import type { Highlight, DocumentSegment, AnalysisResult } from '../types';

// Smooth fake progress that simulates real SaaS processing
function useFakeProgress(isActive: boolean, isDone: boolean) {
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        if (!isActive) {
            setProgress(0);
            return;
        }
        if (isDone) {
            setProgress(100);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        let current = 0;
        intervalRef.current = setInterval(() => {
            // Fast at start, slows down as it approaches ~85%
            if (current < 20) current += Math.random() * 3 + 1.5;
            else if (current < 50) current += Math.random() * 2 + 0.8;
            else if (current < 75) current += Math.random() * 1.2 + 0.3;
            else if (current < 85) current += Math.random() * 0.4 + 0.05;
            else current += Math.random() * 0.1;

            current = Math.min(current, 88); // Never exceed 88% until done
            setProgress(current);
        }, 300);

        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isActive, isDone]);

    return progress;
}

export default function Analyze() {
    const { session } = useAuth();

    // Tracking/Flow States
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [apiDone, setApiDone] = useState(false);

    // Detailed Result States
    const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
    const [segments, setSegments] = useState<DocumentSegment[]>([]);
    const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [finalTime, setFinalTime] = useState<number>(0);

    const fakeProgress = useFakeProgress(isUploading, apiDone);

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (isUploading && !apiDone) {
            interval = setInterval(() => {
                if (startTime) {
                    setCurrentTime((Date.now() - startTime) / 1000);
                }
            }, 100);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isUploading, apiDone, startTime]);

    // Auto-advance fake steps based on progress
    useEffect(() => {
        if (fakeProgress >= 15 && progressStep < 1) setProgressStep(1);
        if (fakeProgress >= 40 && progressStep < 2) setProgressStep(2);
        if (fakeProgress >= 65 && progressStep < 3) setProgressStep(3);
        if (fakeProgress >= 80 && progressStep < 4) setProgressStep(4);
        if (fakeProgress >= 100 && progressStep < 5) setProgressStep(5);
    }, [fakeProgress, progressStep]);

    const selectedHighlight = analysisData?.highlights.find(h => h.id === selectedHighlightId) || null;

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setError(null);
        }
    };

    const handleStartAnalysis = async () => {
        if (!file) return;
        setIsUploading(true);
        setApiDone(false);
        const now = Date.now();
        setStartTime(now);
        setCurrentTime(0);
        setProgressStep(0);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            if (session?.user?.email) {
                formData.append('owner_email', session.user.email);
            }

            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Analysis failed on server.");
            }

            const data = await response.json();

            const rawFullText = data.full_text || "";
            const rawResults = data.results || [];

            const highlights: Highlight[] = rawResults.map((h: any, idx: number) => {
                const quote = h.annotationText || "";
                const startIndex = rawFullText.indexOf(quote);
                const endIndex = startIndex !== -1 ? startIndex + quote.length : -1;

                let level: 'red' | 'green' | 'yellow' = 'yellow';
                if (h.annotationLevel === 'good') level = 'green';
                else if (h.annotationLevel === 'bad') level = 'red';
                else if (h.annotationLevel === 'mix') level = 'yellow';

                return {
                    id: `h-${idx}`,
                    level,
                    severity: h.severity || 'UNKNOWN',
                    category: h.risk_title || "General",
                    title: h.risk_title || "Analysis Item",
                    explanation: h.annotationDesc || "No explanation provided.",
                    quote: quote,
                    pageNumber: 1,
                    startIndex,
                    endIndex,
                    evidence_location_hint: h.evidence_location_hint,
                    suggestedQuestions: [
                        `Can you explain this ${h.severity || 'identified'} clause?`,
                        `How do I negotiate this term?`
                    ]
                };
            }).filter((h: Highlight) => h.startIndex !== -1);

            const analysis: AnalysisResult = {
                title: data.title || file.name,
                text_incomplete: !!data.text_incomplete,
                address: data.basic_info?.address || { value: null, evidence_quote: null, missing_reason: "No address detected" },
                risk_score: data.overview?.risk_score || 0,
                overview_text: data.overview?.overview_contents || "No summary available.",
                rent_monthly: data.overview?.rent_monthly || { value: null, evidence_quote: null, missing_reason: "Rent not specified" },
                security_deposit: data.overview?.security_deposit || { value: null, evidence_quote: null, missing_reason: "Deposit not specified" },
                lease_term_days: data.overview?.lease_term_days || { value: null, evidence_quote: null, missing_reason: "Term not specified" },
                notice_period: data.overview?.notice_period || { value: null, evidence_quote: null, missing_reason: "Notice requirement not found" },
                late_fees: data.overview?.late_fees || { value: null, evidence_quote: null, missing_reason: "Late fee terms not found" },
                early_termination: data.overview?.early_termination || { value: null, evidence_quote: null, missing_reason: "Termination terms not found" },
                utilities: data.overview?.utilities || { value: null, evidence_quote: null, missing_reason: "Responsibility terms not found" },
                highlights: highlights
            };

            const docSegments = segmentDocument(rawFullText, highlights);

            // Signal done — fake progress will jump to 100%
            setApiDone(true);
            const completeTime = (Date.now() - now) / 1000;
            setFinalTime(completeTime);

            // Small delay for the 100% animation to play
            setTimeout(() => {
                setProgressStep(6); // final "complete" state
                setAnalysisData(analysis);
                setSegments(docSegments);
            }, 1200);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to analyze document.");
            setIsUploading(false);
            setApiDone(false);
        }
    };

    const handleViewReport = () => {
        setShowResult(true);
    };

    const handleNewAnalysis = () => {
        setFile(null);
        setIsUploading(false);
        setApiDone(false);
        setProgressStep(0);
        setShowResult(false);
        setAnalysisData(null);
        setSegments([]);
        setSelectedHighlightId(null);
        setActiveTab('overview');
        setError(null);
        setStartTime(null);
        setCurrentTime(0);
        setFinalTime(0);
    };

    const handleSelectHighlight = (id: string) => {
        setSelectedHighlightId(id);
        setActiveTab('details');
    };

    const steps = [
        { label: "Uploading to Leasify Cloud", icon: Cloud, sub: "Encrypting & transmitting your document" },
        { label: "Extracting document text", icon: ScanLine, sub: "Parsing pages & recognizing content" },
        { label: "Running AI risk analysis", icon: Brain, sub: "Gemini is scanning for risks & patterns" },
        { label: "Mapping legal annotations", icon: Sparkles, sub: "Flagging important clauses & obligations" },
        { label: "Generating your report", icon: FileCheck, sub: "Building human-friendly summary" },
    ];

    return (
        <div className="min-h-screen bg-[#FDF8F5] text-[#5A4231] font-sans flex flex-col selection:bg-[#D9734E] selection:text-white overflow-x-hidden relative">
            <Header />

            {/* Background elements */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-[#D9734E] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#8A6B53] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none delay-1000 animate-pulse"></div>

            <main className="flex-1 flex flex-col items-center p-6 md:p-12 w-full max-w-[1400px] mx-auto relative z-10">
                <div className="w-full flex items-center justify-between mb-8 max-w-5xl mx-auto">
                    {showResult ? (
                        <button onClick={handleNewAnalysis} className="font-bold text-[#8A6B53] hover:text-[#D9734E] flex items-center gap-2 transition-colors bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border-[2px] border-[#5A4231]/10 hover:border-[#D9734E]/30">
                            <ArrowLeft className="w-5 h-5" />
                            New Analysis
                        </button>
                    ) : (
                        <Link to="/" className="font-bold text-[#8A6B53] hover:text-[#D9734E] flex items-center gap-2 transition-colors bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border-[2px] border-[#5A4231]/10 hover:border-[#D9734E]/30">
                            <ArrowLeft className="w-5 h-5" />
                            Landing
                        </Link>
                    )}
                    {showResult && (
                        <div className="flex items-center gap-2 text-sm font-bold bg-[#D9734E]/10 text-[#D9734E] px-4 py-2 rounded-full border-[2px] border-[#D9734E]/30">
                            <ShieldCheck className="w-4 h-4" /> Cloud Verified
                        </div>
                    )}
                </div>

                {error && !showResult && (
                    <div className="w-full max-w-2xl mb-12 bg-rose-50 border-t-[6px] border-rose-400 rounded-3xl p-10 flex flex-col items-center text-center animate-in zoom-in duration-300 shadow-[10px_10px_0_0_#F43F5E15]">
                        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 border-[3px] border-rose-200">
                            <AlertCircle className="w-10 h-10 text-rose-500" />
                        </div>
                        <h3 className="font-black text-[#5A4231] text-3xl mb-4 tracking-tight">Backend Connection Issue</h3>
                        <p className="font-bold text-[#8A6B53] text-base max-w-sm mb-10 leading-relaxed">{error}</p>
                        <button onClick={handleNewAnalysis} className="bg-[#D9734E] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#C26341] transition-all shadow-[6px_6px_0_0_#5A4231] active:translate-y-1 active:shadow-none">Retry Upload</button>
                    </div>
                )}

                {showResult && analysisData ? (
                    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="xl:col-span-8 h-[800px] min-h-[600px]">
                            <DocumentViewer
                                segments={segments}
                                highlights={analysisData.highlights}
                                selectedHighlightId={selectedHighlightId}
                                onSelectHighlight={handleSelectHighlight}
                            />
                        </div>
                        <div className="xl:col-span-4 h-[800px] min-h-[600px]">
                            <SidePanel
                                analysis={analysisData}
                                selectedHighlight={selectedHighlight}
                                activeTab={activeTab}
                                onSelectTab={setActiveTab}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#F2E3D5] border-[3px] border-[#5A4231] rounded-[2.5rem] w-full max-w-5xl p-8 md:p-20 shadow-[12px_12px_0_0_#5A4231] hover:shadow-[16px_16px_0_0_#5A4231] flex flex-col items-center flex-1 min-h-[600px] justify-center relative overflow-hidden transition-all duration-500 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zz4PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM1QTQyMzEiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] mx-auto">
                        {!isUploading ? (
                            <div className="w-full max-w-3xl flex flex-col items-center transition-opacity duration-500 opacity-100 relative z-10 bg-[#F2E3D5]/90 p-8 rounded-3xl backdrop-blur-sm">
                                <h1 className="text-4xl md:text-5xl font-black text-[#4A3424] mb-4 text-center tracking-tight flex items-center gap-4">
                                    <FileSearch className="w-12 h-12 text-[#D9734E]" strokeWidth={2.5} /> Leasify Scan
                                </h1>
                                <p className="text-[#8A6B53] font-bold text-xl mb-12 text-center max-w-lg leading-relaxed">
                                    The entire process is now handled securely in our cloud. No code runs on your device.
                                </p>
                                <label
                                    onDragOver={handleDragOver}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={`w-full aspect-[21/9] border-[5px] border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${isDragging ? 'bg-[#FDF8F5] border-[#D9734E] scale-[1.02]' : 'bg-[#FDF8F5] border-[#8A6B53]/40 hover:bg-white hover:border-[#D9734E]/70'}`}
                                >
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
                                    {file ? (
                                        <div className="flex flex-col items-center text-center p-8 transform transition-transform group-hover:scale-105">
                                            <div className="relative">
                                                <FileText className="w-24 h-24 text-[#D9734E] mb-6" strokeWidth={1.2} />
                                                <div className="absolute -top-3 -right-3 bg-green-500 rounded-full p-2 border-[4px] border-white animate-bounce">
                                                    <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={3} />
                                                </div>
                                            </div>
                                            <p className="font-black text-[#4A3424] text-2xl truncate max-w-[400px] bg-white px-6 py-2 rounded-xl border-[3px] border-[#5A4231] mt-4">{file.name}</p>
                                            <p className="text-[#8A6B53] font-black text-sm mt-4 bg-[#F2E3D5] px-4 py-1.5 rounded-full border-[2px] border-[#5A4231]/30 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-center p-12">
                                            <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 transition-all duration-300 shadow-inner ${isDragging ? 'bg-[#D9734E]/20 scale-110 animate-pulse' : 'bg-[#F2E3D5] group-hover:-translate-y-2'}`}>
                                                <UploadCloud className={`w-14 h-14 ${isDragging ? 'text-[#D9734E]' : 'text-[#5A4231]'}`} strokeWidth={1.5} />
                                            </div>
                                            <p className="font-black text-[#4A3424] text-3xl mb-3">
                                                {isDragging ? 'Release to Scan' : 'Drop Documents Here'}
                                            </p>
                                            <p className="text-[#8A6B53]/70 font-bold text-base mt-2 max-w-xs leading-relaxed">Files are securely sent to our Gemini-powered engine.</p>
                                        </div>
                                    )}
                                </label>
                                <button
                                    onClick={handleStartAnalysis}
                                    disabled={!file}
                                    className={`mt-12 w-full max-w-md py-6 px-10 rounded-[1.5rem] font-black text-2xl tracking-wide transition-all border-[4px] border-[#5A4231] ${file ? 'bg-[#F2E3D5] text-[#5A4231] shadow-[8px_8px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[6px_6px_0_0_#5A4231] hover:bg-white active:translate-y-[8px] active:translate-x-[8px] active:shadow-none' : 'bg-[#E5D5C5] text-[#8A6B53]/50 border-[#8A6B53]/30 cursor-not-allowed opacity-60 shadow-none'}`}
                                >
                                    START CLOUD SCAN
                                </button>
                            </div>
                        ) : (
                            <div className="w-full max-w-2xl flex flex-col items-center transition-opacity duration-500 opacity-100 relative z-10 bg-white/80 p-10 md:p-14 rounded-[3rem] backdrop-blur-md border-[3px] border-[#5A4231]/10 shadow-2xl">
                                {/* Top status */}
                                <div className="w-full mb-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-2xl md:text-3xl font-black text-[#4A3424] tracking-tight">
                                            {progressStep >= 6 ? "Analysis Complete" : "Analyzing your lease..."}
                                        </h2>
                                        <span className="font-mono font-black text-[#D9734E] text-xl tabular-nums">
                                            {progressStep >= 6 ? `${finalTime.toFixed(1)}s` : `${currentTime.toFixed(1)}s`}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full h-3 bg-[#F2E3D5] rounded-full overflow-hidden border border-[#5A4231]/10">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${Math.round(fakeProgress)}%`,
                                                background: fakeProgress >= 100
                                                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                                    : 'linear-gradient(90deg, #D9734E, #E8956F)',
                                            }}
                                        />
                                    </div>
                                    <p className="text-right font-black text-[#8A6B53]/50 text-xs mt-1.5 tracking-wide">
                                        {Math.round(fakeProgress)}%
                                    </p>
                                </div>

                                {/* Steps */}
                                <div className="flex flex-col gap-4 w-full">
                                    {steps.map((step, index) => {
                                        const isActive = progressStep === index;
                                        const isDone = progressStep > index;
                                        const StepIcon = step.icon;
                                        return (
                                            <div
                                                key={index}
                                                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 ${
                                                    isDone ? 'bg-emerald-50/80 border border-emerald-200/50' :
                                                    isActive ? 'bg-[#D9734E]/5 border border-[#D9734E]/20 shadow-sm' :
                                                    'opacity-40'
                                                }`}
                                            >
                                                {/* Step indicator */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                                                    isDone ? 'bg-emerald-500 text-white' :
                                                    isActive ? 'bg-[#D9734E] text-white shadow-lg shadow-[#D9734E]/25' :
                                                    'bg-[#F2E3D5] text-[#8A6B53]/40'
                                                }`}>
                                                    {isDone ? (
                                                        <CheckCircle2 className="w-5 h-5" strokeWidth={3} />
                                                    ) : isActive ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                                                    ) : (
                                                        <StepIcon className="w-5 h-5" strokeWidth={2} />
                                                    )}
                                                </div>

                                                {/* Step text */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-black text-sm tracking-tight transition-colors ${
                                                        isDone ? 'text-emerald-700' :
                                                        isActive ? 'text-[#D9734E]' :
                                                        'text-[#8A6B53]'
                                                    }`}>
                                                        {step.label}
                                                    </p>
                                                    {isActive && (
                                                        <p className="text-[#8A6B53]/50 text-xs font-bold mt-0.5 animate-pulse">
                                                            {step.sub}
                                                        </p>
                                                    )}
                                                    {isDone && (
                                                        <p className="text-emerald-600/60 text-xs font-bold mt-0.5">Done</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Warning */}
                                {progressStep < 6 && (
                                    <p className="text-[#8A6B53]/40 text-xs font-bold mt-6 text-center">
                                        Please don't close this tab. Larger documents take more time.
                                    </p>
                                )}

                                {/* View Report */}
                                {progressStep >= 6 && (
                                    <div className="mt-8 flex flex-col items-center w-full animate-in zoom-in slide-in-from-bottom-4 duration-700">
                                        <button
                                            onClick={handleViewReport}
                                            className="w-full max-w-sm bg-[#D9734E] text-[#FDF8F5] border-[3px] border-[#5A4231] font-black tracking-wide py-5 px-10 rounded-2xl shadow-[6px_6px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#5A4231] hover:bg-[#C26341] text-lg flex items-center justify-center gap-3 transition-all active:translate-y-[6px] active:translate-x-[6px] active:shadow-none"
                                        >
                                            <FileText strokeWidth={2.5} size={24} /> View My Report
                                        </button>
                                        <p className="mt-4 text-[#8A6B53]/50 font-bold text-sm">
                                            Your report is ready for review.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #8A6B5350; border-radius: 20px; border: 3px solid #FDF8F5; }
            `}</style>
        </div>
    );
}
