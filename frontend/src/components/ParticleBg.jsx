import { useEffect, useRef } from 'react'

export default function ParticleBg() {
  const ref = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    let W, H, pts = [], raf

    const resize = () => {
      W = c.width = window.innerWidth
      H = c.height = window.innerHeight
      pts = Array.from({ length: 95 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
        r: Math.random() * 1.3 + .3, o: Math.random() * .32 + .07
      }))
    }
    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', e => { mouse.current = { x: e.clientX, y: e.clientY } })

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#0a0a0c'; ctx.fillRect(0, 0, W, H)

      // Mouse glow
      const g = ctx.createRadialGradient(mouse.current.x || W/2, mouse.current.y || H/2, 0, mouse.current.x || W/2, mouse.current.y || H/2, 650)
      g.addColorStop(0, 'rgba(0,212,200,0.042)'); g.addColorStop(1, 'transparent')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)

      // Bottom-right ambient
      const g2 = ctx.createRadialGradient(W * .85, H * .88, 0, W * .85, H * .88, 450)
      g2.addColorStop(0, 'rgba(0,212,200,0.022)'); g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H)

      for (const p of pts) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,212,200,${p.o})`; ctx.fill()
      }
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)
          if (d < 108) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(0,212,200,${.055 * (1 - d / 108)})`; ctx.lineWidth = .5; ctx.stroke()
          }
        }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} />
}
