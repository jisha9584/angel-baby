// Server component — deterministic star positions via a single advancing LCG
// stream. Drawing successive values (rather than hashing consecutive integers)
// decorrelates each star's x/y, so the field scatters evenly instead of
// collapsing onto diagonal lattice lines. No runtime randomness = no hydration
// mismatch.

function makeStars(count: number) {
  let state = 0x6d2b79f5
  const next = () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff
    return state / 0x7fffffff
  }

  return Array.from({ length: count }, () => {
    const left = next(), top = next(), sz = next(), delay = next()
    const dur = next(), a = next(), pr = next(), br = next()
    return {
      left:     `${(left * 100).toFixed(3)}%`,
      top:      `${(top * 100).toFixed(3)}%`,
      size:     sz > 0.92 ? 2.5 : sz > 0.72 ? 1.5 : 1,
      delay:    `${(delay * 9).toFixed(2)}s`,
      duration: `${(3 + dur * 6).toFixed(2)}s`,
      alpha:    parseFloat((0.28 + a * 0.72).toFixed(3)),
      purple:   pr > 0.74,
      bright:   br > 0.91,
    }
  })
}

export default function StarField({ count = 180 }: { count?: number }) {
  const stars = makeStars(count)
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{
            left:              star.left,
            top:               star.top,
            width:             `${star.size}px`,
            height:            `${star.size}px`,
            backgroundColor:   star.purple
              ? `rgba(196,181,253,${star.alpha})`
              : star.bright
                ? `rgba(255,248,240,${star.alpha})`
                : `rgba(255,255,255,${star.alpha})`,
            animationDelay:    star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  )
}
