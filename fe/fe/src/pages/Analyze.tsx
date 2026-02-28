import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, ArrowLeft, Sparkles, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Analyze() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

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

    const steps = [
        "Extracting text & metadata from document...",
        "AI detecting hidden risks & complex clauses...",
        "Generating plain-english lease summary..."
    ];

    return (
        <div className="min-h-screen bg-[#FDF8F5] text-[#5A4231] font-sans flex flex-col selection:bg-[#D9734E] selection:text-white overflow-x-hidden relative">
            <Header />

            {/* SaaS Background Elements for premium feel */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-[#D9734E] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none animate-pulse"></div>
            <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#8A6B53] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none delay-1000 animate-pulse"></div>

            <main className="flex-1 flex flex-col items-center p-6 md:p-12 w-full max-w-5xl mx-auto relative z-10">
                <div className="w-full flex items-center justify-between mb-8">
                    <Link to="/" className="font-bold text-[#8A6B53] hover:text-[#D9734E] flex items-center gap-2 transition-colors bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border-[2px] border-[#5A4231]/10 hover:border-[#D9734E]/30">
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </Link>
                    {!isUploading && file && (
                        <div className="flex items-center gap-2 text-sm font-bold bg-[#F2E3D5] text-[#5A4231] px-4 py-2 rounded-full border-[2px] border-[#5A4231] shadow-[2px_2px_0_0_#5A4231]">
                            <Sparkles className="w-4 h-4 text-[#D9734E]" /> Ready for AI Magic
                        </div>
                    )}
                </div>

                {/* Changed Box color to #F2E3D5 to match the theme perfectly */}
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
                                className={`w-full aspect-[21/9] border-[4px] border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden \${isDragging ? 'bg-[#FDF8F5] border-[#D9734E] scale-[1.02]' : 'bg-[#FDF8F5] border-[#8A6B53]/40 hover:bg-white hover:border-[#D9734E]/70'}`}
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
                                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 shadow-inner \${isDragging ? 'bg-[#D9734E]/20 scale-110 animate-pulse' : 'bg-[#F2E3D5] group-hover:-translate-y-2'}`}>
                                            <UploadCloud className={`w-12 h-12 \${isDragging ? 'text-[#D9734E]' : 'text-[#5A4231]'}`} strokeWidth={2} />
                                        </div>
                                        <p className="font-black text-[#4A3424] text-2xl mb-2">
                                            {isDragging ? 'Drop it like it\'s hot!' : 'Click or Drag to Upload'}
                                        </p>
                                        <p className="text-[#8A6B53]/70 font-bold text-sm mt-2 max-w-xs">Strictly confidential. Files are securely analyzed and deleted automatically.</p>
                                    </div>
                                )}
                            </label>

                            {/* Modified button to match box color background per user request, while staying professional */}
                            <button
                                onClick={handleStartAnalysis}
                                disabled={!file}
                                className={`mt-10 w-full py-5 px-6 rounded-2xl font-black text-xl tracking-wide transition-all border-[3px] border-[#5A4231] \${file ? 'bg-[#F2E3D5] text-[#5A4231] shadow-[6px_6px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#5A4231] hover:bg-white active:translate-y-[6px] active:translate-x-[6px] active:shadow-none' : 'bg-[#E5D5C5] text-[#8A6B53]/50 border-[#8A6B53]/30 cursor-not-allowed opacity-60 shadow-none'}`}
                            >
                                Analyze My Lease
                            </button>
                        </div>
                    ) : (
                        // LOADING STATE (Right Wireframe)
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
                                        <div key={index} className={`flex items-center gap-6 md:gap-8 transition-all duration-700 transform \${progressStep >= index ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                                            {/* Status Circle */}
                                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] flex items-center justify-center shrink-0 transition-all duration-500 \${isDone ? 'bg-[#D9734E] border-[#5A4231] text-white shadow-[4px_4px_0_0_#5A4231] scale-110' : isActive ? 'bg-white border-[#D9734E] text-[#D9734E] scale-100 shadow-[0_0_15px_rgba(217,115,78,0.3)]' : 'bg-[#FDF8F5] border-[#8A6B53]/30 text-[#8A6B53]/30 scale-90'}`}>
                                                {isDone ? (
                                                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 animate-in zoom-in duration-300" strokeWidth={3} />
                                                ) : isActive ? (
                                                    <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" strokeWidth={2.5} />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full bg-current" />
                                                )}
                                            </div>

                                            {/* Step Text */}
                                            <div className="flex flex-col">
                                                <p className={`font-black tracking-wide text-lg md:text-2xl transition-all duration-500 \${isDone ? 'text-[#4A3424]' : isActive ? 'text-[#D9734E]' : 'text-[#8A6B53]'}`}>
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
                            <div className={`w-full flex justify-center mt-16 transition-all duration-700 transform \${progressStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                                <button className="w-full max-w-sm bg-[#D9734E] text-[#FDF8F5] border-[3px] border-[#5A4231] font-black tracking-wide py-5 px-10 rounded-2xl shadow-[6px_6px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#5A4231] hover:bg-[#C26341] transition-all active:translate-y-[6px] active:translate-x-[6px] active:shadow-none text-xl flex items-center justify-center gap-3">
                                    <FileText strokeWidth={2.5} /> View Full Report
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
