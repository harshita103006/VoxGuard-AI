import { useEffect, useRef } from 'react'
import s from './Hero.module.css'

export default function Hero() {
  const ref = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    c.width = 280; c.height = 280
    let t = 0, raf

    const onMouse = (e) => {
      const r = c.getBoundingClientRect()
      mouse.current = { x: (e.clientX - r.left - 140) / 140, y: (e.clientY - r.top - 140) / 140 }
    }
    c.addEventListener('mousemove', onMouse)

    const draw = () => {
      t += 0.013
      ctx.clearRect(0, 0, 280, 280)
      const cx = 140 + mouse.current.x * 10
      const cy = 140 + mouse.current.y * 10

      // Outer atmosphere
      const og = ctx.createRadialGradient(cx, cy, 55, cx, cy, 145)
      og.addColorStop(0, 'rgba(0,212,200,0.18)'); og.addColorStop(1, 'transparent')
      ctx.fillStyle = og; ctx.fillRect(0, 0, 280, 280)

      // Rings
      for (let i = 0; i < 6; i++) {
        const r = 48 + i * 13 + Math.sin(t * .9 + i * .7) * 5
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,212,200,${.06 + .034 * Math.sin(t * 1.4 + i * .5)})`
        ctx.lineWidth = 1; ctx.stroke()
      }

      // Animated waveform ring
      ctx.beginPath()
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2
        const amp = 4.5 * Math.sin(a * 7 + t * 2.8) + 2.5 * Math.sin(a * 13 - t * 1.9) + 1.5 * Math.sin(a * 3 + t * .7)
        const r = 92 + amp
        const x = cx + Math.cos(a) * r; const y = cy + Math.sin(a) * r
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath(); ctx.strokeStyle = 'rgba(0,212,200,0.6)'; ctx.lineWidth = 1.5; ctx.stroke()

      // Core fill
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 54)
      cg.addColorStop(0, 'rgba(0,212,200,0.22)'); cg.addColorStop(.5, 'rgba(0,212,200,0.07)'); cg.addColorStop(1, 'transparent')
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, 54, 0, Math.PI * 2); ctx.fill()

      // Pulse dot
      const pulse = .75 + .25 * Math.sin(t * 2.5)
      ctx.beginPath(); ctx.arc(cx, cy, 4 * pulse, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,212,200,0.95)'; ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); c.removeEventListener('mousemove', onMouse) }
  }, [])

  return (
    <section className={s.hero}>
      <div className={s.orbWrap}><canvas ref={ref} className={s.orb} /></div>
      <p className={s.eyebrow}>Audio Intelligence Core</p>
      <h1 className={s.h1}>Trust What<br />You <em>Hear.</em></h1>
      <p className={s.sub}>Advanced spectral analysis to detect synthetic voices with surgical precision. Upload a sample — the truth reveals itself.</p>
      <div className={s.scrollHint}><span className={s.line} />Analyze below<span className={s.line} style={{ transform:'scaleX(-1)' }} /></div>
    </section>
  )
}
