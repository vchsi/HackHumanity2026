import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import AuthScene from '../components/AuthScene';
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (authMode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                navigate('/'); // Redirect to home if success
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password
                });
                if (error) throw error;
                setErrorMsg('Check your email for the confirmation link.');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'An error occurred during authentication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5] flex flex-col relative selection:bg-[#D9734E] selection:text-white">
            {/* Top Banner Navigation */}
            <div className="absolute top-0 w-full p-6 z-50 flex items-center justify-between pointer-events-none">
                <Link to="/" className="pointer-events-auto font-bold text-[#8A6B53] hover:text-[#D9734E] flex items-center gap-2 transition-colors bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border-[3px] border-[#5A4231] shadow-[2px_2px_0_0_#5A4231] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none hover:bg-white">
                    <ArrowLeft className="w-5 h-5" /> Back
                </Link>
            </div>

            <div className="flex-1 flex flex-col md:flex-row w-full mt-20 md:mt-0">

                {/* Left: Gentle Subtle 3D Micro-Illustration */}
                <div className="w-full md:w-[45%] lg:w-1/2 flex items-center justify-center bg-[#F2E3D5] border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#5A4231] relative overflow-hidden min-h-[350px] shadow-inner">
                    <AuthScene />
                </div>

                {/* Right: Modern SaaS Form */}
                <div className="w-full md:w-[55%] lg:w-1/2 p-8 md:p-12 lg:p-24 flex flex-col justify-center bg-[#FDF8F5]">
                    <div className="w-full max-w-md mx-auto">

                        <div className="w-16 h-16 bg-[#D9734E] rounded-2xl border-[3px] border-[#5A4231] flex items-center justify-center mb-8 shadow-[4px_4px_0_0_#5A4231] rotate-[-2deg]">
                            <Lock className="text-white w-8 h-8" strokeWidth={2.5} />
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black text-[#4A3424] mb-3 tracking-tight">
                            {authMode === 'login' ? 'Welcome back' : 'Create Account'}
                        </h1>
                        <p className="text-[#8A6B53] font-bold mb-10 text-lg">
                            {authMode === 'login' ? 'Log in to securely manage and analyze your rental agreements.' : 'Sign up to get instant plain-language summaries.'}
                        </p>

                        {errorMsg && (
                            <div className={`mb-6 p-4 rounded-xl border-[3px] flex items-start gap-3 \${errorMsg.includes('Check') ? 'bg-green-100 border-green-700 text-green-800' : 'bg-red-50 border-red-500 text-red-700'}`}>
                                <AlertCircle className="shrink-0 mt-0.5" size={20} strokeWidth={2.5} />
                                <span className="font-bold text-sm leading-snug">{errorMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-3">
                                <label className="font-bold text-[#5A4231] text-sm tracking-widest uppercase">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="name@example.com"
                                    className="w-full bg-white border-[3px] border-[#5A4231] rounded-2xl px-5 py-4 font-bold text-[#4A3424] placeholder:text-[#8A6B53]/40 focus:outline-none focus:ring-4 focus:ring-[#D9734E]/30 transition-all shadow-[2px_2px_0_0_#5A4231]"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <label className="font-bold text-[#5A4231] text-sm tracking-widest uppercase">Password</label>
                                    {authMode === 'login' && <a href="#" className="text-sm font-bold text-[#D9734E] hover:underline hover:underline-offset-4 decoration-[2px] mb-1">Forgot password?</a>}
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white border-[3px] border-[#5A4231] rounded-2xl px-5 py-4 font-bold text-[#4A3424] placeholder:text-[#8A6B53]/40 focus:outline-none focus:ring-4 focus:ring-[#D9734E]/30 transition-all shadow-[2px_2px_0_0_#5A4231]"
                                />
                            </div>

                            <div className="pt-4">
                                <button disabled={loading} type="submit" className="w-full bg-[#D9734E] text-[#FDF8F5] border-[3px] border-[#5A4231] font-black tracking-wide py-4 px-6 rounded-2xl shadow-[6px_6px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_#5A4231] hover:bg-[#C26341] transition-all active:translate-y-[6px] active:translate-x-[6px] active:shadow-none focus:outline-none disabled:opacity-50 text-xl flex justify-center items-center">
                                    {loading ? 'Processing...' : (authMode === 'login' ? 'Log in to Leasify' : 'Sign up for Leasify')}
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-[#8A6B53] font-bold">
                                    {authMode === 'login' ? 'New to Leasify? ' : 'Already have an account? '}
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setErrorMsg('') }}
                                        className="text-[#D9734E] hover:underline hover:underline-offset-4 decoration-[2px]"
                                    >
                                        {authMode === 'login' ? 'Create a free account' : 'Log in here'}
                                    </button>
                                </p>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}
