import { useState, useRef, useCallback } from 'react'
import { uploadAudio } from '../services/api.js'
import { useAudioRecorder } from '../hooks/useAudioRecorder.js'
import ScanOverlay from './ScanOverlay.jsx'
import ResultPane from './ResultPane.jsx'
import WaveformBar from './WaveformBar.jsx'
import s from './Analyzer.module.css'

const ACCEPTED = '.mp3,audio/mpeg'
const MAX_MB = 30
const PHASE = { IDLE:'idle', READY:'ready', SCAN:'scan', RESULT:'result', ERROR:'error' }

export default function Analyzer() {
  const [phase, setPhase]       = useState(PHASE.IDLE)
  const [blob, setBlob]         = useState(null)
  const [fileName, setFileName] = useState('')
  const [duration, setDuration] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [progress, setProgress] = useState(0)
  const [result, setResult]     = useState(null)
  const [errMsg, setErrMsg]     = useState('')
  const [dragging, setDragging] = useState(false)

  const fileRef  = useRef(null)
  const audioRef = useRef(null)
  const ticker   = useRef(null)

  const { recording, error: recErr, start: startRec, stop: stopRec } = useAudioRecorder()

  // ── Ingest audio ─────────────────────────────────────────
  const ingest = useCallback((b, name) => {
    setBlob(b); setFileName(name)
    const url = URL.createObjectURL(b); setAudioUrl(url)
    const a = new Audio(url)
    a.addEventListener('loadedmetadata', () => {
      const sec = Math.floor(a.duration)
      setDuration(`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`)
    })
    setPhase(PHASE.READY); setErrMsg('')
  }, [])

  const handleFile = useCallback((f) => {
    if (!f) return
    if (!f.type.startsWith('audio/')) { setErrMsg('Please upload an MP3 audio file only.');
    return
    }
    ingest(f, f.name)
  }, [ingest])

  // drag & drop
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = ()  => setDragging(false)
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }

  // mic
  const handleMic = useCallback(async () => {
    if (!recording) { await startRec() }
    else {
      const b = await stopRec()
      if (b) ingest(b, 'recording.webm')
    }
  }, [recording, startRec, stopRec, ingest])

  // ── Analyze ───────────────────────────────────────────────
  const handleAnalyze = useCallback(async () => {
    if (!blob) return
    setPhase(PHASE.SCAN); setProgress(0)

    // Fake progress ticker while waiting for backend
    let p = 0
    ticker.current = setInterval(() => {
      p = Math.min(p + 11, 88)
      setProgress(p)
    }, 650)

    try {
      // Build a File from blob so backend gets a proper filename
      const file = blob instanceof File ? blob : new File([blob], fileName || 'recording.webm', { type: blob.type })
      const data = await uploadAudio(file)
      clearInterval(ticker.current)
      setProgress(100)
      setTimeout(() => { setResult(data); setPhase(PHASE.RESULT) }, 400)
    } catch (err) {
      clearInterval(ticker.current)
      setErrMsg(err.message || 'Analysis failed. Please check your backend is running.')
      setPhase(PHASE.ERROR)
    }
  }, [blob, fileName])

  // ── Reset ─────────────────────────────────────────────────
  const reset = useCallback(() => {
    clearInterval(ticker.current)
    setPhase(PHASE.IDLE); setBlob(null); setFileName(''); setDuration(null)
    setAudioUrl(null); setProgress(0); setResult(null); setErrMsg('')
    if (fileRef.current) fileRef.current.value = ''
    audioRef.current = null
  }, [])

  const showUpload = [PHASE.IDLE, PHASE.READY, PHASE.ERROR].includes(phase)

  return (
    <section className={s.section}>
      <p className={s.label}>Voice Analysis Chamber</p>

      <div className={s.chamber}>
        <div className={s.inner}>

          {/* ── Upload UI ── */}
          {showUpload && (
            <>
              {/* Drop zone */}
              <div
                className={`${s.drop} ${dragging ? s.dragging : ''}`}
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept={ACCEPTED} style={{ display:'none' }}
                  onChange={(e) => handleFile(e.target.files[0])} />
                <div className={s.dropIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                  </svg>
                </div>
                <p className={s.dropText}><strong>Drop audio file here</strong><br />or click to browse</p>
                <p className={s.dropFormats}>Supports MP3 audio files only</p>
              </div>

              {/*<div className={s.or}><span/>or<span/></div>

              {/* Mic */}
             {/* <button className={`${s.mic} ${recording ? s.micOn : ''}`} onClick={handleMic}>
                <span className={`${s.micDot} ${recording ? s.micDotOn : ''}`} />
                {recording ? 'Recording… click to stop' : 'Record Voice Sample'}
              </button>

              {/* Waveform preview */}
              {phase === PHASE.READY && blob && (
                <div className={s.wave}>
                  <WaveformBar blob={blob} />
                  <div className={s.audioRow}>
                    <button className={s.playBtn} onClick={() => {
                      if (!audioRef.current) audioRef.current = new Audio(audioUrl)
                      audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()
                    }}>
                      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l10 6-10 6z"/></svg>
                    </button>
                    <span className={s.audioName}>{fileName}</span>
                    {duration && <span className={s.audioDur}>{duration}</span>}
                  </div>
                </div>
              )}

              {/* Error */}
              {(errMsg || recErr) && <div className={s.error}>{errMsg || recErr}</div>}

              {/* Analyze */}
              {phase === PHASE.READY && (
                <button className={s.analyzeBtn} onClick={handleAnalyze}>
                  Analyze Voice Sample
                </button>
              )}
            </>
          )}

          {/* ── Scanning ── */}
          {phase === PHASE.SCAN && <ScanOverlay progress={progress} />}

          {/* ── Result ── */}
          {phase === PHASE.RESULT && result && <ResultPane data={result} onReset={reset} />}

        </div>
      </div>
    </section>
  )
}
