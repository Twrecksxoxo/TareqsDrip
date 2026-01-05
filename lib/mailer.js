import nodemailer from 'nodemailer'

const REQUIRED_ENV = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM']

function assertMailerEnv() {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k])
  if (missing.length) {
    throw new Error(`Missing mail config env vars: ${missing.join(', ')}`)
  }
}

export function createSmtpTransport() {
  assertMailerEnv()

  const port = Number(process.env.SMTP_PORT)
  const secure = port === 465

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendEmail({ to, subject, html, text }) {
  if (!to) throw new Error('Missing recipient (to)')
  if (!subject) throw new Error('Missing subject')
  if (!html && !text) throw new Error('Missing html or text')

  const transporter = createSmtpTransport()

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  })
}

