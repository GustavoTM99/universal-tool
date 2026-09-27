import { useMemo, useRef, useState, type DragEvent } from 'react'
import { Helmet } from 'react-helmet-async'

import ToolLayout from '../../components/ToolLayout'
import EditorPanel from '../../components/EditorPanel'
import XmlCodeView from './XmlCodeView'

type XmlFormatterProps = {
  onBack: () => void
}

type OutputMode = 'pretty' | 'minified'

type XmlError = {
  message: string
  line?: number
  column?: number
}

function XmlFormatter({
  onBack,
}: XmlFormatterProps) {
  const [input, setInput] = useState('')
  const [outputMode, setOutputMode] =
    useState<OutputMode>('pretty')

  const [copied, setCopied] =
    useState(false)

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
        output: '',
        error: null as XmlError | null,
        valid: false,
      }
    }

    const parsed = parseXml(input)

    if (!parsed.valid) {
      return {
        output: '',
        error: parsed.error,
        valid: false,
      }
    }

    const output =
      outputMode === 'pretty'
        ? formatXml(input)
        : minifyXml(input)

    return {
      output,
      error: null,
      valid: true,
    }
  }, [input, outputMode])

  /* ================================= */
  /* ACTIONS                           */
  /* ================================= */

  function clearXml() {
    setInput('')
    setCopied(false)
  }

  async function copyOutput() {
    if (!result.output) return

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

  function downloadXml() {
    if (!result.output) return

    const blob = new Blob(
      [result.output],
      {
        type: 'application/xml',
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url
    link.download = 'formatted.xml'

    link.click()

    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)
  }

  /* ================================= */
  /* FILES                             */
  /* ================================= */

  async function loadXmlFile(
    file: File
  ) {
    const looksLikeXml =
      file.type === 'application/xml' ||
      file.type === 'text/xml' ||
      file.name
        .toLowerCase()
        .endsWith('.xml')

    if (!looksLikeXml) return

    const text =
      await file.text()

    setInput(text)
    setCopied(false)
  }

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

    if (!file) return

    await loadXmlFile(file)
  }

  /* ================================= */
  /* UI                                */
  /* ================================= */

  return (
    <>
      <Helmet>
        <title>
          XML Formatter & Validator | Universal Tool
        </title>

        <meta
          name="description"
          content="Format, validate and minify XML instantly in your browser. Free, fast and private."
        />

        <meta
          name="robots"
          content="index, follow"
        />
      </Helmet>

      <ToolLayout
        icon="&lt;/&gt;"
        title="XML Formatter"
        description="Format, validate and clean up messy XML."
        status="processed locally"
        onBack={onBack}
        maxWidth="7xl"
      >
        {/* Validation */}

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
                <span>Valid XML</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-red-300">
                  <span>●</span>
                  <span>Invalid XML</span>
                </div>

                {result.error && (
                  <div className="mt-2 font-mono text-xs leading-relaxed text-red-200/60">
                    {result.error.line && (
                      <div>
                        Error around line{' '}
                        <span className="text-red-200">
                          {result.error.line}
                        </span>

                        {result.error.column && (
                          <>
                            , column{' '}
                            <span className="text-red-200">
                              {result.error.column}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <div className="mt-1">
                      {result.error.message}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Editors */}

        <div className="grid min-w-0 gap-4 lg:grid-cols-2">

          {/* INPUT */}

          <EditorPanel
            title="Input"
            action={
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="text-xs text-white/30 transition hover:text-violet-300"
                >
                  Open file
                </button>

                <button
                  onClick={clearXml}
                  disabled={!input}
                  className="text-xs text-white/30 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                >
                  Clear
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml,application/xml,text/xml"
                  onChange={async (
                    event
                  ) => {
                    const file =
                      event.target.files?.[0]

                    if (file) {
                      await loadXmlFile(file)
                    }

                    event.target.value = ''
                  }}
                  className="hidden"
                />
              </div>
            }
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative min-h-[420px] transition ${
                isDragging
                  ? 'bg-violet-400/[0.05]'
                  : ''
              }`}
            >
              <textarea
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }
                placeholder='<root><hello>world</hello></root>'
                spellCheck={false}
                className="min-h-[420px] w-full resize-none bg-transparent p-5 font-mono text-sm leading-6 text-white/80 outline-none placeholder:text-white/20"
              />

              {isDragging && (
                <div className="pointer-events-none absolute inset-3 flex items-center justify-center rounded-xl border border-dashed border-violet-400/40 bg-[#09090b]/90 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl text-violet-300">
                      ↓
                    </div>

                    <div className="mt-2 text-sm text-violet-300">
                      Drop your XML here
                    </div>

                    <div className="mt-1 text-xs text-white/30">
                      It never leaves your browser.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </EditorPanel>

          {/* OUTPUT */}

          <EditorPanel
            title="Formatted"
            action={
              <div className="flex items-center gap-4">
                <button
                  onClick={copyOutput}
                  disabled={!result.output}
                  className="text-xs text-white/30 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  {copied
                    ? 'Copied ✓'
                    : 'Copy'}
                </button>

                <button
                  onClick={downloadXml}
                  disabled={!result.output}
                  className="text-xs text-white/30 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  Download
                </button>
              </div>
            }
          >
<div className="min-h-[420px] overflow-auto">
  <XmlCodeView
    value={result.output}
  />
</div>
          </EditorPanel>
        </div>

        {/* Mode */}

        <div className="mt-4">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.025] p-1">
            <button
              onClick={() =>
                setOutputMode('pretty')
              }
              className={`rounded-lg px-4 py-2 text-xs transition ${
                outputMode === 'pretty'
                  ? 'bg-violet-400/15 text-violet-300'
                  : 'text-white/30 hover:text-white'
              }`}
            >
              Pretty
            </button>

            <button
              onClick={() =>
                setOutputMode('minified')
              }
              className={`rounded-lg px-4 py-2 text-xs transition ${
                outputMode === 'minified'
                  ? 'bg-violet-400/15 text-violet-300'
                  : 'text-white/30 hover:text-white'
              }`}
            >
              Minified
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/20">
          Drop an .xml file, paste XML or start typing.
          Everything is processed locally.
        </div>
      </ToolLayout>
    </>
  )
}

/* ================================= */
/* XML PARSER                        */
/* ================================= */

function parseXml(
  input: string
):
  | {
      valid: true
      document: Document
    }
  | {
      valid: false
      error: XmlError
    } {
  const parser =
    new DOMParser()

  const document =
    parser.parseFromString(
      input,
      'application/xml'
    )

  const parserError =
    document.querySelector(
      'parsererror'
    )

  if (parserError) {
    return {
      valid: false,
      error: getXmlError(
        parserError.textContent ?? ''
      ),
    }
  }

  return {
    valid: true,
    document,
  }
}

/* ================================= */
/* XML ERROR                         */
/* ================================= */

function getXmlError(
  message: string
): XmlError {
  const lineColumn =
    message.match(
      /line\s+(\d+).*column\s+(\d+)/i
    )

  if (lineColumn) {
    return {
      message: cleanXmlError(message),
      line: Number(lineColumn[1]),
      column: Number(lineColumn[2]),
    }
  }

  const line =
    message.match(
      /line\s+(\d+)/i
    )

  return {
    message: cleanXmlError(message),
    line: line
      ? Number(line[1])
      : undefined,
  }
}

function cleanXmlError(
  message: string
) {
  return (
    message
      .replace(/\s+/g, ' ')
      .trim() ||
    'Something is wrong with this XML.'
  )
}

/* ================================= */
/* FORMAT XML                        */
/* ================================= */

function formatXml(input: string) {
  const parser = new DOMParser()

  const document = parser.parseFromString(
    input,
    'application/xml'
  )

  const INDENT = '  '

  function formatNode(
    node: Node,
    depth: number
  ): string {
    const indent = INDENT.repeat(depth)

    /* XML declaration / processing instructions */
    if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const processingInstruction =
        node as ProcessingInstruction

      return `${indent}<?${processingInstruction.target} ${processingInstruction.data}?>`
    }

    /* Comments */
    if (node.nodeType === Node.COMMENT_NODE) {
      return `${indent}<!--${node.nodeValue ?? ''}-->`
    }

    /* CDATA */
    if (node.nodeType === Node.CDATA_SECTION_NODE) {
      return `${indent}<![CDATA[${node.nodeValue ?? ''}]]>`
    }

    /* Text */
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.nodeValue?.trim()

      return value
        ? `${indent}${value}`
        : ''
    }

    /* Elements */
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element

      const attributes = Array.from(
        element.attributes
      )
        .map(
          (attribute) =>
            ` ${attribute.name}="${escapeXmlAttribute(
              attribute.value
            )}"`
        )
        .join('')

      const meaningfulChildren =
        Array.from(element.childNodes).filter(
          (child) =>
            child.nodeType !== Node.TEXT_NODE ||
            Boolean(child.nodeValue?.trim())
        )

      /* Empty element */
      if (meaningfulChildren.length === 0) {
        return `${indent}<${element.tagName}${attributes} />`
      }

      /* Simple text-only element */
      if (
        meaningfulChildren.length === 1 &&
        meaningfulChildren[0].nodeType ===
          Node.TEXT_NODE
      ) {
        const text =
          meaningfulChildren[0].nodeValue?.trim() ??
          ''

        return `${indent}<${element.tagName}${attributes}>${escapeXmlText(
          text
        )}</${element.tagName}>`
      }

      /* Element with children */
      const children = meaningfulChildren
        .map((child) =>
          formatNode(child, depth + 1)
        )
        .filter(Boolean)
        .join('\n')

      return [
        `${indent}<${element.tagName}${attributes}>`,
        children,
        `${indent}</${element.tagName}>`,
      ].join('\n')
    }

    return ''
  }

  const nodes = Array.from(
    document.childNodes
  )
    .map((node) => formatNode(node, 0))
    .filter(Boolean)

  return nodes.join('\n\n')
}

function escapeXmlText(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeXmlAttribute(value: string) {
  return escapeXmlText(value)
    .replace(/"/g, '&quot;')
}
/* ================================= */
/* MINIFY XML                        */
/* ================================= */

function minifyXml(
  input: string
) {
  const parser =
    new DOMParser()

  const document =
    parser.parseFromString(
      input,
      'application/xml'
    )

  return new XMLSerializer()
    .serializeToString(document)
    .replace(/>\s+</g, '><')
    .trim()
}

export default XmlFormatter