import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, ShieldCheck, AlertTriangle, Clock, ChevronRight, Search, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../components/AuthContext';

interface LeaseHistoryItem {
    id: number;
    pathname: string;
    created_at: string;
    owner_id: string;
    overview?: {
        risk_score: number;
        overview_contents: string;
        rent_monthly: number | null;
    };
}

export default function History() {
    const { isLoggedIn, session } = useAuth();
    const navigate = useNavigate();
    const [leases, setLeases] = useState<LeaseHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!session?.user?.email) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`http://localhost:8000/history?email=${encodeURIComponent(session.user.email)}`);
                if (!res.ok) throw new Error('Failed to fetch history');
                const data = await res.json();
                setLeases(data.leases || []);
            } catch (err) {
                console.error('Failed to fetch history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [session]);

    const filteredLeases = leases.filter(l =>
        l.pathname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRiskColor = (score: number) => {
        if (score <= 35) return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', label: 'Low Risk' };
        if (score <= 65) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', label: 'Medium Risk' };
        return { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300', label: 'High Risk' };
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5] text-[#5A4231] font-sans flex flex-col selection:bg-[#D9734E] selection:text-white overflow-x-hidden relative">
            <Header />

            {/* Background blobs */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-[#D9734E] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none animate-pulse" />
            <div className="fixed bottom-20 right-10 w-80 h-80 bg-[#8A6B53] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none delay-1000 animate-pulse" />

            <main className="flex-1 flex flex-col items-center p-6 md:p-12 w-full max-w-5xl mx-auto relative z-10">
                {/* Top bar */}
                <div className="w-full flex items-center justify-between mb-10">
                    <Link to="/" className="font-bold text-[#8A6B53] hover:text-[#D9734E] flex items-center gap-2 transition-colors bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm border-[2px] border-[#5A4231]/10 hover:border-[#D9734E]/30">
                        <ArrowLeft className="w-5 h-5" /> Home
                    </Link>
                </div>

                {/* Header */}
                <div className="w-full mb-10 text-center">
                    <div className="inline-flex items-center gap-3 bg-[#D9734E]/10 text-[#D9734E] px-5 py-2 rounded-full border-[2px] border-[#D9734E]/20 font-black text-xs uppercase tracking-[0.2em] mb-4">
                        <Clock size={14} strokeWidth={3} /> Your Scan History
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#4A3424] tracking-tight">
                        Past Analyses
                    </h1>
                    <p className="text-[#8A6B53] font-bold mt-3 text-lg max-w-lg mx-auto">
                        Review previous lease scans and their risk assessments.
                    </p>
                </div>

                {!isLoggedIn ? (
                    /* Not logged in state */
                    <div className="bg-[#F2E3D5] border-[3px] border-[#5A4231] rounded-3xl p-16 text-center shadow-[8px_8px_0_0_#5A4231] w-full max-w-lg">
                        <div className="w-20 h-20 bg-[#D9734E]/15 rounded-2xl flex items-center justify-center mx-auto mb-6 border-[3px] border-[#D9734E]/20">
                            <AlertTriangle className="w-10 h-10 text-[#D9734E]" strokeWidth={2} />
                        </div>
                        <h2 className="text-2xl font-black text-[#4A3424] mb-3">Sign in Required</h2>
                        <p className="text-[#8A6B53] font-bold mb-8">Log in to view your analysis history.</p>
                        <Link to="/auth" className="inline-block bg-[#D9734E] text-white px-8 py-4 rounded-2xl font-black border-[3px] border-[#5A4231] shadow-[4px_4px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#5A4231] transition-all active:shadow-none">
                            Sign In
                        </Link>
                    </div>
                ) : loading ? (
                    /* Loading state */
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 text-[#D9734E] animate-spin" strokeWidth={2.5} />
                        <p className="font-black text-[#8A6B53] text-lg animate-pulse">Loading your history...</p>
                    </div>
                ) : leases.length === 0 ? (
                    /* Empty state */
                    <div className="bg-[#F2E3D5] border-[3px] border-[#5A4231] rounded-3xl p-16 text-center shadow-[8px_8px_0_0_#5A4231] w-full max-w-lg">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border-[3px] border-[#5A4231]/20">
                            <FileText className="w-10 h-10 text-[#8A6B53]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-black text-[#4A3424] mb-3">No Scans Yet</h2>
                        <p className="text-[#8A6B53] font-bold mb-8">Upload your first lease to get started.</p>
                        <Link to="/analyze" className="inline-block bg-[#D9734E] text-white px-8 py-4 rounded-2xl font-black border-[3px] border-[#5A4231] shadow-[4px_4px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#5A4231] transition-all active:shadow-none">
                            Start Scanning
                        </Link>
                    </div>
                ) : (
                    /* Lease list */
                    <div className="w-full space-y-4">
                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A6B53]/50" strokeWidth={2.5} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by filename..."
                                className="w-full bg-white border-[3px] border-[#5A4231]/20 rounded-2xl pl-12 pr-5 py-4 font-bold text-[#4A3424] placeholder:text-[#8A6B53]/30 focus:outline-none focus:ring-4 focus:ring-[#D9734E]/20 focus:border-[#D9734E]/40 transition-all"
                            />
                        </div>

                        {filteredLeases.length === 0 ? (
                            <p className="text-center text-[#8A6B53] font-bold py-8">No matches found.</p>
                        ) : (
                            filteredLeases.map((lease) => {
                                const risk = lease.overview ? getRiskColor(lease.overview.risk_score) : null;
                                return (
                                    <div
                                        key={lease.id}
                                        onClick={() => navigate(`/analyze?lease_id=${lease.id}`)}
                                        className="group bg-white border-[3px] border-[#5A4231]/15 rounded-2xl p-6 hover:border-[#D9734E]/40 hover:shadow-[6px_6px_0_0_#D9734E15] transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-5">
                                            {/* Icon */}
                                            <div className="w-14 h-14 bg-[#F2E3D5] rounded-xl flex items-center justify-center border-[2px] border-[#5A4231]/10 shrink-0 group-hover:bg-[#D9734E]/10 transition-colors">
                                                <FileText className="w-7 h-7 text-[#8A6B53] group-hover:text-[#D9734E] transition-colors" strokeWidth={1.8} />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-black text-[#4A3424] text-lg truncate group-hover:text-[#D9734E] transition-colors">
                                                    {lease.pathname}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-1.5">
                                                    <span className="text-[#8A6B53]/60 font-bold text-sm flex items-center gap-1.5">
                                                        <Clock size={13} /> {formatDate(lease.created_at)}
                                                    </span>
                                                    <span className="text-[#8A6B53]/40 font-bold text-xs">ID #{lease.id}</span>
                                                </div>
                                                {lease.overview && (
                                                    <p className="text-[#8A6B53]/70 text-sm font-semibold mt-2 line-clamp-2">{lease.overview.overview_contents}</p>
                                                )}
                                            </div>

                                            {/* Right side - Risk + Arrow */}
                                            <div className="flex items-center gap-4 shrink-0">
                                                {risk && lease.overview ? (
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <div className={`${risk.bg} ${risk.text} ${risk.border} border-[2px] px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2`}>
                                                            <ShieldCheck size={14} strokeWidth={3} /> {lease.overview.risk_score}/100
                                                        </div>
                                                        <span className={`${risk.text} font-bold text-xs`}>{risk.label}</span>
                                                        {lease.overview.rent_monthly && (
                                                            <span className="text-[#8A6B53]/50 font-bold text-xs">${lease.overview.rent_monthly}/mo</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#F2E3D5] text-[#8A6B53] border-[2px] border-[#5A4231]/10 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider">
                                                        Pending
                                                    </div>
                                                )}
                                                <ChevronRight className="w-5 h-5 text-[#8A6B53]/30 group-hover:text-[#D9734E] transition-colors" strokeWidth={2.5} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
