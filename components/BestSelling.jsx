'use client'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 8
    const { list: products, loading } = useSelector(state => state.product)

    // Show skeleton placeholders while loading
    if (loading && products.length === 0) {
        return (
            <div className='px-6 my-30 max-w-6xl mx-auto'>
                <Title title='Best Selling' description='Loading products...' href='/shop' />
                <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                    {[...Array(displayQuantity)].map((_, index) => (
                        <div key={index} className='w-full sm:w-[calc(25%-24px)] animate-pulse'>
                            <div className='bg-gray-200 rounded-lg aspect-square mb-3'></div>
                            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title title='Best Selling' description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} href='/shop' />
            <div className='mt-12  grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12'>
                {products.slice().sort((a, b) => b.rating.length - a.rating.length).slice(0, displayQuantity).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSelling