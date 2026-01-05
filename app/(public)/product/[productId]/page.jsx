'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";

// Loading skeleton component
const ProductSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-48 mb-5"></div>
        <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1">
                <div className="aspect-square bg-gradient-to-br from-slate-200 to-violet-100 rounded-2xl"></div>
            </div>
            <div className="flex-1 space-y-4">
                <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-6 bg-violet-200 rounded w-1/3"></div>
                <div className="space-y-2 mt-6">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
                <div className="h-12 bg-violet-200 rounded-lg w-40 mt-8"></div>
            </div>
        </div>
    </div>
);

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const products = useSelector(state => state.product.list);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            setError(null);

            // First try to find in Redux store (instant)
            const cachedProduct = products.find((p) => p.id === productId);
            if (cachedProduct) {
                setProduct(cachedProduct);
                setLoading(false);
                scrollTo(0, 0);
                return;
            }

            // If not in store yet, fetch from API directly
            try {
                const { data } = await axios.get('/api/products');
                const foundProduct = data.products?.find((p) => p.id === productId);
                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error('Failed to fetch product:', err);
                setError('Failed to load product');
            } finally {
                setLoading(false);
                scrollTo(0, 0);
            }
        };

        if (productId) {
            loadProduct();
        }
    }, [productId, products]);

    // Show skeleton while loading
    if (loading) {
        return (
            <div className="mx-6">
                <div className="max-w-7xl mx-auto py-8">
                    <ProductSkeleton />
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !product) {
        return (
            <div className="mx-6">
                <div className="max-w-7xl mx-auto py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">😕</span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">
                        {error || 'Product not found'}
                    </h2>
                    <p className="text-slate-500 mb-6">
                        The product you&apos;re looking for might have been removed or doesn&apos;t exist.
                    </p>
                    <Link href="/shop" className="inline-block px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrumbs */}
                <div className="text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                <ProductDetails product={product} />

                {/* Description & Reviews */}
                <ProductDescription product={product} />
            </div>
        </div>
    );
}