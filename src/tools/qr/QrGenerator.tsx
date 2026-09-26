import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import ToolLayout from '../../components/ToolLayout'
import { Helmet } from 'react-helmet-async'

type QrGeneratorProps = {
  onBack: () => void
}

type ContentType = 'url' | 'text' | 'wifi'
type WifiSecurity = 'WPA' | 'WEP' | 'nopass'

const EMOJI_PRESETS = ['✨', '❤️', '🔗', '📍', '🎉', '🐶']

function QrGenerator({
  onBack,
}: QrGeneratorProps) {
  const [contentType, setContentType] =
    useState<ContentType>('url')

  const [content, setContent] = useState('')
  const [size, setSize] = useState(320)
  const [emoji, setEmoji] = useState('')

  const [wifiName, setWifiName] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')

  const [wifiSecurity, setWifiSecurity] =
    useState<WifiSecurity>('WPA')

  const [wifiHidden, setWifiHidden] =
    useState(false)

  const [showWifiPassword, setShowWifiPassword] =
    useState(false)

  const [pngDataUrl, setPngDataUrl] = useState('')
  const [svgContent, setSvgContent] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  /* -------------------------------- */
  /* QR content                       */
  /* -------------------------------- */

  const qrValue = useMemo(() => {
    if (contentType === 'wifi') {
      if (!wifiName.trim()) {
        return ''
      }

      return buildWifiString({
        ssid: wifiName,
        password: wifiPassword,
        security: wifiSecurity,
        hidden: wifiHidden,
      })
    }

    return content.trim()
  }, [
    contentType,
    content,
    wifiName,
    wifiPassword,
    wifiSecurity,
    wifiHidden,
  ])

  /* -------------------------------- */
  /* URL suggestion                   */
  /* -------------------------------- */

  const suggestedUrl = useMemo(() => {
    if (
      contentType !== 'url' ||
      !content.trim()
    ) {
      return ''
    }

    const value = content.trim()

    if (
      /^https?:\/\//i.test(value) ||
      !looksLikeDomain(value)
    ) {
      return ''
    }

    return `https://${value}`
  }, [contentType, content])

  /* -------------------------------- */
  /* Complexity warning               */
  /* -------------------------------- */

  const complexity = useMemo(() => {
    if (!qrValue) {
      return 'normal'
    }

    if (qrValue.length > 500) {
      return 'high'
    }

    if (qrValue.length > 220) {
      return 'medium'
    }

    return 'normal'
  }, [qrValue])

  /* -------------------------------- */
  /* Generate QR automatically        */
  /* -------------------------------- */

  useEffect(() => {
    let cancelled = false

    async function generateQr() {
      if (!qrValue) {
        setPngDataUrl('')
        setSvgContent('')
        setError('')
        return
      }

      try {
        const options = {
          width: size,
          margin: 4,

          color: {
            dark: '#18181b',
            light: '#ffffff',
          },

          errorCorrectionLevel:
            'H' as const,
        }

        const rawPng =
          await QRCode.toDataURL(
            qrValue,
            options
          )

        const rawSvg =
          await QRCode.toString(
            qrValue,
            {
              ...options,
              type: 'svg',
            }
          )

        const finalPng = emoji
          ? await addEmojiToPng(
              rawPng,
              emoji,
              size
            )
          : rawPng

        const finalSvg = emoji
          ? addEmojiToSvg(
              rawSvg,
              emoji
            )
          : rawSvg

        if (cancelled) {
          return
        }

        setPngDataUrl(finalPng)
        setSvgContent(finalSvg)
        setError('')
        setCopied(false)
      } catch {
        if (cancelled) {
          return
        }

        setPngDataUrl('')
        setSvgContent('')

        setError(
          'Could not generate this QR 👀'
        )
      }
    }

    generateQr()

    return () => {
      cancelled = true
    }
  }, [qrValue, size, emoji])

  /* -------------------------------- */
  /* Actions                          */
  /* -------------------------------- */

  function switchType(
    type: ContentType
  ) {
    setContentType(type)
    setError('')
    setCopied(false)
  }

  function clearQr() {
    setContent('')

    setWifiName('')
    setWifiPassword('')
    setWifiSecurity('WPA')
    setWifiHidden(false)
    setShowWifiPassword(false)

    setEmoji('')

    setPngDataUrl('')
    setSvgContent('')

    setError('')
    setCopied(false)
  }

  function useSuggestedUrl() {
    if (!suggestedUrl) {
      return
    }

    setContent(suggestedUrl)
  }

  async function copyImage() {
    if (!pngDataUrl) {
      return
    }

    try {
      const response =
        await fetch(pngDataUrl)

      const blob =
        await response.blob()

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ])

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      setError(
        'Your browser could not copy the image. You can still download it.'
      )
    }
  }

  function downloadPng() {
    if (!pngDataUrl) {
      return
    }

    const link =
      document.createElement('a')

    link.download =
      getFileName(
        qrValue,
        contentType,
        'png'
      )

    link.href = pngDataUrl
    link.click()
  }

  function downloadSvg() {
    if (!svgContent) {
      return
    }

    const blob = new Blob(
      [svgContent],
      {
        type: 'image/svg+xml;charset=utf-8',
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.download =
      getFileName(
        qrValue,
        contentType,
        'svg'
      )

    link.href = url
    link.click()

    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }

  /* -------------------------------- */
  /* UI                               */
  /* -------------------------------- */

  return (
    <>
    <Helmet>
      <title>
        QR Code Generator | Universal Tool
      </title>

      <meta
        name="description"
        content="Create QR codes instantly for URLs, text and more. Customize, download and generate them privately in your browser for free."
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <meta
        property="og:title"
        content="QR Code Generator | Universal Tool"
      />

      <meta
        property="og:description"
        content="Create QR codes instantly for URLs, text and more. Customize, download and generate them privately in your browser for free."
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        name="twitter:title"
        content="QR Code Generator | Universal Tool"
      />

      <meta
        name="twitter:description"
        content="Create QR codes instantly for URLs, text and more. Customize, download and generate them privately in your browser for free."
      />
    </Helmet>

    <ToolLayout
      icon="▦"
      title="QR Generator"
      description="Turn links, text or Wi-Fi credentials into a QR code."
      status="generated locally"
      onBack={onBack}
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_1.15fr]">

        {/* Controls */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          {/* Content type */}

          <div>
            <p className="text-sm text-white/60">
              Content type
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.07] bg-black/20 p-1">
              <TypeButton
                active={
                  contentType === 'url'
                }
                onClick={() =>
                  switchType('url')
                }
              >
                URL
              </TypeButton>

              <TypeButton
                active={
                  contentType === 'text'
                }
                onClick={() =>
                  switchType('text')
                }
              >
                Text
              </TypeButton>

              <TypeButton
                active={
                  contentType === 'wifi'
                }
                onClick={() =>
                  switchType('wifi')
                }
              >
                Wi-Fi
              </TypeButton>
            </div>
          </div>

          {/* URL / Text */}

          {contentType !== 'wifi' && (
            <div className="mt-8">
              <label className="text-sm text-white/60">
                {contentType === 'url'
                  ? 'URL'
                  : 'Text'}
              </label>

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                placeholder={
                  contentType === 'url'
                    ? 'https://example.com'
                    : 'Write anything...'
                }
                spellCheck={
                  contentType === 'text'
                }
                className="mt-3 min-h-32 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
              />

              {suggestedUrl && (
                <div className="mt-3 rounded-xl border border-violet-400/15 bg-violet-400/[0.05] px-4 py-3">
                  <p className="text-xs text-white/40">
                    Looks like a URL.
                    Add the protocol?
                  </p>

                  <button
                    onClick={
                      useSuggestedUrl
                    }
                    className="mt-1 break-all font-mono text-xs text-violet-300 transition hover:text-violet-200"
                  >
                    Use {suggestedUrl} →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Wi-Fi */}

          {contentType === 'wifi' && (
            <div className="mt-8 space-y-5">

              {/* Network name */}

              <div>
                <label className="text-sm text-white/60">
                  Network name
                </label>

                <input
                  value={wifiName}
                  onChange={(event) =>
                    setWifiName(
                      event.target.value
                    )
                  }
                  placeholder="Wi-Fi name"
                  autoComplete="off"
                  spellCheck={false}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
                />
              </div>

              {/* Security */}

              <div>
                <label className="text-sm text-white/60">
                  Security
                </label>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(
                    [
                      'WPA',
                      'WEP',
                      'nopass',
                    ] as WifiSecurity[]
                  ).map(
                    (security) => (
                      <button
                        key={security}
                        type="button"
                        onClick={() =>
                          setWifiSecurity(
                            security
                          )
                        }
                        className={`rounded-xl border px-3 py-2.5 text-xs transition ${
                          wifiSecurity ===
                          security
                            ? 'border-violet-400/30 bg-violet-400/10 text-violet-300'
                            : 'border-white/10 bg-white/[0.02] text-white/30 hover:text-white/60'
                        }`}
                      >
                        {security ===
                        'nopass'
                          ? 'Open'
                          : security}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Wi-Fi password */}

              {wifiSecurity !==
                'nopass' && (
                <div>
                  <label className="text-sm text-white/60">
                    Password
                  </label>

                  <div className="relative mt-3">
                    <input
                      type={
                        showWifiPassword
                          ? 'text'
                          : 'password'
                      }
                      value={
                        wifiPassword
                      }
                      onChange={(
                        event
                      ) =>
                        setWifiPassword(
                          event.target
                            .value
                        )
                      }
                      placeholder="Wi-Fi password"
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-16 text-sm outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowWifiPassword(
                          !showWifiPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 transition hover:text-white"
                    >
                      {showWifiPassword
                        ? 'Hide'
                        : 'Show'}
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden network */}

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                <div>
                  <div className="text-sm text-white/60">
                    Hidden network
                  </div>

                  <div className="mt-0.5 text-xs text-white/20">
                    Include hidden-network
                    information.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={wifiHidden}
                  onChange={(event) =>
                    setWifiHidden(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 accent-violet-400"
                />
              </label>
            </div>
          )}

          {/* Export size */}

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/60">
                Export size
              </label>

              <span className="font-mono text-sm text-violet-300">
                {size}px
              </span>
            </div>

            <input
              type="range"
              min="200"
              max="1000"
              step="20"
              value={size}
              onChange={(event) =>
                setSize(
                  Number(
                    event.target.value
                  )
                )
              }
              className="mt-4 w-full accent-violet-400"
            />

            <div className="mt-2 flex justify-between font-mono text-[10px] text-white/15">
              <span>200</span>
              <span>1000</span>
            </div>
          </div>

          {/* Emoji */}

          <div className="mt-8">
            <label className="text-sm text-white/60">
              Center emoji

              <span className="ml-2 text-white/25">
                optional
              </span>
            </label>

            <p className="mt-1 text-xs text-white/25">
              Add a little personality
              without covering too much
              of the QR.
            </p>

            <div className="mt-3 flex items-center gap-3">
              <input
                value={emoji}
                onChange={(event) =>
                  setEmoji(
                    firstGrapheme(
                      event.target.value
                    )
                  )
                }
                placeholder="🐶"
                className="h-12 w-20 rounded-xl border border-white/10 bg-white/5 px-3 text-center text-xl outline-none transition placeholder:text-white/30 focus:border-violet-400/50"
              />

              {emoji && (
                <button
                  type="button"
                  onClick={() =>
                    setEmoji('')
                  }
                  className="text-xs text-white/30 transition hover:text-white"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Emoji presets */}

            <div className="mt-3 flex flex-wrap gap-2">
              {EMOJI_PRESETS.map(
                (preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() =>
                      setEmoji(preset)
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-base transition hover:-translate-y-0.5 ${
                      emoji === preset
                        ? 'border-violet-400/40 bg-violet-400/10'
                        : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    {preset}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Clear */}

          <button
            onClick={clearQr}
            disabled={
              !content &&
              !wifiName &&
              !wifiPassword &&
              !emoji
            }
            className="mt-8 w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
          >
            Clear
          </button>
        </div>

        {/* Preview */}

        <div className="min-w-0 flex min-h-[600px] flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          {/* Preview header */}

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-white/30">
              Preview
            </span>

            <span className="text-xs text-emerald-400/70">
              ● Live preview
            </span>
          </div>

          {/* QR */}

          <div className="flex flex-1 flex-col items-center justify-center py-8">
            {error ? (
              <div className="max-w-sm text-center text-sm text-red-300">
                {error}
              </div>
            ) : pngDataUrl ? (
              <>
                <div className="rounded-3xl bg-white p-4 shadow-2xl shadow-violet-500/5">
                 <img
  src={pngDataUrl}
  alt="Generated QR code"
  className="h-auto w-full max-w-[280px]"
/>
                </div>

                {/* Metadata */}

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <MetaPill>
                    {size} × {size}
                  </MetaPill>

                  <MetaPill>
                    Error correction H
                  </MetaPill>

                  <MetaPill>
                    {qrValue.length}{' '}
                    {qrValue.length === 1
                      ? 'character'
                      : 'characters'}
                  </MetaPill>

                  {emoji && (
                    <MetaPill>
                      Center emoji
                    </MetaPill>
                  )}
                </div>

                {/* Complexity warning */}

                {complexity !==
                  'normal' && (
                  <div className="mt-6 max-w-md rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3 text-center text-xs leading-relaxed text-amber-100/60">
                    {complexity ===
                    'high'
                      ? 'This QR contains a lot of data and may become dense. Test it with the devices you expect people to use before printing.'
                      : 'This QR is getting fairly dense. Give it enough physical size when printing and test it first.'}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="text-3xl text-violet-300/20">
                  ▦
                </div>

                <div className="mt-4 text-white/20">
                  Your QR will magically
                  <br />
                  appear here.
                </div>
              </div>
            )}
          </div>

          {/* Copy */}

          <button
            onClick={copyImage}
            disabled={!pngDataUrl}
            className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/60 transition hover:border-violet-400/40 hover:text-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
          >
            {copied
              ? 'Copied ✓'
              : 'Copy image'}
          </button>

          {/* Downloads */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={downloadPng}
              disabled={!pngDataUrl}
              className="rounded-xl bg-violet-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
            >
              Download PNG
            </button>

            <button
              onClick={downloadSvg}
              disabled={!svgContent}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/60 transition hover:border-violet-400/40 hover:text-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
            >
              Download SVG
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-white/20">
            Nothing is uploaded. Your QR
            is generated entirely in this
            browser.
          </p>
        </div>
      </div>
    </ToolLayout>
</>
)
}

/* ================================= */
/* UI HELPERS                        */
/* ================================= */

function TypeButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2.5 text-xs transition ${
        active
          ? 'bg-violet-400/15 text-violet-300'
          : 'text-white/30 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function MetaPill({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/30">
      {children}
    </span>
  )
}

/* ================================= */
/* WI-FI QR                          */
/* ================================= */

function buildWifiString({
  ssid,
  password,
  security,
  hidden,
}: {
  ssid: string
  password: string
  security: WifiSecurity
  hidden: boolean
}) {
  const safeSsid =
    escapeWifiValue(ssid)

  const safePassword =
    escapeWifiValue(password)

  const passwordPart =
    security === 'nopass'
      ? ''
      : `P:${safePassword};`

  return (
    `WIFI:T:${security};` +
    `S:${safeSsid};` +
    passwordPart +
    `H:${hidden ? 'true' : 'false'};;`
  )
}

function escapeWifiValue(
  value: string
) {
  return value.replace(
    /([\\;,:"'])/g,
    '\\$1'
  )
}

/* ================================= */
/* PNG + EMOJI                       */
/* ================================= */

async function addEmojiToPng(
  qrDataUrl: string,
  emoji: string,
  size: number
) {
  const image = new Image()

  image.src = qrDataUrl

  await new Promise<void>(
    (resolve, reject) => {
      image.onload = () =>
        resolve()

      image.onerror = () =>
        reject()
    }
  )

  const canvas =
    document.createElement('canvas')

  canvas.width = size
  canvas.height = size

  const context =
    canvas.getContext('2d')

  if (!context) {
    return qrDataUrl
  }

  context.drawImage(
    image,
    0,
    0,
    size,
    size
  )

  const center =
    size / 2

  const plateSize =
    size * 0.16

  const emojiSize =
    size * 0.095

  /* White protection plate */

  context.fillStyle = '#ffffff'

  context.beginPath()

  context.roundRect(
    center - plateSize / 2,
    center - plateSize / 2,
    plateSize,
    plateSize,
    plateSize * 0.22
  )

  context.fill()

  /* Emoji */

  context.font =
    `${emojiSize}px ` +
    `"Apple Color Emoji", ` +
    `"Segoe UI Emoji", ` +
    `"Noto Color Emoji", ` +
    `sans-serif`

  context.textAlign = 'center'
  context.textBaseline = 'middle'

  context.fillText(
    emoji,
    center,
    center + emojiSize * 0.04
  )

  return canvas.toDataURL(
    'image/png'
  )
}

/* ================================= */
/* SVG + EMOJI                       */
/* ================================= */

function addEmojiToSvg(
  svg: string,
  emoji: string
) {
  const viewBoxMatch =
    svg.match(
      /viewBox="0 0 ([\d.]+) ([\d.]+)"/
    )

  if (!viewBoxMatch) {
    return svg
  }

  const width =
    Number(viewBoxMatch[1])

  const height =
    Number(viewBoxMatch[2])

  const centerX =
    width / 2

  const centerY =
    height / 2

  const plateSize =
    Math.min(
      width,
      height
    ) * 0.16

  const fontSize =
    Math.min(
      width,
      height
    ) * 0.095

  const escapedEmoji =
    escapeXml(emoji)

  const decoration = `
    <g aria-hidden="true">
      <rect
        x="${centerX - plateSize / 2}"
        y="${centerY - plateSize / 2}"
        width="${plateSize}"
        height="${plateSize}"
        rx="${plateSize * 0.22}"
        fill="#ffffff"
      />

      <text
        x="${centerX}"
        y="${centerY}"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="${fontSize}"
        font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
      >${escapedEmoji}</text>
    </g>
  `

  return svg.replace(
    '</svg>',
    `${decoration}</svg>`
  )
}

function escapeXml(
  value: string
) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/* ================================= */
/* EMOJI HELPER                      */
/* ================================= */

function firstGrapheme(
  value: string
) {
  if (!value) {
    return ''
  }

  /*
   * Handles emoji sequences such as ❤️
   * as one visible character.
   */
  if ('Segmenter' in Intl) {
    const SegmenterConstructor =
      Intl.Segmenter

    const segmenter =
      new SegmenterConstructor(
        undefined,
        {
          granularity:
            'grapheme',
        }
      )

    const iterator =
      segmenter
        .segment(value)
        [Symbol.iterator]()

    const first =
      iterator.next().value

    return first?.segment ?? ''
  }

  return (
    Array.from(value)[0] ??
    ''
  )
}

/* ================================= */
/* URL HELPER                        */
/* ================================= */

function looksLikeDomain(
  value: string
) {
  return (
    /^[^\s]+\.[^\s]+$/.test(
      value
    ) &&
    !value.includes(' ')
  )
}

/* ================================= */
/* FILE NAME                         */
/* ================================= */

function getFileName(
  value: string,
  type: ContentType,
  extension: 'png' | 'svg'
) {
  if (type === 'wifi') {
    return `wifi-qr.${extension}`
  }

  if (type === 'url') {
    try {
      const normalized =
        /^https?:\/\//i.test(
          value
        )
          ? value
          : `https://${value}`

      const url =
        new URL(normalized)

      const hostname =
        url.hostname
          .replace(/^www\./, '')
          .replace(
            /[^a-z0-9]+/gi,
            '-'
          )
          .replace(
            /^-|-$/g,
            ''
          )
          .toLowerCase()

      if (hostname) {
        return `${hostname}-qr.${extension}`
      }
    } catch {
      // Use fallback below.
    }
  }

  return `universal-qr.${extension}`
}

export default QrGenerator