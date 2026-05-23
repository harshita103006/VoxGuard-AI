import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.footer}>
      <span>VoxGuard AI</span>
      <span className={s.dot}>·</span>
      <span>Voice Authenticity Engine</span>
    </footer>
  )
}
