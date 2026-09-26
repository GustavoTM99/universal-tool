import { useMemo, useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import { Helmet } from 'react-helmet-async'

type PasswordGeneratorProps = {
  onBack: () => void
}

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*_-+='

const MIN_RANDOM_CHARACTERS = 12

function PasswordGenerator({
  onBack,
}: PasswordGeneratorProps) {
  const [requiredWord, setRequiredWord] = useState('')
  const [length, setLength] = useState(24)

  const [uppercase, setUppercase] = useState(true)
  const [lowercase, setLowercase] = useState(true)
  const [numbers, setNumbers] = useState(true)
  const [symbols, setSymbols] = useState(true)

  const [password, setPassword] = useState('')
  const [randomCharacterCount, setRandomCharacterCount] =
    useState(0)

  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(true)

  const [lengthAdjusted, setLengthAdjusted] =
    useState(false)

  /* ================================= */
  /* CHARACTER POOL                    */
  /* ================================= */

  const pool = useMemo(() => {
    let characters = ''

    if (uppercase) {
      characters += UPPER
    }

    if (lowercase) {
      characters += LOWER
    }

    if (numbers) {
      characters += NUMBERS
    }

    if (symbols) {
      characters += SYMBOLS
    }

    return characters
  }, [
    uppercase,
    lowercase,
    numbers,
    symbols,
  ])

  /* ================================= */
  /* MINIMUM LENGTH                    */
  /* ================================= */

  const minimumLength = useMemo(() => {
    const wordLength =
      requiredWord.length

    if (!wordLength) {
      return 16
    }

    return (
      wordLength +
      MIN_RANDOM_CHARACTERS
    )
  }, [requiredWord])

  /* ================================= */
  /* STRENGTH                          */
  /* ================================= */

  const strength = useMemo(() => {
    if (
      !password ||
      !pool.length
    ) {
      return null
    }

    /*
     * We deliberately estimate entropy only
     * from the characters generated randomly.
     *
     * The required word is user-provided, so
     * we do NOT pretend it is random.
     */
    const entropy =
      randomCharacterCount *
      Math.log2(pool.length)

    if (entropy >= 100) {
      return {
        label: 'Very strong',
        entropy,
        level: 4,
      }
    }

    if (entropy >= 75) {
      return {
        label: 'Strong',
        entropy,
        level: 3,
      }
    }

    if (entropy >= 50) {
      return {
        label: 'Good',
        entropy,
        level: 2,
      }
    }

    return {
      label: 'Weak',
      entropy,
      level: 1,
    }
  }, [
    password,
    pool.length,
    randomCharacterCount,
  ])

  /* ================================= */
  /* GENERATE                          */
  /* ================================= */

  function generatePassword() {
    if (!pool.length) {
      return
    }

    const word =
      requiredWord

    const selectedGroups = [
      uppercase ? UPPER : '',
      lowercase ? LOWER : '',
      numbers ? NUMBERS : '',
      symbols ? SYMBOLS : '',
    ].filter(Boolean)

    /*
     * Keep enough genuinely random
     * characters even when a required word
     * is being inserted.
     */
    const safeMinimum =
      word.length > 0
        ? word.length +
          MIN_RANDOM_CHARACTERS
        : 16

    const finalLength =
      Math.max(
        length,
        safeMinimum,
        word.length +
          selectedGroups.length
      )

    setLengthAdjusted(
      finalLength !== length
    )

    if (
      finalLength !== length
    ) {
      setLength(finalLength)
    }

    const randomLength =
      finalLength -
      word.length

    /*
     * Guarantee at least one character
     * from every enabled group.
     */
    const guaranteed =
      selectedGroups.map(
        (group) =>
          randomCharacter(group)
      )

    const remainingLength =
      randomLength -
      guaranteed.length

    const remaining =
      generateRandomString(
        Math.max(
          0,
          remainingLength
        ),
        pool
      )

    /*
     * Mix guaranteed and remaining random
     * characters using a secure shuffle.
     */
    const randomPart =
      shuffle([
        ...guaranteed,
        ...remaining,
      ]).join('')

    let generated: string

    /*
     * No required word:
     * the entire password is random.
     */
    if (!word) {
      generated =
        randomPart
    } else {
      /*
       * Required word stays completely intact.
       *
       * Its position is randomized so it does
       * not always appear in the same place.
       */
      const placement =
        secureRandomInt(3)

      if (placement === 0) {
        generated =
          word +
          randomPart
      } else if (
        placement === 1
      ) {
        const splitPoint =
          secureRandomInt(
            randomPart.length +
              1
          )

        generated =
          randomPart.slice(
            0,
            splitPoint
          ) +
          word +
          randomPart.slice(
            splitPoint
          )
      } else {
        generated =
          randomPart +
          word
      }
    }

    setPassword(generated)

    setRandomCharacterCount(
      randomLength
    )

    setCopied(false)
    setVisible(true)
  }

  function regeneratePassword() {
    generatePassword()
  }

  /* ================================= */
  /* COPY                              */
  /* ================================= */

  async function copyPassword() {
    if (!password) {
      return
    }

    try {
      await navigator.clipboard.writeText(
        password
      )

      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      setCopied(false)
    }
  }

  /* ================================= */
  /* CLEAR                             */
  /* ================================= */

  function clearPassword() {
    setPassword('')
    setCopied(false)
    setLengthAdjusted(false)
    setRandomCharacterCount(0)
  }

  /* ================================= */
  /* OPTIONS                           */
  /* ================================= */

  function toggleOption(
    option:
      | 'uppercase'
      | 'lowercase'
      | 'numbers'
      | 'symbols'
  ) {
    const enabledCount = [
      uppercase,
      lowercase,
      numbers,
      symbols,
    ].filter(Boolean).length

    const currentOptions = {
      uppercase,
      lowercase,
      numbers,
      symbols,
    }

    const isCurrentlyEnabled =
      currentOptions[option]

    /*
     * Never allow every group to be
     * disabled simultaneously.
     */
    if (
      isCurrentlyEnabled &&
      enabledCount === 1
    ) {
      return
    }

    if (
      option === 'uppercase'
    ) {
      setUppercase(
        !uppercase
      )
    }

    if (
      option === 'lowercase'
    ) {
      setLowercase(
        !lowercase
      )
    }

    if (
      option === 'numbers'
    ) {
      setNumbers(
        !numbers
      )
    }

    if (
      option === 'symbols'
    ) {
      setSymbols(
        !symbols
      )
    }

    clearPassword()
  }

  /* ================================= */
  /* METADATA                          */
  /* ================================= */

  const passwordMetadata =
    getPasswordMetadata({
      uppercase,
      lowercase,
      numbers,
      symbols,
      length:
        password.length,
    })

  /* ================================= */
  /* UI                                */
  /* ================================= */

  return (
    <>
    <Helmet>
      <title>
        Secure Password Generator | Universal Tool
      </title>

      <meta
        name="description"
        content="Generate strong, secure and customizable passwords instantly in your browser. Free, private and processed entirely on your device."
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <meta
        property="og:title"
        content="Secure Password Generator | Universal Tool"
      />

      <meta
        property="og:description"
        content="Generate strong, secure and customizable passwords instantly in your browser. Free, private and processed entirely on your device."
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        name="twitter:title"
        content="Secure Password Generator | Universal Tool"
      />

      <meta
        name="twitter:description"
        content="Generate strong, secure and customizable passwords instantly in your browser. Free, private and processed entirely on your device."
      />
    </Helmet>
    <ToolLayout
      icon="✦"
      title="Password Generator"
      description="Generate strong passwords without sending anything anywhere."
      status="generated locally"
      onBack={onBack}
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_1.25fr]">

        {/* ================================= */}
        {/* CONTROLS                          */}
        {/* ================================= */}

        <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          {/* Required word */}

          <div>
            <label className="text-sm text-white/60">
              Required word

              <span className="ml-2 text-white/25">
                optional
              </span>
            </label>

            <input
              value={requiredWord}
              onChange={(event) => {
                setRequiredWord(
                  event.target.value
                )

                clearPassword()
              }}
              placeholder="e.g. mantequilla"
              autoComplete="off"
              spellCheck={false}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-white/20 focus:border-violet-400/50"
            />

            <p className="mt-2 text-xs leading-relaxed text-white/25">
              It will appear exactly as
              written inside the password.
            </p>
          </div>

          {/* Length */}

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-white/60">
                Length
              </label>

              <input
                type="number"
                min="16"
                max="128"
                value={length}
                onChange={(event) => {
                  const value =
                    Number(
                      event.target.value
                    )

                  if (
                    Number.isNaN(
                      value
                    )
                  ) {
                    return
                  }

                  setLength(
                    Math.min(
                      128,
                      Math.max(
                        16,
                        value
                      )
                    )
                  )

                  clearPassword()
                }}
                className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-center font-mono text-sm text-violet-300 outline-none transition focus:border-violet-400/50"
              />
            </div>

            <input
              type="range"
              min="16"
              max="64"
              value={Math.min(
                length,
                64
              )}
              onChange={(event) => {
                setLength(
                  Number(
                    event.target
                      .value
                  )
                )

                clearPassword()
              }}
              className="mt-4 w-full accent-violet-400"
            />

            <div className="mt-2 flex justify-between font-mono text-[10px] text-white/15">
              <span>16</span>
              <span>64</span>
            </div>

            {requiredWord &&
              minimumLength >
                16 && (
                <p className="mt-3 text-xs text-white/25">
                  Minimum recommended
                  length with this
                  word:{' '}

                  <span className="font-mono text-violet-300/70">
                    {minimumLength}
                  </span>
                </p>
              )}
          </div>

          {/* Include */}

          <div className="mt-8">
            <p className="text-sm text-white/60">
              Include
            </p>

            <p className="mt-1 text-xs leading-relaxed text-white/25">
              Choose which character
              types can appear in your
              password.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Option
                label="ABC"
                description="Uppercase"
                enabled={uppercase}
                onClick={() =>
                  toggleOption(
                    'uppercase'
                  )
                }
              />

              <Option
                label="abc"
                description="Lowercase"
                enabled={lowercase}
                onClick={() =>
                  toggleOption(
                    'lowercase'
                  )
                }
              />

              <Option
                label="123"
                description="Numbers"
                enabled={numbers}
                onClick={() =>
                  toggleOption(
                    'numbers'
                  )
                }
              />

              <Option
                label="#$!"
                description="Symbols"
                enabled={symbols}
                onClick={() =>
                  toggleOption(
                    'symbols'
                  )
                }
              />
            </div>
          </div>

          {/* Generate */}

          <button
            onClick={
              generatePassword
            }
            className="mt-8 w-full rounded-xl bg-violet-400 px-5 py-3 font-medium text-black transition duration-200 hover:bg-violet-300 active:scale-[0.99]"
          >
            Generate password ✦
          </button>
        </div>

        {/* ================================= */}
        {/* RESULT                            */}
        {/* ================================= */}

        <div className=" min-w-0 flex min-h-[520px] flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          {/* Result header */}

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-white/30">
              Your password
            </span>

            {password && (
              <span className="text-xs text-emerald-400/70">
                ● Ready
              </span>
            )}
          </div>

          {/* Main result */}

          <div className="flex flex-1 flex-col justify-center py-8">
            {password ? (
              <>
                {/* Password display */}

                <div className="min-w-0 relative rounded-2xl border border-white/[0.07] bg-black/20 p-6">
                  <div
                    className={`break-all pr-10 text-center font-mono text-xl leading-relaxed transition sm:text-2xl ${
                      visible
                        ? 'text-violet-100'
                        : 'select-none tracking-[0.15em] text-white/40 blur-[6px]'
                    }`}
                  >
                    {visible
                      ? password
                      : '•'.repeat(
                          Math.min(
                            password.length,
                            32
                          )
                        )}
                  </div>

                  {/* Show / Hide */}

                  <button
                    onClick={() =>
                      setVisible(
                        !visible
                      )
                    }
                    title={
                      visible
                        ? 'Hide password'
                        : 'Show password'
                    }
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-sm text-white/30 transition hover:bg-white/5 hover:text-white"
                  >
                    {visible
                      ? '◉'
                      : '○'}
                  </button>
                </div>

                {/* Strength */}

                {strength && (
                  <div className="mt-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-white/25">
                          Strength
                        </div>

                        <div className="mt-1 text-sm font-medium text-white/70">
                          {
                            strength.label
                          }
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-xs text-white/25">
                          ~
                          {Math.round(
                            strength.entropy
                          )}{' '}
                          bits
                        </div>

                        <div className="mt-1 text-[10px] text-white/15">
                          estimated random
                          entropy
                        </div>
                      </div>
                    </div>

                    <StrengthBar
                      level={
                        strength.level
                      }
                    />
                  </div>
                )}

                {/* Metadata */}

                <div className="mt-6 flex flex-wrap gap-2">
                  {passwordMetadata.map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/30"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>

                {/* Length warning */}

                {lengthAdjusted && (
                  <div className="mt-6 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3 text-xs leading-relaxed text-amber-100/60">
                    ✦ Length increased
                    automatically to keep
                    enough random
                    characters around your
                    required word.
                  </div>
                )}

                {/* Security information */}

                <div className="mt-6 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] px-4 py-3">
                  <div className="text-xs text-emerald-300/70">
                    Cryptographically random
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-white/25">
                    Generated with your
                    browser&apos;s
                    cryptographic random
                    number generator.
                    Nothing is stored or
                    sent anywhere.
                  </p>
                </div>
              </>
            ) : (
              /* Empty state */

              <div className="text-center">
                <div className="text-3xl text-violet-300/20">
                  ✦
                </div>

                <div className="mt-4 text-white/20">
                  Your shiny new password
                  <br />
                  will appear here.
                </div>
              </div>
            )}
          </div>

          {/* Actions */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={
                regeneratePassword
              }
              disabled={!password}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/60 transition hover:border-violet-400/40 hover:text-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
            >
              ↻ Regenerate
            </button>

            <button
              onClick={
                copyPassword
              }
              disabled={!password}
              className="rounded-xl bg-violet-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
            >
              {copied
                ? 'Copied ✓'
                : 'Copy password'}
            </button>
          </div>

          {/* Clear */}

          {password && (
            <button
              onClick={
                clearPassword
              }
              className="mt-3 text-xs text-white/20 transition hover:text-white/50"
            >
              Clear password
            </button>
          )}
        </div>
      </div>
    </ToolLayout>
  </>
)
}

/* ================================= */
/* OPTION                            */
/* ================================= */

function Option({
  label,
  description,
  enabled,
  onClick,
}: {
  label: string
  description: string
  enabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition duration-200 ${
        enabled
          ? 'border-violet-400/30 bg-violet-400/10'
          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
      }`}
    >
      <div
        className={`font-mono text-sm ${
          enabled
            ? 'text-violet-300'
            : 'text-white/30'
        }`}
      >
        {label}
      </div>

      <div
        className={`mt-1 text-xs ${
          enabled
            ? 'text-white/50'
            : 'text-white/20'
        }`}
      >
        {description}
      </div>
    </button>
  )
}

/* ================================= */
/* STRENGTH BAR                      */
/* ================================= */

function StrengthBar({
  level,
}: {
  level: number
}) {
  return (
    <div className="mt-3 grid grid-cols-4 gap-1.5">
      {[1, 2, 3, 4].map(
        (segment) => (
          <div
            key={segment}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              segment <= level
                ? 'bg-violet-400'
                : 'bg-white/[0.06]'
            }`}
          />
        )
      )}
    </div>
  )
}

/* ================================= */
/* SECURE RANDOM                     */
/* ================================= */

function secureRandomInt(
  max: number
) {
  if (
    !Number.isSafeInteger(
      max
    ) ||
    max <= 0
  ) {
    throw new Error(
      'max must be a positive safe integer'
    )
  }

  /*
   * Uint32 gives us:
   *
   * 0 → 4,294,967,295
   *
   * Rejection sampling prevents
   * modulo bias.
   */
  const range =
    0x100000000

  const limit =
    range -
    (range % max)

  const array =
    new Uint32Array(1)

  let value: number

  do {
    crypto.getRandomValues(
      array
    )

    value =
      array[0]
  } while (
    value >= limit
  )

  return value % max
}

function randomCharacter(
  characters: string
) {
  return characters[
    secureRandomInt(
      characters.length
    )
  ]
}

function generateRandomString(
  length: number,
  characters: string
) {
  let result = ''

  for (
    let index = 0;
    index < length;
    index++
  ) {
    result +=
      randomCharacter(
        characters
      )
  }

  return result
}

/* ================================= */
/* SECURE SHUFFLE                    */
/* ================================= */

function shuffle<T>(
  values: T[]
) {
  const result =
    [...values]

  /*
   * Fisher-Yates using our
   * cryptographic RNG.
   */
  for (
    let index =
      result.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex =
      secureRandomInt(
        index + 1
      )

    ;[
      result[index],
      result[randomIndex],
    ] = [
      result[randomIndex],
      result[index],
    ]
  }

  return result
}

/* ================================= */
/* METADATA                          */
/* ================================= */

function getPasswordMetadata({
  uppercase,
  lowercase,
  numbers,
  symbols,
  length,
}: {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  length: number
}) {
  if (!length) {
    return []
  }

  const metadata = [
    `${length} chars`,
  ]

  if (uppercase) {
    metadata.push('ABC')
  }

  if (lowercase) {
    metadata.push('abc')
  }

  if (numbers) {
    metadata.push('123')
  }

  if (symbols) {
    metadata.push('#$!')
  }

  return metadata
}

export default PasswordGenerator