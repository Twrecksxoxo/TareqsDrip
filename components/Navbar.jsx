'use client'
import { Search, ShoppingCart, Package as PackageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import {useUser, useClerk, UserButton, Protect, SignInButton} from "@clerk/nextjs";

const Navbar = () => {
     
    const {user} = useUser()
    const router = useRouter();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`)
            setSearch('')
        }
    }

    return (
        <nav className="relative bg-gradient-to-r from-white via-blue-50 to-purple-50 border-b border-blue-100 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-5 transition-all">

                    <Link href="/" className="relative text-3xl font-bold hover:scale-110 transition-all duration-500 group">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 bg-clip-text text-transparent font-semibold tracking-wider uppercase drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.15)]" style={{fontFamily: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif', letterSpacing: '0.12em'}}>Tareqs</span>
                        <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent font-light ml-2.5" style={{fontFamily: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif', letterSpacing: '0.08em'}}>Drip</span>
                        <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 group-hover:w-full transition-all duration-700 shadow-lg shadow-pink-300/50"></div>
                        <Protect plan="plus">
                            <span className="absolute -top-2 -right-12 flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full shadow-lg shadow-amber-300/50 animate-pulse border border-amber-300/50">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                </svg>
                                PLUS
                            </span>
                        </Protect>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-6 lg:gap-10 text-slate-700 font-medium">
                        <Link href="/" className="relative group">
                            <span>Collections</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/shop" className="relative group">
                            <span>Shop</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/lookbook" className="relative group">
                            <span>Lookbook</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/contact" className="relative group">
                            <span>Contact</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center text-sm gap-3 bg-white/80 px-5 py-2.5 rounded-full border border-blue-200 hover:border-violet-300 transition-all duration-300 shadow-sm hover:shadow-md">
                            <Search size={16} className="text-violet-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-400 text-slate-800 text-sm" type="text" placeholder="Search fashion pieces" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <button type="submit" className="text-violet-600 hover:text-violet-800 transition-colors">
                                <Search size={16} />
                            </button>
                        </form>

                        <Link href="/cart" className="relative group flex items-center gap-2 text-slate-700 hover:text-violet-600 transition-colors duration-300">
                            <div className="relative">
                                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                                <button className="absolute -top-2 -right-2 text-[10px] font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 size-5 rounded-full flex items-center justify-center glow-effect">{cartCount}</button>
                            </div>
                            <span className="text-sm font-medium">Cart</span>
                        </Link>

                    {
                        !user ? (
                            <SignInButton mode="modal">
                                <button className="tech-button text-sm px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                                    Sign In
                                </button>
                            </SignInButton>

                        ) : (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                </UserButton.MenuItems>
                            </UserButton>
                        )
                    }

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden flex items-center gap-3">
                        <Link href="/cart" className="relative">
                            <ShoppingCart size={20} className="text-slate-700 hover:text-rose-600 transition-colors" />
                            <button className="absolute -top-2 -right-2 text-[8px] font-bold text-white bg-pink-500 size-4 rounded-full flex items-center justify-center">{cartCount}</button>
                        </Link>
                        { user ? (
                            <UserButton>
                               <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                </UserButton.MenuItems>
                            </UserButton>
                        ):(
                            <SignInButton mode="modal">
                                <button className="tech-button text-sm px-4 py-2 rounded-lg font-semibold">
                                    Sign In
                                </button>
                            </SignInButton>
                        )
                        }
                           
                    </div>
                </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
        </nav>
    )
}

export default Navbar