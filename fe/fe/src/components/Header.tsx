import { Link } from 'react-router-dom'
import { User, LogOut, Clock, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthContext'
import appIcon from '../assets/appIcon.svg.png'

export default function Header() {
    const { isLoggedIn, logout } = useAuth()
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close dropdown when interacting outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex justify-between items-center border-b-[3px] border-[#5A4231] px-4 md:px-8 py-4 bg-[#FDF8F5] z-50 w-full sticky top-0 shadow-sm">
            <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                <img src={appIcon} alt="Leasify Logo" className="w-10 h-10 border-[3px] border-[#5A4231] rounded-xl object-contain bg-white" />
                <span className="text-2xl md:text-3xl font-black tracking-tight text-[#4A3424]">Leasify</span>
            </Link>

            <nav className="hidden md:flex gap-8 font-bold text-[#8A6B53]">
                <a href="#features" className="hover:text-[#D9734E] transition-colors">Features</a>
                <a href="#audience" className="hover:text-[#D9734E] transition-colors">Who it's for</a>
            </nav>

            <div className="relative" ref={menuRef}>
                {isLoggedIn ? (
                    <>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-12 h-12 border-[3px] border-[#5A4231] rounded-full bg-[#D9734E] text-white flex items-center justify-center shadow-[2px_2px_0_0_#5A4231] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none hover:bg-[#C26341] transition-colors"
                        >
                            <User size={22} strokeWidth={2.5} />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-3 w-56 bg-[#FDF8F5] border-[3px] border-[#5A4231] rounded-2xl shadow-[6px_6px_0_0_#5A4231] flex flex-col z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b-[3px] border-[#5A4231] bg-[#F2E3D5] pointer-events-none">
                                    <p className="font-bold text-[#4A3424] text-sm truncate">My Account</p>
                                </div>
                                <button className="flex items-center gap-3 px-4 py-3 hover:bg-[#F2E3D5] text-[#8A6B53] hover:text-[#D9734E] font-bold text-[15px] transition-colors border-b-[2px] border-[#5A4231]/10 text-left">
                                    <Clock size={18} strokeWidth={2.5} /> History
                                </button>
                                <button className="flex items-center gap-3 px-4 py-3 hover:bg-[#F2E3D5] text-[#8A6B53] hover:text-[#D9734E] font-bold text-[15px] transition-colors border-b-[2px] border-[#5A4231]/10 text-left">
                                    <Settings size={18} strokeWidth={2.5} /> Settings
                                </button>
                                <button
                                    onClick={() => { logout(); setShowMenu(false); }}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F2E3D5] text-[#D9734E] font-bold text-[15px] transition-colors text-left"
                                >
                                    <LogOut size={18} strokeWidth={2.5} /> Log Out
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <Link to="/auth" className="w-12 h-12 border-[3px] border-[#5A4231] rounded-full bg-[#F2E3D5] cursor-pointer hover:bg-[#D9734E] hover:text-white transition-colors flex items-center justify-center text-[#5A4231] shadow-[2px_2px_0_0_#5A4231] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                        <User size={22} strokeWidth={2.5} />
                    </Link>
                )}
            </div>
        </header>
    )
}
