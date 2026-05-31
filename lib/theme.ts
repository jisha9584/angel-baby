export type SiteTheme = 'birthday' | 'thirteenth' | 'default'

export function getSiteTheme(): SiteTheme {
  const now   = new Date()
  const month = now.getMonth() + 1
  const day   = now.getDate()

  if (month === 7 && day === 22) return 'birthday'
  if (day === 13)                return 'thirteenth'
  return 'default'
}

// He was born July 22, 2007
export function getBirthdayAge(): number {
  return new Date().getFullYear() - 2007
}

// Full months since February 13, 2026
export function getMonthsSincePassing(): number {
  const passing = new Date('2026-02-13')
  const now     = new Date()
  return Math.max(
    0,
    (now.getFullYear() - passing.getFullYear()) * 12 +
      now.getMonth() - passing.getMonth(),
  )
}
