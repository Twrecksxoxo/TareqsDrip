import prisma from '@/lib/prisma';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

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

// Update user cart
export async function POST(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { cart } = await request.json()

        // Ensure user exists before updating cart
        await ensureUserExists(userId);

        //Save the cart to the user object
        await prisma.user.update({
            where: { id: userId },
            data: { cart: cart || {} }
        })

        return NextResponse.json({ message: 'Cart updated' })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// Get user cart
export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Ensure user exists before fetching cart
        const user = await ensureUserExists(userId);

        return NextResponse.json({ cart: user.cart || {} })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}