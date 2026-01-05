import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const storeId = searchParams.get('storeId');

        // Base filter: only in-stock products
        const whereClause = {
            inStock: true,
            ...(storeId
                ? { storeId }
                : {
                      // Public listing: only show products from approved + active stores
                      store: { isActive: true, status: 'approved' },
                  }),
        };

        const products = await prisma.product.findMany({
            where: whereClause,
            include: {
                rating: {
                    select: {
                        rating: true,
                        review: true,
                        user: { select: { name: true, image: true } },
                    },
                },
                store: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    }
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ products }, {
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
            }
        });
    } catch (error) {
        console.error('Products API Error:', error);
        return NextResponse.json(
            { error: error?.message || 'An internal server error occurred' },
            { status: 500 }
        );
    }
}