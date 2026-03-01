import LeaseScene from './LeaseScene'
import { Link } from 'react-router-dom'
export default function Hero() {
    return (
        <main className="flex flex-col md:flex-row items-center justify-center gap-10 lg:gap-20 p-6 md:p-12 lg:px-24 py-16 w-full max-w-7xl mx-auto min-h-[80vh]">

            {/* 3D Model Area */}
            <div className="w-full max-w-sm md:max-w-md lg:w-1/2 aspect-square border-[3px] border-[#5A4231] rounded-3xl flex flex-col items-center justify-center shadow-[8px_8px_0_0_#5A4231] relative group transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#5A4231] duration-300 mx-auto md:mx-0 shrink-0 overflow-hidden cursor-move">

                {/* Procedural Canvas Scene replacing the .GLB model */}
                <LeaseScene />

            </div>

            {/* Right Text Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mt-4 md:mt-0 z-10">
                <div className="inline-block px-4 py-2 bg-[#F2E3D5] border-[2px] border-[#5A4231] rounded-full font-bold text-sm tracking-wide mb-6 text-[#D9734E] shadow-[2px_2px_0_0_#5A4231]">
                    AI-Powered Lease Analyzer
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 md:mb-10 leading-[1.05] text-[#4A3424]">
                    <span style={{textDecoration: "underline", textDecorationColor: "#D9734E"}}>Don't</span> sign blindly.
                </h1>

                <p className="text-[#8A6B53] font-bold text-lg md:text-xl max-w-md mx-auto md:mx-0 pb-8 md:pb-12">
                    Leasify turns complex rental agreements into plain-language summaries. We highlight risky clauses and hidden fees so you can understand your lease before you commit.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 w-full md:w-auto">
                    <Link to="/analyze" className="w-full sm:w-auto px-8 py-4 bg-[#D9734E] text-[#FDF8F5] border-[3px] border-[#5A4231] font-bold text-xl rounded-2xl shadow-[4px_4px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#5A4231] hover:bg-[#C26341] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#D9734E]/30 text-center">
                        Analyze My Lease
                    </Link>
                    <Link to="/analyze" className="w-full sm:w-auto px-8 py-4 bg-[#FDF8F5] text-[#5A4231] border-[3px] border-[#5A4231] font-bold text-xl rounded-2xl shadow-[4px_4px_0_0_#5A4231] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#5A4231] hover:bg-[#F2E3D5] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none focus:outline-none focus:ring-4 focus:ring-[#5A4231]/10 text-center">
                        See Demo
                    </Link>
                </div>
            </div>
        </main>
    )
}
