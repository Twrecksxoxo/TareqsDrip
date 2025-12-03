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
        <nav className="relative bg-slate-950 border-b border-cyan-500/30 backdrop-blur-md sticky top-0 z-50">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative text-4xl font-black brand-hover">
                        <span className="brand-name">Dhakaiya Drip</span><span className="text-pink-500 animate-pulse">.</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-300">
                        <Link href="/" className="hover:text-pink-400 transition-colors font-medium">Collection</Link>
                        <Link href="/shop" className="hover:text-pink-400 transition-colors font-medium">Shop</Link>
                        <Link href="/" className="hover:text-pink-400 transition-colors font-medium">Lookbook</Link>
                        <Link href="/" className="hover:text-pink-400 transition-colors font-medium">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 tech-input bg-slate-800/50 px-4 py-2 rounded-full border border-cyan-500/30">
                            <Search size={18} className="text-cyan-400" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-500 text-slate-100" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-cyan-500 size-3.5 rounded-full glow-effect">{cartCount}</button>
                        </Link>

                    {
                        !user ? (
                            <SignInButton mode="modal">
                                <button className="tech-button">
                                    Login
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
                    <div className="sm:hidden">
                        { user ? (
                            <div>
                            <UserButton>
                               <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<ShoppingCart size={16} />} label="Cart" onClick={() => router.push('/cart')} />
                                </UserButton.MenuItems>
                            </UserButton>
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<PackageIcon size={16} />} label="My Orders" onClick={() => router.push('/orders')} />
                                </UserButton.MenuItems>
                            </UserButton>
                            </div>
                        ):(
                            <SignInButton mode="modal">
                                <button className="tech-button text-sm px-5 py-2">
                                    Login
                                </button>
                            </SignInButton>
                        )
                        }
                           
                    </div>
                </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </nav>
    )
}

export default Navbar