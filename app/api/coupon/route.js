import prisma from '@/lib/prisma';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';


// Verify coupon 
export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { code } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() , 
                expiresAt: { gt: new Date() }
             }
        })
        if (!coupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 400 })
        }

        if(coupon.forNewUser) {
            const userOrders = await prisma.order.findMany({where: { userId }})
            if(userOrders.length > 0) {
                return NextResponse.json({ error: "Coupon valid for new users" }, { status: 400 })
            }
        }
        if (coupon.forMember) {
            // Check if user has plus plan
            // In @clerk/nextjs v6+, clerkClient is an async function that returns the client
            const client = await clerkClient()
            const user = await client.users.getUser(userId)

            // Debug: log user data to see what's available
            console.log('User debug:', {
                userId,
                publicMetadata: user?.publicMetadata,
                privateMetadata: user?.privateMetadata,
            })

            // Check 1: User metadata for plan
            const metadataPlanCandidates = [
                user?.publicMetadata?.plan,
                user?.privateMetadata?.plan,
                user?.publicMetadata?.membership,
                user?.privateMetadata?.membership,
            ]
            let hasPlusPlan = metadataPlanCandidates.some(p => typeof p === 'string' && p.toLowerCase() === 'plus')

            // Check 2: Organization memberships with plans (used by <Protect plan="plus">)
            if (!hasPlusPlan) {
                try {
                    const orgMemberships = await client.users.getOrganizationMembershipList({ userId })
                    console.log('User org memberships:', orgMemberships?.data?.map(m => ({
                        orgId: m.organization?.id,
                        orgName: m.organization?.name,
                        permissions: m.permissions,
                        role: m.role,
                    })))

                    // Check if any org membership has 'plus' in permissions or role
                    if (orgMemberships?.data) {
                        for (const membership of orgMemberships.data) {
                            // Check org metadata for plan
                            if (membership.organization?.publicMetadata?.plan?.toLowerCase() === 'plus') {
                                hasPlusPlan = true
                                break
                            }
                            // Check permissions for plus-related permission
                            if (membership.permissions?.some(p => p.toLowerCase().includes('plus'))) {
                                hasPlusPlan = true
                                break
                            }
                        }
                    }
                } catch (err) {
                    console.error('Error checking org memberships:', err)
                }
            }

            // Check 3: Use Clerk's has() function via session claims (check auth)
            if (!hasPlusPlan) {
                const { has } = getAuth(request)
                try {
                    // Check if user has the 'plus' plan feature
                    const hasPlus = has?.({ plan: 'plus' })
                    console.log('has({ plan: "plus" }):', hasPlus)
                    if (hasPlus) {
                        hasPlusPlan = true
                    }
                } catch (err) {
                    console.error('Error checking has({ plan }):', err)
                }
            }

            if (!hasPlusPlan) {
                return NextResponse.json({ error: "Coupon valid for members only" }, { status: 400 })
            }
        }

        return NextResponse.json({ coupon })
    } catch (error) {
        console.error('Coupon verification error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}