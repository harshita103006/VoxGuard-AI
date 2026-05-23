import s from './ResultPane.module.css'

/**
 * Renders the full backend response from POST /upload-audio
 *
 * data shape (from your FastAPI backend):
 * {
 *   prediction:         "REAL" | "AI-GENERATED"
 *   confidence:         number          ← calibrated_confidence
 *   variance:           number
 *   mfcc_feature_count: number
 *   audio_metadata:     { duration_seconds, sample_rate, channels, total_samples }
 *   explanations:       string[]
 *   anomalies:          string[]
 *   risk_analysis:      { risk_score, risk_level }   ← "LOW"|"MEDIUM"|"HIGH"|"CRITICAL"
 *   voice_fingerprint:  string
 *   known_threat_match: boolean
 *   spectrogram_image:  string  (path, served by your backend)
 *   filename:           string
 *   message:            string
 * }
 */

const RISK_COLOR = { LOW:'#22d3a0', MEDIUM:'#f59e0b', HIGH:'#f97316', CRITICAL:'#ff3b4e' }
const RISK_BG    = { LOW:'rgba(34,211,160,.08)', MEDIUM:'rgba(245,158,11,.08)', HIGH:'rgba(249,115,22,.08)', CRITICAL:'rgba(255,59,78,.09)' }

function fmt(n, d = 1) { return typeof n === 'number' ? n.toFixed(d) : '—' }
function fmtDur(s) {
  if (typeof s !== 'number') return '—'
  const m = Math.floor(s / 60), sec = Math.floor(s % 60)
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`
}

export default function ResultPane({ data, onReset }) {
  const isReal   = data.prediction === 'REAL'
  const accent   = isReal ? 'var(--cyan)' : 'var(--red)'
  const riskLvl  = data.risk_analysis?.risk_level || 'LOW'
  const riskClr  = RISK_COLOR[riskLvl] || '#888'
  const riskBg   = RISK_BG[riskLvl]   || 'transparent'
  const meta     = data.audio_metadata || {}

  return (
    <div className={s.wrap}>

      {/* ── Verdict ── */}
      <p className={s.verdictLabel}>Analysis Complete</p>
      <div className={s.verdict} style={{ color: accent }}>{data.prediction}</div>
      <div className={s.confRow}>
        <span className={s.confKey}>Confidence</span>
        <span className={s.confVal}>{fmt(data.confidence, 1)}%</span>
      </div>

      {/* ── Risk badge ── */}
      <div className={s.riskBadge} style={{ color: riskClr, background: riskBg, borderColor: riskClr + '44' }}>
        Risk Level: <strong>{riskLvl}</strong>
        {data.risk_analysis?.risk_score != null && (
          <span className={s.riskScore}> · Score {data.risk_analysis.risk_score}/100</span>
        )}
      </div>

      {/* ── Explanations ── */}
      {data.explanations?.length > 0 && (
        <ul className={s.explanations}>
          {data.explanations.map((e, i) => (
            <li key={i} className={s.exItem}>
              <span className={s.exDot} style={{ background: accent }} />
              {e}
            </li>
          ))}
        </ul>
      )}

      {/* ── Audio metadata ── */}
      <div className={s.grid4}>
        <div className={s.cell}>
          <div className={s.cellVal}>{fmtDur(meta.duration_seconds)}</div>
          <div className={s.cellLbl}>Duration</div>
        </div>
        <div className={s.cell}>
          <div className={s.cellVal}>{meta.sample_rate ? `${(meta.sample_rate / 1000).toFixed(1)}kHz` : '—'}</div>
          <div className={s.cellLbl}>Sample Rate</div>
        </div>
        <div className={s.cell}>
          <div className={s.cellVal}>{meta.channels ?? '—'}</div>
          <div className={s.cellLbl}>Channels</div>
        </div>
        <div className={s.cell}>
          <div className={s.cellVal}>{fmt(data.variance, 0)}</div>
          <div className={s.cellLbl}>Variance</div>
        </div>
      </div>

      {/* ── MFCC count + fingerprint ── */}
      <div className={s.techRow}>
        {data.mfcc_feature_count != null && (
          <div className={s.techTag}>
            <span className={s.techKey}>MFCC Features</span>
            <span className={s.techVal}>{data.mfcc_feature_count}</span>
          </div>
        )}
        {data.voice_fingerprint && (
          <div className={s.techTag}>
            <span className={s.techKey}>Voice Fingerprint</span>
            <span className={s.techVal} title={data.voice_fingerprint}>
              {data.voice_fingerprint.toString().slice(0, 12)}…
            </span>
          </div>
        )}
        {data.known_threat_match && (
          <div className={s.techTag} style={{ borderColor:'rgba(255,59,78,.35)', color:' var(--red)' }}>
            ⚠ Known Threat Match
          </div>
        )}
      </div>

      {/* ── Anomalies ── */}
      {data.anomalies?.length > 0 && (
        <div className={s.anomalyBox}>
          <p className={s.anomalyTitle}>Anomalies Detected</p>
          {data.anomalies.map((a, i) => (
            <p key={i} className={s.anomalyItem}>· {a}</p>
          ))}
        </div>
      )}

      <button className={s.reset} onClick={onReset}>Analyze Another Sample</button>
    </div>
  )
}
