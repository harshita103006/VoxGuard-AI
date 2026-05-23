/**
 * VoxGuard AI — API Service
 * ══════════════════════════════════════════════════════════════
 * Maps to your FastAPI backend (backend/main.py)
 *
 * Backend endpoints used:
 *   POST /upload-audio   → audio_routes.py
 *   GET  /analytics      → analytics_routes.py
 *   GET  /              → health check
 *
 * In dev  → Vite proxies /api/* to http://localhost:8000/*
 * In prod → set VITE_API_BASE_URL=https://your-deployed-backend.com
 * ══════════════════════════════════════════════════════════════
 *
 * Backend POST /upload-audio response shape:
 * {
 *   message:            string,
 *   filename:           string,
 *   prediction:         "REAL" | "AI-GENERATED",
 *   confidence:         number,
 *   variance:           number,
 *   mfcc_feature_count: number,
 *   spectrogram_image:  string,
 *   audio_metadata:     { duration_seconds, sample_rate, channels, total_samples },
 *   explanations:       string[],
 *   anomalies:          string[],
 *   risk_analysis:      { risk_score, risk_level },
 *   voice_fingerprint:  string,
 *   known_threat_match: boolean
 * }
 */

const BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL
  : '/api'

// ── Upload & analyze audio ───────────────────────────────────
export async function uploadAudio(file) {
  const form = new FormData()
  // Backend expects field name: "audio"  (UploadFile = File(...) aliased as 'audio')
  form.append('audio', file, file.name || 'recording.webm')

  const res = await fetch(`${BASE}/upload-audio`, {
    method: 'POST',
    body: form,
    // Add auth headers here if needed, e.g.:
    // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  })

  if (!res.ok) {
    let msg = `Server error ${res.status}`
    try { const e = await res.json(); msg = e.detail || e.message || msg } catch (_) {}
    throw new Error(msg)
  }

  return await res.json()
}

// ── Analytics ────────────────────────────────────────────────
export async function fetchAnalytics() {
  const res = await fetch(`${BASE}/analytics`)
  if (!res.ok) throw new Error(`Analytics error ${res.status}`)
  return await res.json()
}

// ── Health ───────────────────────────────────────────────────
export async function ping() {
  try {
    const res = await fetch(`${BASE}/`)
    return res.ok
  } catch (_) {
    return false
  }
}
