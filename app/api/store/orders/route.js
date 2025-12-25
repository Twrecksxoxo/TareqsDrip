import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update seller orders status
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const { orderId, status } = await request.json()

        // Update only by order id after authorization
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        })

        return NextResponse.json({ message: 'order status updated' })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    
    }
}


//Get all orders for a seller
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)
        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        } 
        const orders = await prisma.order.findMany({
            where: { storeId },
            include: {
                user: true,
                orderItems: { include: { product: true } },
                address: true,
            },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ orders })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}