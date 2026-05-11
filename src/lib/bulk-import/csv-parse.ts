/**
 * Minimal RFC 4180-compliant CSV parser.
 * No external dependencies — handles quoted fields, escaped quotes, and CRLF.
 */

function parseLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped double-quote inside a quoted field
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }

  fields.push(current)
  return fields
}

/**
 * Parse a CSV string into an array of row objects keyed by the header row.
 * - Skips blank rows
 * - Trims header names (removes * from required markers)
 * - Missing trailing fields default to ''
 */
export function parseCSV(text: string): Record<string, string>[] {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n')

  const headerLine = lines.find((l) => l.trim().length > 0)
  if (!headerLine) return []

  const rawHeaders = parseLine(headerLine)
  // Strip the asterisk used for required-field annotation in the sample header
  const headers = rawHeaders.map((h) => h.trim().replace(/\*$/, '').trim())

  const results: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    const values = parseLine(line)
    const obj: Record<string, string> = {}
    headers.forEach((h, idx) => {
      obj[h] = (values[idx] ?? '').trim()
    })
    results.push(obj)
  }

  return results
}
