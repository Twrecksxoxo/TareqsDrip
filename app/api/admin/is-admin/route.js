import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Auth Admin
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        
        console.log('🔑 Auth Check - userId:', userId)
        
        const isAdmin = await authAdmin(userId)
        
        console.log('✅ isAdmin result:', isAdmin)
        
        if(!isAdmin){
            return NextResponse.json({error:'not authorized'},{status:401})
        }


        return NextResponse.json({isAdmin})
    } catch (error) {
        console.error('❌ Error in is-admin route:', error);
        return NextResponse.json({ error: error.code|| error.message},{status:400})

    }
}