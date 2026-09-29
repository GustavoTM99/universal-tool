import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ToolLayout from '../../components/ToolLayout'

type RandomPickerProps = {
  onBack: () => void
}

const PICKING_MESSAGES = [
  'Consulting the universe...',
  'Asking absolutely nobody...',
  'Making a very serious decision...',
  'Trusting the chaos...',
  'Definitely not biased...',
  'Letting fate cook...',
]

function RandomPicker({
  onBack,
}: RandomPickerProps) {
  const [input, setInput] = useState('')
  const [winner, setWinner] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [isPicking, setIsPicking] = useState(false)

  const [rollingOption, setRollingOption] =
    useState('')

  const [pickingMessage, setPickingMessage] =
    useState('')

  const options = useMemo(() => {
    return input
      .split('\n')
      .map((option) => option.trim())
      .filter(Boolean)
  }, [input])

  const uniqueOptions = useMemo(() => {
    return Array.from(new Set(options))
  }, [options])

  const duplicateCount =
    options.length - uniqueOptions.length

  function pickRandom() {
    if (
      uniqueOptions.length < 2 ||
      isPicking
    ) {
      return
    }

    setIsPicking(true)
    setWinner('')

    const finalIndex =
      cryptoRandomIndex(
        uniqueOptions.length
      )

    const selected =
      uniqueOptions[finalIndex]

    setRollingOption(
      uniqueOptions[
        cryptoRandomIndex(
          uniqueOptions.length
        )
      ]
    )

    setPickingMessage(
      PICKING_MESSAGES[
        cryptoRandomIndex(
          PICKING_MESSAGES.length
        )
      ]
    )

    /*
     * Cycle through real options for one
     * second before revealing the winner.
     */

    let ticks = 0

    const interval =
      window.setInterval(() => {
        const randomIndex =
          cryptoRandomIndex(
            uniqueOptions.length
          )

        setRollingOption(
          uniqueOptions[randomIndex]
        )

        /*
         * Change the silly message
         * every few ticks.
         */

        if (ticks % 3 === 0) {
          const messageIndex =
            cryptoRandomIndex(
              PICKING_MESSAGES.length
            )

          setPickingMessage(
            PICKING_MESSAGES[
              messageIndex
            ]
          )
        }

        ticks++
      }, 90)

    window.setTimeout(() => {
      window.clearInterval(interval)

      setRollingOption(selected)
      setWinner(selected)

      setHistory((current) => [
        selected,
        ...current,
      ].slice(0, 5))

      setIsPicking(false)
    }, 2000)
  }

  function removeWinner() {
    if (!winner) {
      return
    }

    const remaining =
      options.filter(
        (option) => option !== winner
      )

    setInput(remaining.join('\n'))
    setWinner('')
    setRollingOption('')
    setPickingMessage('')
  }

  function shuffleOptions() {
    if (uniqueOptions.length < 2) {
      return
    }

    const shuffled = [
      ...uniqueOptions,
    ]

    for (
      let index =
        shuffled.length - 1;
      index > 0;
      index--
    ) {
      const randomIndex =
        cryptoRandomIndex(index + 1)

      ;[
        shuffled[index],
        shuffled[randomIndex],
      ] = [
        shuffled[randomIndex],
        shuffled[index],
      ]
    }

    setInput(shuffled.join('\n'))
    setWinner('')
    setRollingOption('')
    setPickingMessage('')
  }

  function clearAll() {
    setInput('')
    setWinner('')
    setHistory([])
    setRollingOption('')
    setPickingMessage('')
  }

  return (
    <>
      <Helmet>
        <title>
          Random Picker | Universal Tool
        </title>

        <meta
          name="description"
          content="Pick a random name, item or option instantly. Paste your choices and let Universal Tool decide for you."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          property="og:title"
          content="Random Picker | Universal Tool"
        />

        <meta
          property="og:description"
          content="Can't decide? Add your options and pick one randomly in seconds."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          name="twitter:title"
          content="Random Picker | Universal Tool"
        />

        <meta
          name="twitter:description"
          content="Can't decide? Add your options and pick one randomly in seconds."
        />
      </Helmet>

      <ToolLayout
        icon="✦"
        title="Random Picker"
        description="Can't decide? Add your options and let randomness do the work."
        status="runs locally"
        onBack={onBack}
      >
        <div className="grid min-w-0 gap-4 lg:grid-cols-[0.9fr_1.1fr]">

          {/* OPTIONS */}

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                Options
              </span>

              <span className="font-mono text-[10px] text-white/20">
                {uniqueOptions.length}{' '}
                {uniqueOptions.length === 1
                  ? 'option'
                  : 'options'}
              </span>
            </div>

            <div className="mt-6">
              <label className="text-sm text-white/60">
                One option per line
              </label>

              <textarea
                value={input}
                onChange={(event) => {
                  setInput(
                    event.target.value
                  )

                  setWinner('')
                  setRollingOption('')
                  setPickingMessage('')
                }}
                placeholder={`Pizza\nSushi\nTacos\nBurgers`}
                spellCheck={false}
                className="mt-3 min-h-[360px] w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-white/15 focus:border-violet-400/50"
              />

              {duplicateCount > 0 && (
                <div className="mt-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3 text-xs text-amber-100/50">
                  {duplicateCount}{' '}
                  duplicate
                  {duplicateCount === 1
                    ? ''
                    : 's'}{' '}
                  ignored.
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={shuffleOptions}
                disabled={
                  uniqueOptions.length < 2 ||
                  isPicking
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50 transition hover:border-violet-400/30 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-20"
              >
                Shuffle
              </button>

              <button
                type="button"
                onClick={clearAll}
                disabled={
                  !input ||
                  isPicking
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
              >
                Clear
              </button>
            </div>
          </div>

          {/* RESULT */}

          <div className="flex min-h-[520px] min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/30">
                Result
              </span>

              {winner && !isPicking && (
                <span className="text-xs text-emerald-400/70">
                  ● Selected
                </span>
              )}

              {isPicking && (
                <span className="text-xs text-violet-300/50">
                  ● Chaos in progress
                </span>
              )}
            </div>

            <div className="flex flex-1 items-center justify-center py-10">

              {/* PICKING ANIMATION */}

              {isPicking ? (
                <div className="w-full text-center">
                  <div className="text-3xl text-violet-300">
                    ✦
                  </div>

                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-violet-300/40">
                    {pickingMessage ||
                      'Letting fate cook...'}
                  </p>

                  <div
                    key={rollingOption}
                    className="mx-auto mt-6 max-w-lg animate-pulse break-words text-4xl font-semibold tracking-tight text-white/80 sm:text-5xl"
                  >
                    {rollingOption}
                  </div>

                  <p className="mt-5 text-xs text-white/20">
                    Hold on, this is very
                    scientific.
                  </p>
                </div>
              ) : winner ? (

                /* WINNER */

                <div className="w-full text-center">
                  <div className="text-2xl text-violet-300">
                    ✦
                  </div>

                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-violet-300/50">
                    The universe chose
                  </p>

                  <div className="mx-auto mt-5 max-w-lg break-words text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {winner}
                  </div>

                  <p className="mt-5 text-xs text-white/25">
                    Highly scientific.
                    Probably.
                  </p>

                  <p className="mt-2 text-[10px] text-white/15">
                    Out of{' '}
                    {uniqueOptions.length}{' '}
                    possible options
                  </p>
                </div>
              ) : (

                /* EMPTY */

                <div className="text-center">
                  <div className="text-5xl text-violet-300/20">
                    ✦
                  </div>

                  <p className="mt-5 text-white/20">
                    Your winner will magically
                    <br />
                    appear here.
                  </p>

                  <p className="mt-3 text-xs text-white/10">
                    Add at least two options
                    to begin.
                  </p>
                </div>
              )}
            </div>

            {/* PICK */}

            <button
              type="button"
              onClick={pickRandom}
              disabled={
                uniqueOptions.length < 2 ||
                isPicking
              }
              className="w-full rounded-xl bg-violet-400 px-5 py-3.5 text-sm font-medium text-black transition hover:bg-violet-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-20"
            >
              {isPicking
                ? 'Fate is cooking...'
                : winner
                  ? 'Pick again'
                  : 'Pick one'}
            </button>

            {/* REMOVE WINNER */}

            {winner && !isPicking && (
              <button
                type="button"
                onClick={removeWinner}
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/50 transition hover:border-violet-400/40 hover:text-violet-300"
              >
                Remove winner & continue
              </button>
            )}

            {/* HISTORY */}

            {history.length > 1 &&
              !isPicking && (
                <div className="mt-6 border-t border-white/[0.07] pt-5">
                  <p className="text-xs uppercase tracking-wider text-white/20">
                    Recent picks
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {history.map(
                      (
                        item,
                        index
                      ) => (
                        <span
                          key={`${item}-${index}`}
                          className="max-w-full truncate rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-white/30"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            <p className="mt-4 text-center text-[11px] leading-relaxed text-white/20">
              Picks are generated locally
              using your browser's secure
              random number generator.
            </p>
          </div>
        </div>
      </ToolLayout>
    </>
  )
}

/* ================================= */
/* RANDOM                            */
/* ================================= */

function cryptoRandomIndex(
  max: number
) {
  if (max <= 0) {
    return 0
  }

  /*
   * Rejection sampling avoids modulo bias.
   */

  const range =
    0x100000000

  const limit =
    range - (range % max)

  const values =
    new Uint32Array(1)

  let value = 0

  do {
    crypto.getRandomValues(values)
    value = values[0]
  } while (value >= limit)

  return value % max
}

export default RandomPicker