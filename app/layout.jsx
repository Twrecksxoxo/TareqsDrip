import { Outfit, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
// import StoreProvider from "@/app/StoreProvider.js";
import StoreProvider from "./StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ChatClientWrapper from '@/components/Chatbot/ChatClientWrapper';


const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });
const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["normal", "italic"],
    variable: "--font-cormorant"
});

export const metadata = {
    title: "Tareqs Drip$$$",
    description: "Discover cutting-edge fashion for the future. Premium styles and avant-garde collections.",
};

export default function RootLayout({ children }) {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const isValidKey = typeof publishableKey === 'string' && publishableKey.startsWith('pk_');

    const appShell = (
        <html lang="en">
            <body className={`${outfit.className} ${cormorant.variable} antialiased`}>
                <StoreProvider>
                    <Toaster />
                    <ChatClientWrapper />
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
