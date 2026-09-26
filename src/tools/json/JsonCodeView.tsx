type JsonCodeViewProps = {
  content: string
  errorLine?: number
  placeholder?: string
}

function JsonCodeView({
  content,
  errorLine,
  placeholder = 'Pretty JSON will appear here ✦',
}: JsonCodeViewProps) {
  if (!content) {
    return (
      <div className="min-h-[420px] p-5 font-mono text-sm text-white/20">
        {placeholder}
      </div>
    )
  }

  const lines = content.split('\n')

  return (
    <div className="min-h-[360px] max-w-full overflow-auto font-mono text-[13px] leading-6 sm:min-h-[420px] sm:text-sm">
      {lines.map((line, index) => {
        const lineNumber = index + 1
        const hasError = lineNumber === errorLine

        return (
          <div
            key={index}
            className={`flex min-w-max ${
              hasError
                ? 'bg-red-400/[0.08]'
                : ''
            }`}
          >
            <div
              className={`sticky left-0 w-14 shrink-0 select-none border-r border-white/[0.06] bg-[#0c0c0f] pr-4 text-right ${
                hasError
                  ? 'text-red-300'
                  : 'text-white/20'
              }`}
            >
              {lineNumber}
            </div>

            <div
              className={`whitespace-pre px-4 ${
                hasError
                  ? 'border-l-2 border-red-400'
                  : 'border-l-2 border-transparent'
              }`}
              dangerouslySetInnerHTML={{
                __html: highlightJsonLine(line),
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

function highlightJsonLine(line: string) {
  const escaped = escapeHtml(line)

  return escaped.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false)\b|\b(null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g,
    (
      match,
      stringValue,
      isKey,
      booleanValue,
      nullValue,
      numberValue
    ) => {
      if (stringValue) {
        if (isKey) {
          return `<span class="text-violet-300">${stringValue}</span><span class="text-white/40">${isKey}</span>`
        }

        return `<span class="text-emerald-200/80">${stringValue}</span>`
      }

      if (booleanValue) {
        return `<span class="text-sky-300">${booleanValue}</span>`
      }

      if (nullValue) {
        return `<span class="text-fuchsia-300">${nullValue}</span>`
      }

      if (numberValue) {
        return `<span class="text-amber-200">${numberValue}</span>`
      }

      return match
    }
  )
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export default JsonCodeView