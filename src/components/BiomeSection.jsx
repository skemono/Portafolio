import { useRef, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"

const BiomeSection = ({ biome, index }) => {
  const biomeRef = useRef(null)
  const BiomeComponent = biome.component
  const [isCardVisible, setIsCardVisible] = useState(true)

  const handleDownloadCV = () => {
    const link = document.createElement('a')
    link.href = '/cv.pdf'
    link.download = 'June_Herrera_Watanabe_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleCard = () => {
    setIsCardVisible(!isCardVisible)
  }

  return (
    <section
      ref={biomeRef}
      className={`biome-section biome-section-${index}`}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        margin: 0,
        padding: '2vh 2vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}
    >
      {/* Biome Background - FULL SCREEN */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          zIndex: 1
        }}
      >
        <BiomeComponent />
      </div>

      {/* Toggle Button - Always visible */}
      <motion.button
        onClick={toggleCard}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 20,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
        }}
        whileHover={{ 
          scale: 1.1,
          background: 'rgba(255, 255, 255, 0.2)',
          borderColor: 'rgba(255, 255, 255, 0.5)'
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {isCardVisible ? '🙈' : '👁️'}
      </motion.button>

      {/* Content Overlay - REDESIGNED STRUCTURE with AnimatePresence */}
      <AnimatePresence>
        {isCardVisible && (
          <motion.div
            className={`biome-content-${index}`}
            style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              maxWidth: 'min(96vw, 1000px)',
              height: 'auto',
              maxHeight: '96vh',
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              margin: '0 auto',
              boxSizing: 'border-box',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {/* Fixed Header Section */}
            <div
              style={{
                padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2rem) 0',
                textAlign: 'center',
                flexShrink: 0
              }}
            >
              <motion.h1
                style={{
                  fontSize: 'clamp(1.3rem, 3.5vw, 2.5rem)',
                  fontWeight: 'bold',
                  marginBottom: 'clamp(0.3rem, 1vw, 0.5rem)',
                  background: 'linear-gradient(45deg, #fff, #ccc)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1.2',
                  wordWrap: 'break-word'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {biome.content.title}
              </motion.h1>

              <motion.h2
                style={{
                  fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                  color: '#bbb',
                  marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)',
                  lineHeight: '1.3',
                  wordWrap: 'break-word'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {biome.subtitle}
              </motion.h2>

              <motion.p
                style={{
                  fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                  lineHeight: '1.5',
                  opacity: 0.9,
                  wordWrap: 'break-word',
                  margin: 0
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {biome.content.description}
              </motion.p>
            </div>

            {/* Scrollable Content Section */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 'clamp(0.5rem, 2vw, 1rem) clamp(1rem, 3vw, 2rem)',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.3) transparent'
              }}
            >
              <motion.div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(0.8rem, 2vw, 1.2rem)',
                  alignItems: 'center',
                  paddingBottom: 'clamp(0.5rem, 2vw, 1rem)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {biome.content.details.map((detail, detailIndex) => (
                  <motion.div
                    key={detailIndex}
                    style={{
                      padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.5rem)',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      fontSize: 'clamp(0.75rem, 1.6vw, 0.95rem)',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                      width: '100%',
                      maxWidth: '100%',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto',
                      lineHeight: '1.4',
                      position: 'relative'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.0 + detailIndex * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      background: 'rgba(255, 255, 255, 0.25)',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                      zIndex: 10,
                      transition: { duration: 0.15 }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    {detail}
                  </motion.div>
                ))}

                {/* CV Download Button */}
                {biome.content.hasDownload && (
                  <motion.button
                    onClick={handleDownloadCV}
                    style={{
                      padding: 'clamp(1rem, 3vw, 1.3rem) clamp(1.5rem, 4vw, 2rem)',
                      background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '15px',
                      color: 'white',
                      fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: 'clamp(0.5rem, 2vw, 1rem)',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: 'auto',
                      maxWidth: '100%',
                      boxSizing: 'border-box',
                      whiteSpace: 'nowrap',
                      position: 'relative',
                      zIndex: 10
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.3 + biome.content.details.length * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      background: 'linear-gradient(45deg, #FF8A65, #FFB74D)',
                      boxShadow: '0 6px 25px rgba(255, 107, 53, 0.5)',
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { duration: 0.1 }
                    }}
                  >
                    📄 Descargar CV
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </section>
  )
}

export default BiomeSection