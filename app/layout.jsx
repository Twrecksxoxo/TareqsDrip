import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
// import StoreProvider from "@/app/StoreProvider.js";
import StoreProvider from "./StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";


const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Tareqs Bazaar - Shop smarter",
    description: "Tareqs Bazaar - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
         <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <Toaster />
                    {children}
                </StoreProvider>
            </body>
         </html>
        </ClerkProvider>
    );
}
