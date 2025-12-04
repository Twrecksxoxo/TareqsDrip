'use client'
import { Search, ShoppingCart, Package as PackageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import {useUser, UserButton, SignInButton} from "@clerk/nextjs";

const Navbar = () => {
     
    const {user} = useUser()
    const router = useRouter();

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    return (
        <nav className="relative bg-gradient-to-r from-white via-blue-50 to-purple-50 border-b border-blue-100 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-5 transition-all">

                    <Link href="/" className="relative text-3xl font-bold hover:scale-105 transition-transform duration-300">
                        <span className="bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent font-black tracking-tight">Dhakaiya Drip</span><span className="text-cyan-400 animate-pulse">✨</span>
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
                        <Link href="/" className="relative group">
                            <span>Lookbook</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link href="/" className="relative group">
                            <span>Contact</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                        </Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center text-sm gap-3 bg-white/80 px-5 py-2.5 rounded-full border border-blue-200 hover:border-violet-300 transition-all duration-300 shadow-sm hover:shadow-md">
                            <Search size={16} className="text-violet-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-400 text-slate-800 text-sm" type="text" placeholder="Search fashion pieces" value={search} onChange={(e) => setSearch(e.target.value)} required />
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