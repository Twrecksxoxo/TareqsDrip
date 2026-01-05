import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// Get all active lookbook images (public endpoint)
export async function GET() {
    try {
        const lookbookImages = await prisma.lookbook.findMany({
            where: { isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ],
            select: {
                id: true,
                imageUrl: true,
                title: true,
                description: true,
                createdAt: true
            }
        })
        return NextResponse.json({ lookbook: lookbookImages })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

