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
        ? products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase())
        )
        : products;

    // If search is active, keep existing flat listing behavior.
    if (search) {
        return (
            <div className="min-h-[70vh] mx-6">
                <div className=" max-w-7xl mx-auto">
                    <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {search && <MoveLeftIcon size={20} />}  Search <span className="text-slate-700 font-medium">Results</span></h1>
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
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