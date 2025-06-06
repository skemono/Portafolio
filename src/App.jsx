import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import PlanetIntro from './components/PlanetIntro'
import Portfolio from './components/Portfolio'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    // Auto-transition after intro animation completes
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 8000) // 8 seconds for the intro

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <PlanetIntro key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <Portfolio key="portfolio" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App