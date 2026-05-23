import React from 'react'
import Cursor from './components/Cursor.jsx'
import ParticleBg from './components/ParticleBg.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Analyzer from './components/Analyzer.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Cursor />
      <ParticleBg />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <main>
          <Hero />
          <Analyzer />
        </main>
        <Footer />
      </div>
    </>
  )
}
