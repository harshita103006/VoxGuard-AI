import { useEffect, useRef } from 'react'

export default function WaveformBar({ blob }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!blob || !ref.current) return
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const W = canvas.offsetWidth || 400
    canvas.width = W; canvas.height = 60
    ctx.clearRect(0, 0, W, 60)

    blob.arrayBuffer().then(buf => {
      const ac = new (window.AudioContext || window.webkitAudioContext)()
      ac.decodeAudioData(buf, decoded => {
        const data = decoded.getChannelData(0)
        const step = Math.floor(data.length / W)
        ctx.beginPath()
        for (let i = 0; i < W; i++) {
          let peak = 0
          for (let j = 0; j < step; j++) peak = Math.max(peak, Math.abs(data[i * step + j] || 0))
          const h = Math.max(2, peak * 56)
          ctx.rect(i, 30 - h / 2, 1, h)
        }
        ctx.fillStyle = 'rgba(0,212,200,0.55)'; ctx.fill()
        ac.close()
      }, () => { fallback(ctx, W); ac.close() })
    }).catch(() => fallback(ctx, W))
  }, [blob])

  return (
    <canvas ref={ref} style={{ width:'100%', height:60, borderRadius:6, background:'rgba(255,255,255,0.02)', display:'block' }} />
  )
}

function fallback(ctx, W) {
  ctx.beginPath()
  for (let i = 0; i < W; i++) {
    const v = (Math.sin(i * .075) * Math.sin(i * .022 + 1) * .4 + .55) * (.35 + Math.random() * .35)
    const h = Math.max(2, v * 50)
    ctx.rect(i, 30 - h / 2, 1, h)
  }
  ctx.fillStyle = 'rgba(0,212,200,0.45)'; ctx.fill()
}
