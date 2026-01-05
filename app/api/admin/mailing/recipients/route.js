import prisma from '@/lib/prisma'
import authAdmin from '@/middleware/authAdmin'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Returns recipient counts for the mailing feature.
// Audience options:
// - all: all registered users with an email
// - buyers: users who have placed at least one order
export async function GET(request) {
  try {
    const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin) {
      return NextResponse.json({ error: 'not authorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const audience = (searchParams.get('audience') || 'all').toLowerCase()

    const where =
      audience === 'buyers'
        ? { buyerOrders: { some: {} }, email: { not: '' } }
        : { email: { not: '' } }

    const total = await prisma.user.count({ where })

    return NextResponse.json({ audience, total })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.code || error.message || 'failed' },
      { status: 400 }
    )
  }
}

