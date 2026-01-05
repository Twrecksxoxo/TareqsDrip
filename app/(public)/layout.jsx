'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddresses } from "@/lib/features/address/addressSlice";
import { useUser,useAuth } from "@clerk/nextjs";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";




export default function PublicLayout({ children }) {
    
    const dispatch = useDispatch()
    const {user} = useUser()
    const {getToken} = useAuth()
    
    const {cartItems} = useSelector((state) => state.cart)
    const { lastFetched } = useSelector((state) => state.product)
    const retryCountRef = useRef(0)
    const maxRetries = 3

    // Fetch products with retry logic
    const fetchProductsWithRetry = useCallback(async () => {
        try {
            await dispatch(fetchProducts({})).unwrap()
            retryCountRef.current = 0 // Reset on success
        } catch (err) {
            console.error('Products fetch failed:', err)
            // Retry with exponential backoff
            if (retryCountRef.current < maxRetries) {
                retryCountRef.current++
                const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000)
                console.log(`Retrying product fetch in ${delay}ms (attempt ${retryCountRef.current}/${maxRetries})`)
                setTimeout(() => {
                    dispatch(fetchProducts({}))
                }, delay)
            }
        }
    }, [dispatch])

    // Initial fetch
    useEffect(() => {
        fetchProductsWithRetry()
    }, [fetchProductsWithRetry])

    // Periodic refresh every 5 minutes if products are stale
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            const fiveMinutes = 5 * 60 * 1000
            if (!lastFetched || Date.now() - lastFetched > fiveMinutes) {
                dispatch(fetchProducts({}))
            }
        }, 60000) // Check every minute

        return () => clearInterval(refreshInterval)
    }, [dispatch, lastFetched])

    useEffect(() => {
        if (user) {
            dispatch(fetchCart({ getToken }))
            dispatch(fetchAddresses({ getToken }))
            dispatch(fetchUserRatings({ getToken }))
        }
    }, [user])

    useEffect(() => {
        if (user) {
            dispatch(uploadCart({ getToken }))
        }
    }, [cartItems])



    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
