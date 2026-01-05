'use client'

import Loading from '@/components/Loading'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

function isProbablyUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function buildHtmlEmail({ subject, headline, bodyText, imageUrls, ctaUrl, ctaLabel }) {
  const safeHeadline = escapeHtml(headline || subject || '')
  const safeBody = escapeHtml(bodyText || '')
  const images = (imageUrls || []).filter(Boolean)

  const imagesHtml = images.length
    ? images
        .map(
          (src) => `
          <div style="margin:16px 0;">
            <img src="${src}" alt="" style="max-width:100%; height:auto; border-radius:10px; display:block;" />
          </div>`
        )
        .join('')
    : ''

  const safeCtaUrl = isProbablyUrl(ctaUrl) ? ctaUrl : ''
  const safeCtaLabel = escapeHtml(ctaLabel || 'Shop now')

  const ctaHtml = safeCtaUrl
    ? `
      <div style="margin:22px 0;">
        <a href="${safeCtaUrl}" style="background:#0f172a;color:white;text-decoration:none;padding:12px 16px;border-radius:10px;display:inline-block;font-weight:600;">
          ${safeCtaLabel}
        </a>
      </div>`
    : ''

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#0f172a;">
    <div style="border:1px solid #e2e8f0;border-radius:14px;padding:22px;background:#ffffff;">
      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.2;">${safeHeadline}</h1>
      ${safeBody ? `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#334155;white-space:pre-wrap;">${safeBody}</p>` : ''}
      ${imagesHtml}
      ${ctaHtml}
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
      <p style="margin:0;font-size:12px;color:#64748b;">You’re receiving this because you have an account on our store.</p>
    </div>
  </div>`.trim()
}

export default function AdminMailingPage() {
  const { getToken } = useAuth()

  const [audience, setAudience] = useState('all')
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [html, setHtml] = useState('')

  // Simple builder inputs (no HTML needed)
  const [headline, setHeadline] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [images, setImages] = useState([])
  const [ctaUrl, setCtaUrl] = useState('')
  const [ctaLabel, setCtaLabel] = useState('Shop now')

  const addImage = () => {
    const url = imageUrl.trim()
    if (!url) return
    if (!isProbablyUrl(url)) {
      toast.error('Please enter a valid http(s) image URL')
      return
    }
    setImages((prev) => (prev.includes(url) ? prev : [...prev, url]))
    setImageUrl('')
  }

  const removeImage = (url) => {
    setImages((prev) => prev.filter((x) => x !== url))
  }

  // If the user uses the builder (images/headline/cta), auto-generate HTML.
  useEffect(() => {
    const hasBuilderContent =
      Boolean(headline.trim()) || images.length > 0 || Boolean(ctaUrl.trim()) || Boolean(ctaLabel.trim())

    if (!hasBuilderContent) return

    const generated = buildHtmlEmail({
      subject,
      headline,
      bodyText: text,
      imageUrls: images,
      ctaUrl,
      ctaLabel,
    })
    setHtml(generated)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, headline, text, images, ctaUrl, ctaLabel])

  const [limit, setLimit] = useState(200)
  const [batchSize, setBatchSize] = useState(25)
  const [batchDelayMs, setBatchDelayMs] = useState(400)

  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [recipientTotal, setRecipientTotal] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  const canSend = useMemo(() => {
    return Boolean(subject.trim()) && (Boolean(html.trim()) || Boolean(text.trim()))
  }, [subject, html, text])

  const fetchRecipientCount = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`/api/admin/mailing/recipients?audience=${audience}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setRecipientTotal(data.total)
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
      setRecipientTotal(null)
    }
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      await fetchRecipientCount()
      setLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audience])

  const send = async (dryRun) => {
    try {
      setSending(true)
      setLastResult(null)

      const token = await getToken()
      const { data } = await axios.post(
        '/api/admin/mailing/send',
        {
          subject,
          // html is auto-generated when you use the builder, or manual if you type it
          html,
          text,
          audience,
          dryRun,
          limit,
          batchSize,
          batchDelayMs,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setLastResult(data)
      if (dryRun) {
        toast.success(`Dry run OK: ${data.recipients} recipients`)
      } else {
        toast.success(`Sent ${data.sent}/${data.attempted} emails`)
      }

      await fetchRecipientCount()
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="text-slate-600 max-w-4xl">
      <h1 className="text-2xl">
        Admin <span className="text-slate-800 font-medium">Mailing</span>
      </h1>

      <div className="mt-2 text-sm text-slate-500">
        Audience: <b className="text-slate-700">{audience}</b>
        {typeof recipientTotal === 'number' && (
          <>
            {' '}
            • Registered recipients: <b className="text-slate-700">{recipientTotal}</b>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <label className="text-sm">
            <span className="block mb-1">Audience</span>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="border border-slate-200 rounded-md px-3 py-2 bg-white"
            >
              <option value="all">All users</option>
              <option value="buyers">Only users who placed an order</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="block mb-1">Limit</span>
            <input
              type="number"
              min={1}
              max={5000}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border border-slate-200 rounded-md px-3 py-2 w-28"
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1">Batch size</span>
            <input
              type="number"
              min={1}
              max={200}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="border border-slate-200 rounded-md px-3 py-2 w-28"
            />
          </label>

          <label className="text-sm">
            <span className="block mb-1">Delay (ms)</span>
            <input
              type="number"
              min={0}
              max={5000}
              value={batchDelayMs}
              onChange={(e) => setBatchDelayMs(Number(e.target.value))}
              className="border border-slate-200 rounded-md px-3 py-2 w-28"
            />
          </label>
        </div>

        <label className="text-sm">
          <span className="block mb-1">Subject</span>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Weekend sale: 20% off"
            className="border border-slate-200 rounded-md px-3 py-2 w-full"
          />
        </label>

        <div className="border border-slate-200 rounded-md p-3 bg-white">
          <p className="text-sm text-slate-700 font-medium mb-2">Email builder (no HTML needed)</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="block mb-1">Headline (optional)</span>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Big Sale is live"
                className="border border-slate-200 rounded-md px-3 py-2 w-full"
              />
            </label>

            <label className="text-sm">
              <span className="block mb-1">CTA link (optional)</span>
              <input
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="https://your-site.com/shop"
                className="border border-slate-200 rounded-md px-3 py-2 w-full"
              />
            </label>

            <label className="text-sm">
              <span className="block mb-1">CTA label (optional)</span>
              <input
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="Shop now"
                className="border border-slate-200 rounded-md px-3 py-2 w-full"
              />
            </label>

            <div className="text-sm">
              <span className="block mb-1">Add image from the web</span>
              <div className="flex gap-2">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://.../banner.jpg"
                  className="border border-slate-200 rounded-md px-3 py-2 w-full"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Tip: Use publicly accessible https image URLs (JPG/PNG/WebP).</p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-2">Images in this email</p>
              <div className="flex flex-col gap-2">
                {images.map((url) => (
                  <div key={url} className="flex items-center gap-3 border border-slate-200 rounded-md p-2">
                    <img src={url} alt="" className="w-14 h-14 object-cover rounded" />
                    <div className="flex-1 text-xs text-slate-500 break-all">{url}</div>
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="text-xs px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <label className="text-sm">
          <span className="block mb-1">Text (fallback)</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Plaintext version..."
            className="border border-slate-200 rounded-md px-3 py-2 w-full"
          />
        </label>

        <label className="text-sm">
          <span className="block mb-1">HTML (auto-generated when you use the builder)</span>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={10}
            placeholder="Generated HTML will appear here (you can still edit it manually)."
            className="border border-slate-200 rounded-md px-3 py-2 w-full font-mono"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => send(true)}
            disabled={sending || !canSend}
            className="px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
          >
            {sending ? 'Working…' : 'Dry run'}
          </button>
          <button
            onClick={() => send(false)}
            disabled={sending || !canSend}
            className="px-4 py-2 rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {sending ? 'Sending…' : 'Send campaign'}
          </button>
        </div>

        {lastResult && (
          <div className="mt-2">
            <p className="text-sm text-slate-500 mb-2">Last result</p>
            <pre className="text-xs bg-slate-50 border border-slate-200 rounded-md p-3 overflow-auto">
              {JSON.stringify(lastResult, null, 2)}
            </pre>
          </div>
        )}

        <p className="text-xs text-slate-400">
          Tip: Start with “Dry run” to verify recipient count before sending. Configure SMTP via env vars
          (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/MAIL_FROM). Images must be hosted publicly.
        </p>
      </div>
    </div>
  )
}
