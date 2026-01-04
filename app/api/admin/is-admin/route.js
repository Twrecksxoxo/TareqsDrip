import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Auth Admin
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        
        console.log('🔑 Auth Check - userId:', userId)
        
        if (!userId) {
            return NextResponse.json({ isAdmin: false })
        }

        const isAdmin = await authAdmin(userId)
        
        console.log('✅ isAdmin result:', isAdmin)

        // Always return isAdmin status, let the client handle the UI
        return NextResponse.json({ isAdmin: isAdmin || false })
    } catch (error) {
        console.error('❌ Error in is-admin route:', error);
        return NextResponse.json({ isAdmin: false, error: error.message }, { status: 200 })
    }
}