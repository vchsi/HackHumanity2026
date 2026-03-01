import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Metrics from '../components/Metrics'
import Footer from '../components/Footer'

export default function Home() {
    return (
        <div className="min-h-screen bg-[#FDF8F5] text-[#5A4231] font-sans flex flex-col selection:bg-[#D9734E] selection:text-white overflow-x-hidden">
            <Header />
            <Hero />
            <Features />
            <Metrics />
            <Footer />
        </div>
    )
}
