import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ToolLayout from '../../components/ToolLayout'

type Base64ToolProps = {
  onBack: () => void
}

type Mode = 'encode' | 'decode'

function Base64Tool({
  onBack,
}: Base64ToolProps) {
  const [mode, setMode] =
    useState<Mode>('encode')

  const [input, setInput] =
    useState('')

  const [copied, setCopied] =
    useState(false)

  const result = useMemo(() => {
    if (!input) {
      return {
        output: '',
        error: '',
      }
    }

    try {
      if (mode === 'encode') {
        return {
          output: encodeBase64(input),
          error: '',
        }
      }

      return {
        output: decodeBase64(input),
        error: '',
      }
    } catch {
      return {
        output: '',
        error:
          'Invalid Base64. Check the input and try again.',
      }
    }
  }, [input, mode])

  function changeMode(
    newMode: Mode
  ) {
    if (newMode === mode) {
      return
    }

    setMode(newMode)
    setInput('')
    setCopied(false)
  }

  function clear() {
    setInput('')
    setCopied(false)
  }

  async function copyOutput() {
    if (!result.output) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        result.output
      )

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      // Clipboard unavailable.
    }
  }

  function useOutput() {
    if (!result.output) {
      return
    }

    const nextMode =
      mode === 'encode'
        ? 'decode'
        : 'encode'

    setInput(result.output)
    setMode(nextMode)
    setCopied(false)
  }

  return (
    <>
      <Helmet>
        <title>
          Base64 Encoder & Decoder | Universal Tool
        </title>

        <meta
          name="description"
          content="Encode text to Base64 or decode Base64 instantly. Fast, private and processed entirely in your browser."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          property="og:title"
          content="Base64 Encoder & Decoder | Universal Tool"
        />

        <meta
          property="og:description"
          content="Encode and decode Base64 instantly and privately in your browser."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          name="twitter:title"
          content="Base64 Encoder & Decoder | Universal Tool"
        />

        <meta
          name="twitter:description"
          content="Encode and decode Base64 instantly and privately in your browser."
        />
      </Helmet>

      <ToolLayout
        icon="64"
        title="Base64 Encoder / Decoder"
        description="Encode text to Base64 or decode Base64 back to readable text."
        status="processed locally"
        onBack={onBack}
      >
        <div className="grid min-w-0 gap-4 lg:grid-cols-2">

          {/* Input */}

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                Input
              </span>

              <span className="font-mono text-[10px] text-white/20">
                {input.length}{' '}
                {input.length === 1
                  ? 'character'
                  : 'characters'}
              </span>
            </div>

            {/* Mode selector */}

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.07] bg-black/20 p-1">
              <ModeButton
                active={
                  mode === 'encode'
                }
                onClick={() =>
                  changeMode('encode')
                }
              >
                Encode
              </ModeButton>

              <ModeButton
                active={
                  mode === 'decode'
                }
                onClick={() =>
                  changeMode('decode')
                }
              >
                Decode
              </ModeButton>
            </div>

            {/* Input textarea */}

            <div className="mt-6">
              <label className="text-sm text-white/60">
                {mode === 'encode'
                  ? 'Text'
                  : 'Base64'}
              </label>

              <textarea
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                placeholder={
                  mode === 'encode'
                    ? 'Write or paste anything...'
                    : 'Paste Base64 here...'
                }
                spellCheck={false}
                className={`mt-3 min-h-[340px] w-full resize-none rounded-xl border bg-white/5 px-4 py-3 font-mono text-sm leading-relaxed outline-none transition placeholder:text-white/20 ${
                  result.error
                    ? 'border-red-400/40 focus:border-red-400/60'
                    : 'border-white/10 focus:border-violet-400/50'
                }`}
              />

              {result.error && (
                <div className="mt-3 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-xs leading-relaxed text-red-300/70">
                  {result.error}
                </div>
              )}
            </div>

            {/* Clear */}

            <button
              type="button"
              onClick={clear}
              disabled={!input}
              className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
            >
              Clear
            </button>
          </div>

          {/* Output */}

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                Output
              </span>

              <span className="font-mono text-[10px] text-white/20">
                {result.output.length}{' '}
                {result.output.length === 1
                  ? 'character'
                  : 'characters'}
              </span>
            </div>

            <div className="mt-5">
              <label className="text-sm text-white/60">
                {mode === 'encode'
                  ? 'Base64'
                  : 'Decoded text'}
              </label>

              <textarea
                value={result.output}
                readOnly
                placeholder={
                  mode === 'encode'
                    ? 'Encoded Base64 will appear here...'
                    : 'Decoded text will appear here...'
                }
                spellCheck={false}
                className="mt-3 min-h-[340px] w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-mono text-sm leading-relaxed text-white/70 outline-none placeholder:text-white/15"
              />
            </div>

            {/* Actions */}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={copyOutput}
                disabled={!result.output}
                className="rounded-xl bg-violet-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
              >
                {copied
                  ? 'Copied ✓'
                  : 'Copy output'}
              </button>

              <button
                type="button"
                onClick={useOutput}
                disabled={!result.output}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/60 transition hover:border-violet-400/40 hover:text-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
              >
                Use output ⇄
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-white/20">
              Nothing is uploaded. Everything
              is processed entirely in this
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

function ModeButton({
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

/* ================================= */
/* BASE64                            */
/* ================================= */

function encodeBase64(
  value: string
) {
  const bytes =
    new TextEncoder().encode(value)

  let binary = ''

  for (const byte of bytes) {
    binary +=
      String.fromCharCode(byte)
  }

  return btoa(binary)
}

function decodeBase64(
  value: string
) {
  const normalized = value
    .trim()
    .replace(/\s+/g, '')

  if (!normalized) {
    return ''
  }

  /*
   * Accept standard padded Base64.
   * Padding is restored when omitted.
   */

  if (
    !/^[A-Za-z0-9+/]*={0,2}$/.test(
      normalized
    )
  ) {
    throw new Error(
      'Invalid Base64'
    )
  }

  const withoutPadding =
    normalized.replace(/=+$/, '')

  if (
    withoutPadding.length % 4 === 1
  ) {
    throw new Error(
      'Invalid Base64'
    )
  }

  const padded =
    withoutPadding.padEnd(
      Math.ceil(
        withoutPadding.length / 4
      ) * 4,
      '='
    )

  const binary = atob(padded)

  const bytes =
    Uint8Array.from(
      binary,
      (character) =>
        character.charCodeAt(0)
    )

  return new TextDecoder(
    'utf-8',
    {
      fatal: true,
    }
  ).decode(bytes)
}

export default Base64Tool