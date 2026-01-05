import prisma from '@/lib/prisma'
import { sendEmail } from '@/lib/mailer'
import authAdmin from '@/middleware/authAdmin'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isValidEmail(email) {
  return typeof email === 'string' && /.+@.+\..+/.test(email)
}

// POST body:
// {
//   subject: string,
//   html?: string,
//   text?: string,
//   audience?: 'all' | 'buyers',
//   dryRun?: boolean,
//   limit?: number,
//   batchSize?: number,
//   batchDelayMs?: number
// }
export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin) {
      return NextResponse.json({ error: 'not authorized' }, { status: 401 })
    }

    const body = await request.json()

    const subject = (body?.subject || '').trim()
    const html = typeof body?.html === 'string' ? body.html : ''
    const text = typeof body?.text === 'string' ? body.text : ''
    const audience = (body?.audience || 'all').toLowerCase()
    const dryRun = Boolean(body?.dryRun)

    const limit = Math.max(1, Math.min(Number(body?.limit || 200), 5000))
    const batchSize = Math.max(1, Math.min(Number(body?.batchSize || 25), 200))
    const batchDelayMs = Math.max(0, Math.min(Number(body?.batchDelayMs || 400), 5000))

    if (!subject) {
      return NextResponse.json({ error: 'subject is required' }, { status: 400 })
    }
    if (!html && !text) {
      return NextResponse.json({ error: 'html or text is required' }, { status: 400 })
    }

    const where =
      audience === 'buyers'
        ? { buyerOrders: { some: {} }, email: { not: '' } }
        : { email: { not: '' } }

    const users = await prisma.user.findMany({
      where,
      select: { email: true },
      orderBy: { id: 'asc' },
      take: limit,
    })

    const emails = users
      .map((u) => (u?.email || '').trim())
      .filter((e) => isValidEmail(e))

    let sent = 0
    let failed = 0
    const failures = []

    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        audience,
        limit,
        batchSize,
        batchDelayMs,
        recipients: emails.length,
      })
    }

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)

      // sequential per batch to be gentle on SMTP providers
      for (const to of batch) {
        try {
          await sendEmail({ to, subject, html, text })
          sent += 1
        } catch (err) {
          failed += 1
          failures.push({ email: to, error: err?.message || 'send failed' })
        }
      }

      if (i + batchSize < emails.length && batchDelayMs) {
        await sleep(batchDelayMs)
      }
    }

    return NextResponse.json({
      dryRun: false,
      audience,
      attempted: emails.length,
      sent,
      failed,
      failures,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error.code || error.message || 'failed' },
      { status: 400 }
    )
  }
}

