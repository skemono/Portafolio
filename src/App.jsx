import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from "motion/react"
import PlanetIntro from './components/PlanetIntro'
import Portfolio from './components/Portfolio'
import backgroundMusic from './assets/light.mp3'

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [musicStarted, setMusicStarted] = useState(false)
  const [showMusicPrompt, setShowMusicPrompt] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const handleIntroComplete = () => {
    setShowIntro(false)
    
    // Try autoplay after intro
    setTimeout(() => {
      if (audioRef.current) {
        // Try to play automatically
        audioRef.current.play()
          .then(() => {
            // Autoplay succeeded!
            console.log('Autoplay succeeded')
            setMusicStarted(true)
            setIsPlaying(true)
          })
          .catch((error) => {
            // Autoplay was blocked, show user prompt
            console.log('Autoplay blocked:', error)
            setShowMusicPrompt(true)
          })
      }
    }, 500)
  }

  const enableMusic = () => {
    setShowMusicPrompt(false)
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setMusicStarted(true)
          setIsPlaying(true)
        })
        .catch(console.error)
    }
  }

  const skipMusic = () => {
    setShowMusicPrompt(false)
    setMusicStarted(true) // Show control button even if music is off
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  useEffect(() => {
    // Setup audio element
    if (audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.loop = true
      
      // Add event listeners
      audioRef.current.addEventListener('play', () => setIsPlaying(true))
      audioRef.current.addEventListener('pause', () => setIsPlaying(false))
    }

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', () => setIsPlaying(true))
        audioRef.current.removeEventListener('pause', () => setIsPlaying(false))
      }
    }
  }, [])

  // Try aggressive autoplay techniques
  useEffect(() => {
    if (audioRef.current) {
      // Set low volume initially to increase autoplay chances
      audioRef.current.volume = 0.1
      
      // Try preloading
      audioRef.current.load()
    }
  }, [])

  return (
    <div className="App">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src={backgroundMusic}
        preload="auto"
        style={{ display: 'none' }}
        // Try additional attributes that might help with autoplay
        autoPlay
        muted={false}
      />

      {/* Music Prompt Overlay */}
      {showMusicPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            backdropFilter: 'blur(10px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: 'clamp(2rem, 5vw, 3rem)',
              textAlign: 'center',
              color: 'white',
              maxWidth: '90vw'
            }}
          >
            <h2 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
              marginBottom: '1rem',
              background: 'linear-gradient(45deg, #fff, #ccc)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎵 Experiencia Musical
            </h2>
            
            <p style={{ 
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
              marginBottom: '2rem',
              opacity: 0.9,
              lineHeight: '1.5'
            }}>
              Tu navegador bloqueó la reproducción automática.<br/>
              ¿Te gustaría activar la música de fondo?
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <motion.button
                onClick={enableMusic}
                style={{
                  padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
                  background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'linear-gradient(45deg, #5CBF60, #4CAF50)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                🎵 Activar música
              </motion.button>
              
              <motion.button
                onClick={skipMusic}
                style={{
                  padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  scale: 1.05,
                  background: 'rgba(255, 255, 255, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                🔇 Continuar sin música
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Music Control Button */}
      {musicStarted && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMusic}
          style={{
            position: 'fixed',
            top: 'clamp(1rem, 4vw, 2rem)',
            right: 'clamp(1rem, 4vw, 2rem)',
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: 'clamp(45px, 8vw, 55px)',
            height: 'clamp(45px, 8vw, 55px)',
            color: 'white',
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          whileHover={{ 
            scale: 1.1,
            background: 'rgba(255, 255, 255, 0.2)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? '🔊' : '🔇'}
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {showIntro ? (
          <PlanetIntro key="intro" onComplete={handleIntroComplete} />
        ) : (
          <Portfolio key="portfolio" />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App