'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getSiteTheme, getBirthdayAge, getMonthsSincePassing, type SiteTheme } from '@/lib/theme'

export default function ThemeBanner() {
  const [theme,  setTheme]  = useState<SiteTheme>('default')
  const [age,    setAge]    = useState(0)
  const [months, setMonths] = useState(0)

  useEffect(() => {
    const t = getSiteTheme()
    setTheme(t)
    setAge(getBirthdayAge())
    setMonths(getMonthsSincePassing())
    // Drive CSS theme variables
    document.documentElement.dataset.theme = t
  }, [])

  if (theme === 'default') return null

  const isBirthday = theme === 'birthday'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.6, ease: 'easeOut' }}
      className="relative w-full z-[55] text-center py-3 px-4"
      style={
        isBirthday
          ? { background: 'linear-gradient(to right, #1e0040, #4c1d95, #6b21a8, #4c1d95, #1e0040)', borderBottom: '1px solid rgba(167,139,250,0.35)' }
          : { background: 'linear-gradient(to right, #0a0520, #1e0a4a, #2e1065, #1e0a4a, #0a0520)', borderBottom: '1px solid rgba(109,40,217,0.22)' }
      }
    >
      {isBirthday ? (
        <p className="font-display text-[8px] tracking-[0.32em] uppercase text-purple-200/85">
          Happy Birthday, Rudraksh&nbsp;&nbsp;·&nbsp;&nbsp;Today you would have turned {age}
        </p>
      ) : (
        <p className="font-display text-[8px] tracking-[0.32em] uppercase text-purple-300/65">
          Today is the 13th&nbsp;&nbsp;·&nbsp;&nbsp;Thinking of you, always&nbsp;&nbsp;·&nbsp;&nbsp;{months} month{months !== 1 ? 's' : ''} in our hearts
        </p>
      )}
    </motion.div>
  )
}
