import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
// import StoreProvider from "@/app/StoreProvider.js";
import StoreProvider from "./StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";


const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "LUXE - Futuristic Fashion Platform",
    description: "Discover cutting-edge fashion for the future. Premium styles and avant-garde collections.",
};

export default function RootLayout({ children }) {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const isValidKey = typeof publishableKey === 'string' && publishableKey.startsWith('pk_');

    const appShell = (
        <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <Toaster />
                    {children}
                </StoreProvider>
            </body>
        </html>
    );

    // Guard against invalid/missing Clerk key during build to avoid prerender errors.
    return isValidKey ? (
        <ClerkProvider publishableKey={publishableKey}>{appShell}</ClerkProvider>
    ) : (
        appShell
    );
}
