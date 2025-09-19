export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function sortBy<T>(array: T[], keyFn: (item: T) => any): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a)
    const bVal = keyFn(b)
    
    if (aVal < bVal) return -1
    if (aVal > bVal) return 1
    return 0
  })
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []
  
  array.forEach(item => {
    if (predicate(item)) {
      pass.push(item)
    } else {
      fail.push(item)
    }
  })
  
  return [pass, fail]
}