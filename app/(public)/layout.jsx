'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddresses } from "@/lib/features/address/addressSlice";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";

export default function PublicLayout({ children }) {
    
    const dispatch = useDispatch()
    const { user } = useUser()
    const { getToken } = useAuth()

    const { cartItems } = useSelector((state) => state.cart)
    const { list: products, loading, lastFetched } = useSelector((state) => state.product)
    const hasFetchedRef = useRef(false)

    // Fetch products immediately on mount - only once
    useEffect(() => {
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true
            dispatch(fetchProducts({}))
        }
    }, [dispatch])

    // Background refresh - only if data is stale (older than 2 minutes)
    useEffect(() => {
        const twoMinutes = 2 * 60 * 1000

        // If we have products and they're fresh, don't refetch
        if (products.length > 0 && lastFetched && Date.now() - lastFetched < twoMinutes) {
            return
        }

        // Set up periodic refresh every 2 minutes
        const refreshInterval = setInterval(() => {
            if (!loading) {
                dispatch(fetchProducts({}))
            }
        }, twoMinutes)

        return () => clearInterval(refreshInterval)
    }, [dispatch, products.length, lastFetched, loading])

    // Fetch user-specific data when logged in
    useEffect(() => {
        if (user) {
            dispatch(fetchCart({ getToken }))
            dispatch(fetchAddresses({ getToken }))
            dispatch(fetchUserRatings({ getToken }))
        }
    }, [user, dispatch, getToken])

    // Upload cart when it changes
    useEffect(() => {
        if (user && cartItems) {
            dispatch(uploadCart({ getToken }))
        }
    }, [cartItems, user, dispatch, getToken])

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
