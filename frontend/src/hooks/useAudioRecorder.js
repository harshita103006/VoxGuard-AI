import { useState, useRef, useCallback } from 'react'

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState(null)
  const mediaRec = useRef(null)
  const chunks = useRef([])
  const streamRef = useRef(null)

  const start = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunks.current = []
      const rec = new MediaRecorder(stream)
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data) }
      mediaRec.current = rec
      rec.start()
      setRecording(true)
    } catch {
      setError('Microphone access denied. Please allow microphone permissions.')
    }
  }, [])

  const stop = useCallback(() => new Promise((resolve) => {
    if (!mediaRec.current) return resolve(null)
    mediaRec.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' })
      streamRef.current?.getTracks().forEach((t) => t.stop())
      setRecording(false)
      resolve(blob)
    }
    mediaRec.current.stop()
  }), [])

  return { recording, error, start, stop }
}
