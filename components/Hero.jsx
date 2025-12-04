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
                <div className='relative flex-1 flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-violet-100 rounded-3xl xl:min-h-100 group border border-blue-200 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-violet-300/30 transition-all duration-500 glow-effect'>
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-200/0 via-purple-200/10 to-blue-200/0 pointer-events-none'></div>
                    <div className='p-5 sm:p-16 relative z-10'>
                        <div className='inline-flex items-center gap-3 bg-white/70 border border-blue-200 text-violet-700 pr-4 p-1 rounded-full text-xs sm:text-sm hover:border-violet-400 transition-colors'>
                            <span className='bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs font-bold'>FUTURISTIC</span> Spring Collection Now Available <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-bold bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                            Elegance Redefined.
                        </h2>
                        <div className='text-violet-700 text-sm font-medium mt-4 sm:mt-8'>
                            <p className='text-slate-600'>Starting from</p>
                            <p className='text-3xl font-bold text-violet-600'>{currency}49.99</p>
                        </div>
                        <button className='tech-button text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md font-bold hover:scale-105 active:scale-95 transition-all'>LEARN MORE</button>
                    </div>
                    <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm opacity-90 hover:opacity-100 transition-opacity' src={assets.hero_model_img} alt="" />
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm'>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-6 px-8 group border border-blue-200 hover:border-violet-400 transition-all hover:shadow-lg hover:shadow-violet-300/20'>
                        <div>
                            <p className='text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent max-w-40'>Trending Now</p>
                            <p className='flex items-center gap-1 mt-4 text-violet-700 hover:text-violet-600 transition-colors'>Explore <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35 opacity-90 hover:opacity-100 transition-opacity' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-purple-100 to-cyan-100 rounded-3xl p-6 px-8 group border border-blue-200 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-300/20'>
                        <div>
                            <p className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent max-w-40'>Latest Drops</p>
                            <p className='flex items-center gap-1 mt-4 text-purple-700 hover:text-purple-600 transition-colors'>Discover <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
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