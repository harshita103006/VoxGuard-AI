# VoxGuard AI — Frontend

Cinematic voice deepfake detection interface.  
Connects directly to your FastAPI backend.

---

## Quick Start

```bash
cd voxguard-frontend
npm install
npm run dev
# → http://localhost:5173
```

Your FastAPI backend must be running on **`http://localhost:8000`**.  
Vite proxies all `/api/*` requests there automatically (no CORS issues in dev).

---

## Backend Integration

The frontend calls **one endpoint**:

### `POST /upload-audio`
Sends `multipart/form-data` with field name `audio`.

**Expected response:**
```json
{
  "prediction":         "REAL" | "AI-GENERATED",
  "confidence":         87.4,
  "variance":           1203.5,
  "mfcc_feature_count": 40,
  "spectrogram_image":  "uploads/file.wav.png",
  "audio_metadata": {
    "duration_seconds": 4.2,
    "sample_rate":      44100,
    "channels":         1,
    "total_samples":    185220
  },
  "explanations":       ["Natural voice fluctuations detected", ...],
  "anomalies":          [],
  "risk_analysis":      { "risk_score": 12, "risk_level": "LOW" },
  "voice_fingerprint":  "abc123...",
  "known_threat_match": false
}
```

All fields map directly to the Result screen. None are hardcoded.

---

## Production Deployment

1. Copy `.env.example` → `.env`
2. Set `VITE_API_BASE_URL=https://your-backend.com`
3. Run `npm run build` → serves from `dist/`

---

## File Structure

```
src/
  services/api.js          ← ALL backend calls (edit here to change endpoints)
  hooks/useAudioRecorder.js
  components/
    Analyzer.jsx           ← Main upload/record/analyze flow
    ResultPane.jsx         ← Renders full backend response
    ScanOverlay.jsx        ← Cinematic scanning animation
    WaveformBar.jsx        ← Audio waveform visualization
    Hero.jsx               ← Animated orb + headline
    ParticleBg.jsx         ← Canvas particle field
    Cursor.jsx             ← Custom cursor with ring trail
    Nav.jsx / Footer.jsx
```
