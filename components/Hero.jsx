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
                <div className='relative flex-1 flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl xl:min-h-100 group border border-cyan-500/30 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 glow-effect'>
                    <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-blue-500/0 pointer-events-none'></div>
                    <div className='p-5 sm:p-16 relative z-10'>
                        <div className='inline-flex items-center gap-3 bg-slate-800 border border-cyan-500/50 text-cyan-300 pr-4 p-1 rounded-full text-xs sm:text-sm hover:border-cyan-400 transition-colors'>
                            <span className='bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs font-bold'>NEWS</span> Free Shipping on Orders Above $50! <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent max-w-xs sm:max-w-md neon-text'>
                            Gadgets you'll love. Prices you'll trust.
                        </h2>
                        <div className='text-cyan-300 text-sm font-medium mt-4 sm:mt-8'>
                            <p className='text-slate-400'>Starts from</p>
                            <p className='text-3xl font-bold text-cyan-400'>{currency}4.90</p>
                        </div>
                        <button className='tech-button text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md font-bold hover:scale-105 active:scale-95 transition-all'>LEARN MORE</button>
                    </div>
                    <Image className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm opacity-90 hover:opacity-100 transition-opacity' src={assets.hero_model_img} alt="" />
                </div>
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm'>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 px-8 group border border-cyan-500/30 hover:border-cyan-400/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20'>
                        <div>
                            <p className='text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent max-w-40 neon-text'>Best products</p>
                            <p className='flex items-center gap-1 mt-4 text-cyan-300 hover:text-cyan-200 transition-colors'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
                        </div>
                        <Image className='w-35 opacity-90 hover:opacity-100 transition-opacity' src={assets.hero_product_img1} alt="" />
                    </div>
                    <div className='flex-1 flex items-center justify-between w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 px-8 group border border-blue-500/30 hover:border-blue-400/60 transition-all hover:shadow-lg hover:shadow-blue-500/20'>
                        <div>
                            <p className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent max-w-40 neon-text'>20% discounts</p>
                            <p className='flex items-center gap-1 mt-4 text-blue-300 hover:text-blue-200 transition-colors'>View more <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /> </p>
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