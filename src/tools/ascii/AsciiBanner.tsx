import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import figlet from 'figlet'
import standard from 'figlet/importable-fonts/Standard.js'
import small from 'figlet/importable-fonts/Small.js'
import big from 'figlet/importable-fonts/Big.js'
import slant from 'figlet/importable-fonts/Slant.js'
import shadow from 'figlet/importable-fonts/Shadow.js'
import block from 'figlet/importable-fonts/Block.js'
import banner from 'figlet/importable-fonts/Banner.js'
import digital from 'figlet/importable-fonts/Digital.js'
import mini from 'figlet/importable-fonts/Mini.js'
import script from 'figlet/importable-fonts/Script.js'
import ToolLayout from '../../components/ToolLayout'
figlet.parseFont('Standard', standard)
figlet.parseFont('Small', small)
figlet.parseFont('Big', big)
figlet.parseFont('Slant', slant)
figlet.parseFont('Shadow', shadow)
figlet.parseFont('Block', block)
figlet.parseFont('Banner', banner)
figlet.parseFont('Digital', digital)
figlet.parseFont('Mini', mini)
figlet.parseFont('Script', script)
type AsciiBannerProps = {
  onBack: () => void
}

type Alignment =
  | 'left'
  | 'center'
  | 'right'

const FONTS = [
  'Standard',
  'Small',
  'Big',
  'Slant',
  'Shadow',
  'Block',
  'Banner',
  'Digital',
  'Mini',
  'Script',
] as const

type FontName =
  (typeof FONTS)[number]

const MAX_INPUT_LENGTH = 80

function AsciiBanner({
  onBack,
}: AsciiBannerProps) {
  const [text, setText] =
    useState('Universal Tool')

  const [font, setFont] =
    useState<FontName>('Standard')

  const [alignment, setAlignment] =
    useState<Alignment>('left')

  const [maxWidth, setMaxWidth] =
    useState(80)

  const [banner, setBanner] =
    useState('')

  const [error, setError] =
    useState('')

  const [copied, setCopied] =
    useState(false)

  /* ================================= */
  /* GENERATE ASCII                    */
  /* ================================= */

  useEffect(() => {
    if (!text.trim()) {
      setBanner('')
      setError('')
      setCopied(false)
      return
    }

    try {
      figlet.text(
        text,
        {
          font,
          horizontalLayout:
            'default',
          verticalLayout:
            'default',
        },
        (
          generationError,
          result
        ) => {
          if (
            generationError ||
            !result
          ) {
            setBanner('')
            setError(
              'Could not generate this banner.'
            )

            return
          }

          setBanner(result)
          setError('')
          setCopied(false)
        }
      )
    } catch {
      setBanner('')
      setError(
        'Could not generate this banner.'
      )
    }
  }, [text, font])

  /* ================================= */
  /* BANNER WIDTH                      */
  /* ================================= */

  const bannerWidth =
    useMemo(() => {
      if (!banner) {
        return 0
      }

      return Math.max(
        ...banner
          .split('\n')
          .map(
            (line) => line.length
          )
      )
    }, [banner])

  /* ================================= */
  /* ALIGNMENT                         */
  /* ================================= */

  const formattedBanner =
    useMemo(() => {
      if (!banner) {
        return ''
      }

      return alignBanner(
        banner,
        alignment,
        maxWidth
      )
    }, [
      banner,
      alignment,
      maxWidth,
    ])

  const lineCount =
    formattedBanner
      ? formattedBanner
          .split('\n')
          .length
      : 0

  const exceedsWidth =
    bannerWidth > maxWidth

  /* ================================= */
  /* ACTIONS                           */
  /* ================================= */

  async function copyBanner() {
    if (!formattedBanner) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        formattedBanner
      )

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      setError(
        'Your browser could not copy the banner.'
      )
    }
  }

  function clearBanner() {
    setText('')
    setBanner('')
    setError('')
    setCopied(false)
  }

  return (
    <>
      <Helmet>
        <title>
          ASCII Banner Generator | Universal Tool
        </title>

        <meta
          name="description"
          content="Turn text into ASCII art banners instantly. Choose a font, alignment and width, then copy your banner for terminals, scripts and READMEs."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          property="og:title"
          content="ASCII Banner Generator | Universal Tool"
        />

        <meta
          property="og:description"
          content="Turn text into glorious ASCII art banners instantly."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          name="twitter:title"
          content="ASCII Banner Generator | Universal Tool"
        />

        <meta
          name="twitter:description"
          content="Turn text into glorious ASCII art banners instantly."
        />
      </Helmet>

      <ToolLayout
        icon="A"
        title="ASCII Banner"
        description="Turn boring text into glorious ASCII art."
        status="generated locally"
        onBack={onBack}
      >
        <div className="grid min-w-0 gap-4 lg:grid-cols-[0.75fr_1.25fr]">

          {/* ===================== */}
          {/* CONTROLS              */}
          {/* ===================== */}

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <span className="text-xs font-medium uppercase tracking-wider text-white/30">
              Customize
            </span>

            {/* TEXT */}

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/60">
                  Text
                </label>

                <span className="font-mono text-[10px] text-white/20">
                  {text.length}/
                  {MAX_INPUT_LENGTH}
                </span>
              </div>

              <input
                value={text}
                maxLength={
                  MAX_INPUT_LENGTH
                }
                onChange={(event) =>
                  setText(
                    event.target.value
                  )
                }
                placeholder="Universal Tool"
                autoComplete="off"
                spellCheck={false}
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
              />
            </div>

            {/* FONT */}

            <div className="mt-7">
              <label className="text-sm text-white/60">
                Font
              </label>

              <select
                value={font}
                onChange={(event) =>
                  setFont(
                    event.target
                      .value as FontName
                  )
                }
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#111114] px-4 py-3 text-sm text-white/70 outline-none transition focus:border-violet-400/50"
              >
                {FONTS.map(
                  (fontName) => (
                    <option
                      key={fontName}
                      value={fontName}
                    >
                      {fontName}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* ALIGNMENT */}

            <div className="mt-7">
              <label className="text-sm text-white/60">
                Alignment
              </label>

              <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.07] bg-black/20 p-1">
                <AlignmentButton
                  active={
                    alignment === 'left'
                  }
                  onClick={() =>
                    setAlignment('left')
                  }
                >
                  Left
                </AlignmentButton>

                <AlignmentButton
                  active={
                    alignment ===
                    'center'
                  }
                  onClick={() =>
                    setAlignment(
                      'center'
                    )
                  }
                >
                  Center
                </AlignmentButton>

                <AlignmentButton
                  active={
                    alignment ===
                    'right'
                  }
                  onClick={() =>
                    setAlignment(
                      'right'
                    )
                  }
                >
                  Right
                </AlignmentButton>
              </div>
            </div>

            {/* TERMINAL WIDTH */}

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/60">
                  Terminal width
                </label>

                <span className="font-mono text-sm text-violet-300">
                  {maxWidth} cols
                </span>
              </div>

              <input
                type="range"
                min="40"
                max="160"
                step="10"
                value={maxWidth}
                onChange={(event) =>
                  setMaxWidth(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                className="mt-4 w-full accent-violet-400"
              />

              <div className="mt-2 flex justify-between font-mono text-[10px] text-white/15">
                <span>40</span>
                <span>80</span>
                <span>160</span>
              </div>
            </div>

            {/* WIDTH STATUS */}

            {banner && (
              <div
                className={`mt-7 rounded-xl border px-4 py-3 ${
                  exceedsWidth
                    ? 'border-amber-300/15 bg-amber-300/[0.05]'
                    : 'border-emerald-300/10 bg-emerald-300/[0.03]'
                }`}
              >
                <div
                  className={`text-xs ${
                    exceedsWidth
                      ? 'text-amber-100/60'
                      : 'text-emerald-300/60'
                  }`}
                >
                  {exceedsWidth
                    ? `⚠ Banner is ${bannerWidth} characters wide. It may wrap in a ${maxWidth}-column terminal.`
                    : `✓ Fits inside a ${maxWidth}-column terminal.`}
                </div>
              </div>
            )}

            {/* CLEAR */}

            <button
              type="button"
              onClick={clearBanner}
              disabled={!text}
              className="mt-7 w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            >
              Clear
            </button>
          </div>

          {/* ===================== */}
          {/* PREVIEW               */}
          {/* ===================== */}

          <div className="flex min-h-[560px] min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                Preview
              </span>

              {banner && (
                <span className="font-mono text-[10px] text-white/20">
                  {bannerWidth} cols ·{' '}
                  {lineCount} lines
                </span>
              )}
            </div>

            {/* TERMINAL */}

            <div className="mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-black/30">

              {/* TERMINAL BAR */}

              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                </div>

                <span className="font-mono text-[10px] text-white/15">
                  ASCII
                </span>
              </div>

              {/* TERMINAL CONTENT */}

              <div className="flex min-h-[390px] flex-1 overflow-auto p-5">
                {error ? (
                  <div className="m-auto text-center text-sm text-red-300/70">
                    {error}
                  </div>
                ) : formattedBanner ? (
                  <pre className="m-auto min-w-max whitespace-pre font-mono text-[11px] leading-[1.05] text-violet-200 sm:text-xs lg:text-[13px]">
                    {formattedBanner}
                  </pre>
                ) : (
                  <div className="m-auto text-center">
                    <div className="font-mono text-4xl font-bold text-violet-300/15">
                      A
                    </div>

                    <p className="mt-5 text-white/20">
                      Your masterpiece will
                      <br />
                      appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* METADATA */}

            {banner && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <MetaPill>
                  {font}
                </MetaPill>

                <MetaPill>
                  {bannerWidth} chars wide
                </MetaPill>

                <MetaPill>
                  {lineCount} lines
                </MetaPill>

                <MetaPill>
                  {alignment}
                </MetaPill>
              </div>
            )}

            {/* COPY */}

            <button
              type="button"
              onClick={copyBanner}
              disabled={!formattedBanner}
              className="mt-5 w-full rounded-xl bg-violet-400 px-5 py-3.5 text-sm font-medium text-black transition hover:bg-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
            >
              {copied
                ? 'Copied ✓'
                : 'Copy banner'}
            </button>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-white/20">
              Spaces and line breaks are
              preserved exactly when copied.
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

function AlignmentButton({
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
/* ASCII ALIGNMENT                   */
/* ================================= */

function alignBanner(
  banner: string,
  alignment: Alignment,
  width: number
) {
  const lines =
    banner.split('\n')

  /*
   * Don't truncate ASCII art if it is
   * wider than the selected terminal.
   * We warn the user instead.
   */

  return lines
    .map((line) => {
      if (
        alignment === 'left' ||
        line.length >= width
      ) {
        return line
      }

      const remaining =
        width - line.length

      if (
        alignment === 'center'
      ) {
        return (
          ' '.repeat(
            Math.floor(
              remaining / 2
            )
          ) + line
        )
      }

      return (
        ' '.repeat(remaining) +
        line
      )
    })
    .join('\n')
}

export default AsciiBanner