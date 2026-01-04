import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to ensure user exists in database
async function ensureUserExists(userId) {
    let user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        // Fetch user details from Clerk and create user in database
        try {
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(userId);

            user = await prisma.user.create({
                data: {
                    id: userId,
                    name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : 'User',
                    email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    image: clerkUser.imageUrl || '',
                    cart: {}
                }
            });
        } catch (err) {
            console.error('Error creating user:', err);
            throw new Error('Failed to create user');
        }
    }

    return user;
}

//Add new address
export async function POST(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { address } = await request.json()

        // Ensure user exists before adding address
        await ensureUserExists(userId);

        address.userId = userId

        const newAddress = await prisma.address.create({
            data: address
        })

        return NextResponse.json({newAddress, message: 'Address added' })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 500 })
    }
}

//Get all addresses for a user

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const addresses = await prisma.address.findMany({
            where: { userId }
        })

        return NextResponse.json({addresses})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 500 })
    }
}
