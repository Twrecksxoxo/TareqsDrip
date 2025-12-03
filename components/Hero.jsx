'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>
                <div className='relative flex-1 flex flex-col bg-black/40 rounded-2xl xl:min-h-100 group border border-amber-500/30 overflow-visible shadow-2xl hover:shadow-amber-500/30 transition-all duration-500 glow-effect backdrop-blur-md'>
                    <div className='absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/5 to-pink-600/0 pointer-events-none rounded-2xl'></div>
                    <div className='p-5 sm:p-16 relative z-10 flex-1'>
                        <div className='inline-flex items-center gap-3 bg-black/60 border border-amber-500/50 text-amber-300 pr-4 p-1 rounded-full text-xs sm:text-sm hover:border-amber-400 transition-colors backdrop-blur-sm'>
                            <span className='bg-gradient-to-r from-amber-500 to-pink-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs font-bold tracking-wider'>LUXURY</span> Spring Collection Now Available <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-bold bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500 bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                            Elegance Redefined.
                        </h2>
                        <div className='text-amber-300 text-sm font-medium mt-4 sm:mt-8'>
                            <p className='text-slate-400'>Starting from</p>
                            <p className='text-3xl font-bold text-amber-400'>{currency}49.99</p>
                        </div>
                        <button className='tech-button text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-lg font-bold active:scale-95 transition-all'>LEARN MORE</button>
                    </div>
                    <div className='hidden sm:flex absolute -bottom-20 -right-20 md:right-0 lg:right-10 h-full w-auto rounded-2xl overflow-visible items-end justify-end'>
                        <Image 
                            className='w-auto object-contain object-center hover:scale-105 transition-transform duration-300' 
                            src={assets.hero_model_img} 
                            alt="Spring Collection"
                            priority
                        />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm'>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 px-8 group border border-pink-500/30 hover:border-pink-400/60 transition-all hover:shadow-lg hover:shadow-pink-500/20'>
                        <div>
                            <p className='text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent max-w-40'>Trending Now</p>
                            <p className='flex items-center gap-1 mt-4 text-pink-300 hover:text-pink-200 transition-colors'>Explore <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35 opacity-90 hover:opacity-100 transition-opacity' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 px-8 group border border-purple-500/30 hover:border-purple-400/60 transition-all hover:shadow-lg hover:shadow-purple-500/20'>
                        <div>
                            <p className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent max-w-40'>Latest Drops</p>
                            <p className='flex items-center gap-1 mt-4 text-purple-300 hover:text-purple-200 transition-colors'>Discover <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35 opacity-90 hover:opacity-100 transition-opacity' src={assets.hero_product_img2} alt="" />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>

    )
}

export default Hero