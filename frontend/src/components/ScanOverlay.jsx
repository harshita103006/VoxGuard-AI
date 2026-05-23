import { useEffect, useRef, useState } from 'react'
import s from './ScanOverlay.module.css'

const MSGS = [
  'Extracting MFCC features...',
  'Analyzing prosodic patterns...',
  'Checking spectral variance...',
  'Evaluating waveform coherence...',
  'Running deepfake model...',
  'Calibrating confidence score...',
  'Assessing risk level...',
]

export default function ScanOverlay({ progress }) {
  const [idx, setIdx] = useState(0)
  const t = useRef(null)

  useEffect(() => {
    t.current = setInterval(() => setIdx(i => (i + 1) % MSGS.length), 860)
    return () => clearInterval(t.current)
  }, [])

  return (
    <div className={s.wrap}>
      <p className={s.status}>{MSGS[idx]}</p>
      <div className={s.bars}>
        {Array.from({ length: 32 }, (_, i) => (
          <div key={i} className={s.bar} style={{
            height: 16 + Math.abs(Math.sin(i * .65)) * 38 + 'px',
            animationDelay: (i * .038) + 's',
            animationDuration: (.85 + Math.random() * .55) + 's',
          }} />
        ))}
      </div>
      <div className={s.track}><div className={s.fill} style={{ width: progress + '%' }} /></div>
      <p className={s.pct}>{Math.round(progress)}%</p>
    </div>
  )
}
