export default function Features() {
    const features = [
        { title: "Plain-English Summaries", desc: "Get a 10-15 bullet breakdown of your lease at a reading level anyone can understand." },
        { title: "Instant Risk Flags", desc: "We highlight red and yellow flags—like early termination penalties or unusual fees—with exact clause quotes." },
        { title: "Voice & Translation", desc: "Translate the summary into your native language and have it read aloud instantly for total clarity." }
    ];

    return (
        <section id="features" className="w-full bg-[#F2E3D5] border-y-[3px] border-[#5A4231] py-20 px-6 md:px-12 lg:px-24 xl:px-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#4A3424] mb-4 text-center">Why Leasify?</h2>
                <p className="text-[#8A6B53] font-bold text-lg md:text-xl text-center max-w-2xl mb-16">
                    We break down 20-page legal documents into a 2-minute specific risk overview, empowering you to sign with confidence.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-[#FDF8F5] border-[3px] border-[#5A4231] rounded-3xl p-8 shadow-[6px_6px_0_0_#5A4231] hover:-translate-y-2 hover:shadow-[10px_10px_0_0_#5A4231] transition-all flex flex-col items-start group">
                            <h3 className="text-2xl font-black text-[#4A3424] mb-3">{feature.title}</h3>
                            <p className="text-[#8A6B53] font-bold leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
