export default function Footer() {
    return (
        <footer className="w-full border-t-[3px] border-[#5A4231] bg-[#F2E3D5] px-4 md:px-8 py-8 shrink-0 flex flex-row justify-between items-center text-[#8A6B53] font-bold text-sm gap-4">
            <div className="flex items-center gap-3">
                <p>© 2026 Leasify. All rights reserved.</p>
            </div>
            <div className="text-center flex-1">
                <p><span className="text-[#D9734E] font-bold">leasify</span><span className="text-[#8A6B53] font-light italic">. lease with ease</span></p>
            </div>
            <div className="flex gap-6">
                <a href="#" className="hover:text-[#D9734E] transition-colors underline decoration-[2px] underline-offset-4 decoration-transparent hover:decoration-[#D9734E]">Privacy</a>
                <a href="#" className="hover:text-[#D9734E] transition-colors underline decoration-[2px] underline-offset-4 decoration-transparent hover:decoration-[#D9734E]">Terms</a>
                <a href="#" className="hover:text-[#D9734E] transition-colors underline decoration-[2px] underline-offset-4 decoration-transparent hover:decoration-[#D9734E]">Contact</a>
            </div>
        </footer>
    )
}
