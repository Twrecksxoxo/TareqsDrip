'use client'
import { Suspense } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { categories } from "@/assets/assets"

function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const products = useSelector(state => state.product.list)

    const filteredProducts = search
        ? products.filter(product => {
            const searchLower = search.toLowerCase()
            return (
                product.name?.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower) ||
                product.category?.toLowerCase().includes(searchLower)
            )
        })
        : products;

    // If search is active, keep existing flat listing behavior.
    if (search) {
        return (
            <div className="min-h-[70vh] mx-6">
                <div className=" max-w-7xl mx-auto">
                    <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {search && <MoveLeftIcon size={20} />}  Search <span className="text-slate-700 font-medium">Results for &quot;{search}&quot;</span></h1>
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <MoveLeftIcon size={32} className="text-slate-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-700 mb-2">No products found</h2>
                            <p className="text-slate-500 mb-6">We couldn&apos;t find any products matching &quot;{search}&quot;</p>
                            <button
                                onClick={() => router.push('/shop')}
                                className="px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                            >
                                Browse All Products
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // No search: group by category and render in the order defined in assets.
    const grouped = filteredProducts.reduce((acc, product) => {
        const key = product?.category || 'Others'
        if (!acc[key]) acc[key] = []
        acc[key].push(product)
        return acc
    }, {})

    const orderedCategoryKeys = [
        ...categories,
        // include any categories found in data but not in the configured list
        ...Object.keys(grouped).filter((c) => !categories.includes(c)),
    ]

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 className="text-2xl text-slate-500 my-6 flex items-center gap-2"> All <span className="text-slate-700 font-medium">Products</span></h1>

                <div className="mb-32 space-y-12">
                    {orderedCategoryKeys.map((category) => {
                        const list = grouped[category]
                        if (!list || list.length === 0) return null
                        return (
                            <section key={category}>
                                <h2 className="text-lg sm:text-xl text-slate-600 font-medium mb-4">{category}</h2>
                                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
                                    {list.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}