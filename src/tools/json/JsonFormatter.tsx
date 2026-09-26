import {
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from 'react'

import ToolLayout from '../../components/ToolLayout'
import EditorPanel from '../../components/EditorPanel'
import JsonCodeView from './JsonCodeView'
import { Helmet } from 'react-helmet-async'

type JsonFormatterProps = {
  onBack: () => void
}

type JsonError = {
  message: string
  line?: number
  column?: number
}

type OutputMode = 'pretty' | 'minified'

function JsonFormatter({
  onBack,
}: JsonFormatterProps) {
  const [input, setInput] = useState('')
  const [outputMode, setOutputMode] =
    useState<OutputMode>('pretty')

  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] =
    useState(false)

  const fileInputRef =
    useRef<HTMLInputElement>(null)

  /* ================================= */
  /* PARSE + FORMAT                    */
  /* ================================= */

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        parsed: null,
        output: '',
        prettyOutput: '',
        error: null as JsonError | null,
        valid: false,
      }
    }

    try {
      const parsed =
        JSON.parse(input)

      const prettyOutput =
        JSON.stringify(
          parsed,
          null,
          2
        )

      const minifiedOutput =
        JSON.stringify(parsed)

      return {
        parsed,
        prettyOutput,

        output:
          outputMode === 'pretty'
            ? prettyOutput
            : minifiedOutput,

        error: null,
        valid: true,
      }
    } catch (error) {
      return {
        parsed: null,
        output: '',
        prettyOutput: '',
        error:
          getJsonError(
            error,
            input
          ),
        valid: false,
      }
    }
  }, [input, outputMode])

  /* ================================= */
  /* METADATA                          */
  /* ================================= */

  const metadata = useMemo(() => {
    if (!result.valid) {
      return null
    }

    return getJsonMetadata(
      result.parsed,
      result.output
    )
  }, [
    result.valid,
    result.parsed,
    result.output,
  ])

  /* ================================= */
  /* ACTIONS                           */
  /* ================================= */

  function clearJson() {
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
      setCopied(false)
    }
  }

  function downloadJson() {
    if (!result.output) {
      return
    }

    const blob = new Blob(
      [result.output],
      {
        type: 'application/json',
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url
    link.download =
      'formatted.json'

    link.click()

    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }

  /* ================================= */
  /* DRAG & DROP                       */
  /* ================================= */

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault()

    setIsDragging(true)
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault()

    setIsDragging(false)
  }

  async function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault()

    setIsDragging(false)

    const file =
      event.dataTransfer.files[0]

    if (!file) {
      return
    }

    await loadJsonFile(file)
  }

  async function loadJsonFile(
    file: File
  ) {
    const looksLikeJson =
      file.type ===
        'application/json' ||
      file.name
        .toLowerCase()
        .endsWith('.json')

    if (!looksLikeJson) {
      return
    }

    const text =
      await file.text()

    setInput(text)
    setCopied(false)
  }

  /* ================================= */
  /* UI                                */
  /* ================================= */

  return (
    <>
    <Helmet>
      <title>
        JSON Formatter & Validator | Universal Tool
      </title>

      <meta
        name="description"
        content="Format, validate and beautify JSON instantly in your browser. Find syntax errors with line numbers. Free, fast and private."
      />

      <meta
        name="robots"
        content="index, follow"
      />

      <meta
        property="og:title"
        content="JSON Formatter & Validator | Universal Tool"
      />

      <meta
        property="og:description"
        content="Format, validate and beautify JSON instantly in your browser. Free, fast and private."
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        name="twitter:title"
        content="JSON Formatter & Validator | Universal Tool"
      />

      <meta
        name="twitter:description"
        content="Format, validate and beautify JSON instantly in your browser. Free, fast and private."
      />
    </Helmet>

    <ToolLayout
      icon="{ }"
      title="JSON Formatter"
      description="Format, validate and clean up messy JSON."
      status="processed locally"
      onBack={onBack}
      maxWidth="7xl"
    >
      {/* Validation status */}

      {input.trim() && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 ${
            result.valid
              ? 'border-emerald-400/20 bg-emerald-400/[0.06]'
              : 'border-red-400/20 bg-red-400/[0.06]'
          }`}
        >
          {result.valid ? (
            <div className="flex items-center gap-2 text-sm text-emerald-300">
              <span>●</span>

              <span>
                Valid JSON
              </span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-sm text-red-300">
                <span>●</span>

                <span>
                  Invalid JSON
                </span>
              </div>

              {result.error && (
                <div className="mt-2 font-mono text-xs leading-relaxed text-red-200/60">
                  {result.error.line && (
                    <div>
                      Error around line{' '}

                      <span className="text-red-200">
                        {
                          result.error
                            .line
                        }
                      </span>

                      {result.error
                        .column && (
                        <>
                          , column{' '}

                          <span className="text-red-200">
                            {
                              result
                                .error
                                .column
                            }
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="mt-1">
                    {
                      result.error
                        .message
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================================= */}
      {/* EDITORS                           */}
      {/* ================================= */}

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">

        {/* INPUT */}

        <EditorPanel
          title="Input"
          action={
            <div className="flex items-center gap-4">

              {/* Open file */}

              <button
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="text-xs text-white/30 transition hover:text-violet-300"
              >
                Open file
              </button>

              {/* Clear */}

              <button
                onClick={clearJson}
                disabled={!input}
                className="text-xs text-white/30 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
              >
                Clear
              </button>

              {/* Hidden file input */}

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={async (
                  event
                ) => {
                  const file =
                    event.target
                      .files?.[0]

                  if (file) {
                    await loadJsonFile(
                      file
                    )
                  }

                  event.target.value =
                    ''
                }}
                className="hidden"
              />
            </div>
          }
        >
          <div
            onDragOver={
              handleDragOver
            }
            onDragLeave={
              handleDragLeave
            }
            onDrop={
              handleDrop
            }
            className={`relative min-h-[420px] transition ${
              isDragging
                ? 'bg-violet-400/[0.05]'
                : ''
            }`}
          >
            <div className="flex min-h-[420px]">

              {/* Line numbers */}

              <div className="hidden w-14 shrink-0 select-none border-r border-white/[0.06] bg-white/[0.01] py-5 pr-4 text-right font-mono text-sm leading-6 text-white/20 sm:block">
                {getInputLineNumbers(
                  input
                ).map(
                  (
                    lineNumber
                  ) => (
                    <div
                      key={
                        lineNumber
                      }
                      className={
                        lineNumber ===
                        result.error
                          ?.line
                          ? 'text-red-300'
                          : ''
                      }
                    >
                      {
                        lineNumber
                      }
                    </div>
                  )
                )}
              </div>

              {/* Input */}

              <textarea
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target
                      .value
                  )
                }
                placeholder='Paste something messy... {"hello":"world"}'
                spellCheck={false}
                className="min-h-[420px] flex-1 resize-none bg-transparent p-5 font-mono text-sm leading-6 text-white/80 outline-none placeholder:text-white/20"
              />
            </div>

            {/* Drop overlay */}

            {isDragging && (
              <div className="pointer-events-none absolute inset-3 flex items-center justify-center rounded-xl border border-dashed border-violet-400/40 bg-[#09090b]/90 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-2xl text-violet-300">
                    ↓
                  </div>

                  <div className="mt-2 text-sm text-violet-300">
                    Drop your JSON
                    here
                  </div>

                  <div className="mt-1 text-xs text-white/30">
                    It never leaves
                    your browser.
                  </div>
                </div>
              </div>
            )}
          </div>
        </EditorPanel>

        {/* ================================= */}
        {/* OUTPUT                            */}
        {/* ================================= */}

        <EditorPanel
          title="Formatted"
          action={
            <div className="flex items-center gap-4">

              {/* Copy */}

              <button
                onClick={
                  copyOutput
                }
                disabled={
                  !result.output
                }
                className="text-xs text-white/30 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-20"
              >
                {copied
                  ? 'Copied ✓'
                  : 'Copy'}
              </button>

              {/* Download */}

              <button
                onClick={
                  downloadJson
                }
                disabled={
                  !result.output
                }
                className="text-xs text-white/30 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-20"
              >
                Download
              </button>
            </div>
          }
        >
          <JsonCodeView
            content={
              result.output
            }
            placeholder={
              result.error
                ? 'Fix the JSON to see the formatted result 👀'
                : 'Pretty JSON will appear here ✦'
            }
          />
        </EditorPanel>
      </div>

      {/* ================================= */}
      {/* BOTTOM TOOLBAR                    */}
      {/* ================================= */}

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Pretty / Minified */}

        <div className="inline-flex w-fit rounded-xl border border-white/10 bg-white/[0.025] p-1">
          <button
            onClick={() =>
              setOutputMode(
                'pretty'
              )
            }
            className={`rounded-lg px-4 py-2 text-xs transition ${
              outputMode ===
              'pretty'
                ? 'bg-violet-400/15 text-violet-300'
                : 'text-white/30 hover:text-white'
            }`}
          >
            Pretty
          </button>

          <button
            onClick={() =>
              setOutputMode(
                'minified'
              )
            }
            className={`rounded-lg px-4 py-2 text-xs transition ${
              outputMode ===
              'minified'
                ? 'bg-violet-400/15 text-violet-300'
                : 'text-white/30 hover:text-white'
            }`}
          >
            Minified
          </button>
        </div>

        {/* Metadata */}

        {metadata && (
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-white/25">
            <span>
              {metadata.type}
            </span>

            <span>·</span>

            <span>
              {metadata.lines}{' '}

              {metadata.lines ===
              1
                ? 'line'
                : 'lines'}
            </span>

            <span>·</span>

            <span>
              {metadata.size}
            </span>

            {metadata.count !==
              null && (
              <>
                <span>·</span>

                <span>
                  {
                    metadata.count
                  }{' '}
                  {
                    metadata
                      .countLabel
                  }
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ================================= */}
      {/* PRIVACY NOTE                      */}
      {/* ================================= */}

      <div className="mt-8 text-center text-xs text-white/20">
        Drop a .json file, paste
        JSON or start typing.
        Everything is processed
        locally.
      </div>
    </ToolLayout>
   </>
)
}

/* ================================= */
/* JSON ERROR HANDLING               */
/* ================================= */

function getJsonError(
  error: unknown,
  input: string
): JsonError {
  const fallbackMessage =
    'Something is wrong with this JSON.'

  if (
    !(error instanceof Error)
  ) {
    return {
      message:
        fallbackMessage,
    }
  }

  const message =
    error.message

  /*
   * Chrome / V8 usually gives:
   *
   * "... at position 123"
   */
  const positionMatch =
    message.match(
      /position\s+(\d+)/i
    )

  if (positionMatch) {
    const position =
      Number(
        positionMatch[1]
      )

    return {
      message:
        cleanJsonErrorMessage(
          message
        ),

      ...getLineAndColumn(
        input,
        position
      ),
    }
  }

  /*
   * Firefox / Safari may provide:
   *
   * "... line 4 column 12"
   */
  const lineColumnMatch =
    message.match(
      /line\s+(\d+)\s+column\s+(\d+)/i
    )

  if (
    lineColumnMatch
  ) {
    return {
      message:
        cleanJsonErrorMessage(
          message
        ),

      line:
        Number(
          lineColumnMatch[1]
        ),

      column:
        Number(
          lineColumnMatch[2]
        ),
    }
  }

  /*
   * Some parser messages expose
   * only the line number.
   */
  const lineMatch =
    message.match(
      /line\s+(\d+)/i
    )

  if (lineMatch) {
    return {
      message:
        cleanJsonErrorMessage(
          message
        ),

      line:
        Number(
          lineMatch[1]
        ),
    }
  }

  return {
    message:
      cleanJsonErrorMessage(
        message
      ),
  }
}

/* ================================= */
/* POSITION → LINE / COLUMN          */
/* ================================= */

function getLineAndColumn(
  input: string,
  position: number
) {
  const beforeError =
    input.slice(
      0,
      position
    )

  const lines =
    beforeError.split('\n')

  return {
    line:
      lines.length,

    column:
      lines[
        lines.length - 1
      ].length + 1,
  }
}

/* ================================= */
/* CLEAN ERROR MESSAGE               */
/* ================================= */

function cleanJsonErrorMessage(
  message: string
) {
  return message
    .replace(
      /\s+at\s+position\s+\d+.*$/i,
      ''
    )
    .replace(
      /\s+at\s+line\s+\d+\s+column\s+\d+.*$/i,
      ''
    )
    .trim()
}

/* ================================= */
/* JSON METADATA                     */
/* ================================= */

function getJsonMetadata(
  parsed: unknown,
  output: string
) {
  const lines =
    output.split('\n').length

  const bytes =
    new Blob([
      output,
    ]).size

  const size =
    formatBytes(bytes)

  /* Array */

  if (
    Array.isArray(parsed)
  ) {
    return {
      type: 'Array',
      lines,
      size,

      count:
        parsed.length,

      countLabel:
        parsed.length === 1
          ? 'item'
          : 'items',
    }
  }

  /* Object */

  if (
    parsed !== null &&
    typeof parsed ===
      'object'
  ) {
    const keys =
      Object.keys(
        parsed
      ).length

    return {
      type: 'Object',
      lines,
      size,
      count: keys,

      countLabel:
        keys === 1
          ? 'key'
          : 'keys',
    }
  }

  /* Primitive */

  return {
    type:
      getPrimitiveType(
        parsed
      ),

    lines,
    size,
    count: null,
    countLabel: '',
  }
}

/* ================================= */
/* JSON ROOT TYPE                    */
/* ================================= */

function getPrimitiveType(
  value: unknown
) {
  if (value === null) {
    return 'Null'
  }

  if (
    typeof value ===
    'string'
  ) {
    return 'String'
  }

  if (
    typeof value ===
    'number'
  ) {
    return 'Number'
  }

  if (
    typeof value ===
    'boolean'
  ) {
    return 'Boolean'
  }

  return 'JSON'
}

/* ================================= */
/* BYTES                             */
/* ================================= */

function formatBytes(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const kilobytes =
    bytes / 1024

  if (
    kilobytes < 1024
  ) {
    return `${kilobytes.toFixed(
      1
    )} KB`
  }

  const megabytes =
    kilobytes / 1024

  return `${megabytes.toFixed(
    1
  )} MB`
}

/* ================================= */
/* INPUT LINE NUMBERS                */
/* ================================= */

function getInputLineNumbers(
  input: string
) {
  const lineCount =
    Math.max(
      1,
      input.split('\n')
        .length
    )

  return Array.from(
    {
      length:
        lineCount,
    },

    (_, index) =>
      index + 1
  )
}

export default JsonFormatter