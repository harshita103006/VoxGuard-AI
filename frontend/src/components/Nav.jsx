import s from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={s.nav}>
      <div className={s.logo}>Vox<span>Guard</span></div>
      <div className={s.hint}>Voice Authenticity Engine</div>
    </nav>
  )
}
