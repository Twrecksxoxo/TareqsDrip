'use client'
import StoreLayout from "@/components/store/StoreLayout";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function RootStoreLayout({ children }) {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (isLoaded && !isSignedIn && !isRedirecting) {
            setIsRedirecting(true);
            router.push('/sign-in?redirect_url=/store');
        }
    }, [isLoaded, isSignedIn, router, isRedirecting]);

    // Show loading only while Clerk is loading
    if (!isLoaded) {
        return <Loading />;
    }

    // If not signed in and redirecting, show loading
    if (!isSignedIn) {
        return <Loading />;
    }

    return (
        <StoreLayout>
            {children}
        </StoreLayout>
    );
}
