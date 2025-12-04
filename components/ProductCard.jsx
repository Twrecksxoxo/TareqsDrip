'use client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // calculate the average rating of the product
    const rating = Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length);

    return (
        <Link href={`/product/${product.id}`} className='group max-xl:mx-auto'>
            <div className='tech-card h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-300/30 transition-all duration-300'>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-125 transition duration-300 opacity-90 hover:opacity-100' src={product.images[0]} alt="" />
            </div>
            <div className='flex justify-between gap-3 text-sm pt-2 max-w-60'>
                <div>
                    <p className='text-violet-700 font-medium group-hover:text-violet-600 transition-colors'>{product.name}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5 transition-all' fill={rating >= index + 1 ? "#7c3aed" : "#ede9fe"} />
                        ))}
                    </div>
                </div>
                <p className='text-violet-600 font-bold'>{currency}{product.price}</p>
            </div>
        </Link>
    )
}

export default ProductCard