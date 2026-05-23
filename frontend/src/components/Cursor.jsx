import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const rpos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    let raf
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) {
        dot.current.style.left = e.clientX + 'px'
        dot.current.style.top = e.clientY + 'px'
      }
    }
    const tick = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.11
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.11
      if (ring.current) {
        ring.current.style.left = rpos.current.x + 'px'
        ring.current.style.top = rpos.current.y + 'px'
      }
      raf = requestAnimationFrame(tick)
    }
    const down = () => {
      dot.current && (dot.current.style.transform = 'translate(-50%,-50%) scale(2)')
      ring.current && (ring.current.style.transform = 'translate(-50%,-50%) scale(0.55)')
    }
    const up = () => {
      dot.current && (dot.current.style.transform = 'translate(-50%,-50%) scale(1)')
      ring.current && (ring.current.style.transform = 'translate(-50%,-50%) scale(1)')
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      cancelAnimationFrame(raf)
    }
  }, [])

  const base = { position:'fixed', pointerEvents:'none', transform:'translate(-50%,-50%)', mixBlendMode:'screen' }
  return (
    <>
      <div ref={dot} style={{ ...base, width:8, height:8, background:'var(--cyan)', borderRadius:'50%', zIndex:9999, transition:'transform .1s', left:'-100px', top:'-100px' }} />
      <div ref={ring} style={{ ...base, width:30, height:30, border:'1px solid rgba(0,212,200,0.5)', borderRadius:'50%', zIndex:9998, transition:'transform .14s', left:'-100px', top:'-100px' }} />
    </>
  )
}
