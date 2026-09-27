type XmlCodeViewProps = {
  value: string
}

type Token = {
  text: string
  type:
    | 'tag'
    | 'attribute'
    | 'value'
    | 'text'
    | 'comment'
    | 'declaration'
    | 'punctuation'
}

function XmlCodeView({
  value,
}: XmlCodeViewProps) {
  if (!value) {
    return (
      <div className="p-5 font-mono text-sm text-white/20">
        Pretty XML will appear here ✦
      </div>
    )
  }

  const lines = value.split('\n')

  return (
    <div className="min-w-max py-4 font-mono text-sm leading-6">
      {lines.map((line, index) => (
        <div
          key={index}
          className="
            group
            flex
            min-h-6
            hover:bg-white/[0.025]
          "
        >
          {/* Line number */}
          <div
            className="
              w-12
              shrink-0
              select-none
              border-r
              border-white/[0.05]
              pr-3
              text-right
              text-white/15
            "
          >
            {index + 1}
          </div>

          {/* Code */}
          <div className="whitespace-pre pl-4 pr-6">
            {tokenizeXmlLine(line).map(
              (token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  className={getTokenClass(
                    token.type
                  )}
                >
                  {token.text}
                </span>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ================================= */
/* TOKENIZER                         */
/* ================================= */

function tokenizeXmlLine(
  line: string
): Token[] {
  const trimmed = line.trim()

  /*
   * Preserve indentation separately.
   */
  const indentation =
    line.match(/^\s*/)?.[0] ?? ''

  const tokens: Token[] = []

  if (indentation) {
    tokens.push({
      text: indentation,
      type: 'text',
    })
  }

  /* Comment */
  if (
    trimmed.startsWith('<!--')
  ) {
    tokens.push({
      text: trimmed,
      type: 'comment',
    })

    return tokens
  }

  /* XML declaration / processing instruction */
  if (
    trimmed.startsWith('<?')
  ) {
    return [
      ...tokens,
      ...tokenizeDeclaration(
        trimmed
      ),
    ]
  }

  /* CDATA */
  if (
    trimmed.startsWith('<![CDATA[')
  ) {
    tokens.push({
      text: trimmed,
      type: 'comment',
    })

    return tokens
  }

  /*
   * XML line can contain:
   *
   * <name>Gustavo</name>
   *
   * so tokenize tags and text separately.
   */

  const regex =
    /(<[^>]+>)|([^<]+)/g

  let match: RegExpExecArray | null

  while (
    (match = regex.exec(trimmed))
  ) {
    const part = match[0]

    if (part.startsWith('<')) {
      tokens.push(
        ...tokenizeTag(part)
      )
    } else {
      tokens.push({
        text: part,
        type: 'text',
      })
    }
  }

  return tokens
}

/* ================================= */
/* TAG TOKENIZER                     */
/* ================================= */

function tokenizeTag(
  tag: string
): Token[] {
  const tokens: Token[] = []

  /*
   * Closing tag
   *
   * </user>
   */

  if (tag.startsWith('</')) {
    const name = tag.slice(
      2,
      -1
    )

    return [
      {
        text: '</',
        type: 'punctuation',
      },
      {
        text: name,
        type: 'tag',
      },
      {
        text: '>',
        type: 'punctuation',
      },
    ]
  }

  /*
   * Opening / self-closing tag
   */

  const selfClosing =
    tag.endsWith('/>')

  const inner = tag
    .slice(
      1,
      selfClosing ? -2 : -1
    )
    .trim()

  const nameMatch =
    inner.match(/^([^\s]+)/)

  if (!nameMatch) {
    return [
      {
        text: tag,
        type: 'text',
      },
    ]
  }

  const tagName =
    nameMatch[1]

  tokens.push({
    text: '<',
    type: 'punctuation',
  })

  tokens.push({
    text: tagName,
    type: 'tag',
  })

  const attributesText =
    inner.slice(
      tagName.length
    )

  tokens.push(
    ...tokenizeAttributes(
      attributesText
    )
  )

  tokens.push({
    text: selfClosing
      ? '/>'
      : '>',
    type: 'punctuation',
  })

  return tokens
}

/* ================================= */
/* ATTRIBUTES                        */
/* ================================= */

function tokenizeAttributes(
  input: string
): Token[] {
  const tokens: Token[] = []

  const regex =
    /(\s+)([^\s=]+)(\s*=\s*)("[^"]*"|'[^']*')/g

  let lastIndex = 0

  let match: RegExpExecArray | null

  while (
    (match = regex.exec(input))
  ) {
    if (
      match.index > lastIndex
    ) {
      tokens.push({
        text: input.slice(
          lastIndex,
          match.index
        ),
        type: 'text',
      })
    }

    tokens.push({
      text: match[1],
      type: 'text',
    })

    tokens.push({
      text: match[2],
      type: 'attribute',
    })

    tokens.push({
      text: match[3],
      type: 'punctuation',
    })

    tokens.push({
      text: match[4],
      type: 'value',
    })

    lastIndex =
      regex.lastIndex
  }

  if (
    lastIndex < input.length
  ) {
    tokens.push({
      text: input.slice(lastIndex),
      type: 'text',
    })
  }

  return tokens
}

/* ================================= */
/* DECLARATION                       */
/* ================================= */

function tokenizeDeclaration(
  declaration: string
): Token[] {
  const tokens: Token[] = []

  const inner = declaration
    .slice(2, -2)
    .trim()

  const nameMatch =
    inner.match(/^([^\s]+)/)

  if (!nameMatch) {
    return [
      {
        text: declaration,
        type: 'declaration',
      },
    ]
  }

  const name =
    nameMatch[1]

  tokens.push({
    text: '<?',
    type: 'punctuation',
  })

  tokens.push({
    text: name,
    type: 'declaration',
  })

  tokens.push(
    ...tokenizeAttributes(
      inner.slice(name.length)
    )
  )

  tokens.push({
    text: '?>',
    type: 'punctuation',
  })

  return tokens
}

/* ================================= */
/* COLORS                            */
/* ================================= */

function getTokenClass(
  type: Token['type']
) {
  switch (type) {
    case 'tag':
      return 'text-violet-300'

    case 'attribute':
      return 'text-sky-300'

    case 'value':
      return 'text-emerald-300'

    case 'comment':
      return 'text-white/25 italic'

    case 'declaration':
      return 'text-fuchsia-300'

    case 'punctuation':
      return 'text-white/35'

    case 'text':
    default:
      return 'text-white/70'
  }
}

export default XmlCodeView