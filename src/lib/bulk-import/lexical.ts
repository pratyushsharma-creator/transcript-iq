/**
 * Wraps plain text into the minimal Lexical editor JSON structure
 * expected by Payload's richText fields.
 *
 * Paragraph breaks (double newline) are preserved as separate paragraphs.
 * Single newlines within a block are collapsed to a space.
 */
export function wrapPlainTextAsLexical(text: string): object {
  if (!text?.trim()) {
    return {
      root: {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    }
  }

  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean)

  const children = paragraphs.map((p) => ({
    children: [
      {
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text: p,
        type: 'text',
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'paragraph',
    version: 1,
  }))

  return {
    root: {
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}
