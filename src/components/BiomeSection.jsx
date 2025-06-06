import { useRef } from 'react'
import { motion } from "motion/react"

const BiomeSection = ({ biome, index }) => {
  const biomeRef = useRef(null)
  const BiomeComponent = biome.component

  const handleDownloadCV = () => {
    const link = document.createElement('a')
    link.href = '/cv.pdf'
    link.download = 'June_Herrera_Watanabe_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        padding: 0,
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

      {/* Content Overlay - NO HORIZONTAL SCROLL */}
      <motion.div
        className={`biome-content-${index}`}
        style={{
          position: 'relative',
          zIndex: 10,
          width: 'min(90vw, 800px)', // Prevents overflow
          maxHeight: '85vh',
          padding: 'clamp(1rem, 3vw, 2rem)',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          boxSizing: 'border-box',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflowY: 'auto',
          overflowX: 'hidden' // Explicitly hide horizontal scroll
        }}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
            background: 'linear-gradient(45deg, #fff, #ccc)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            lineHeight: '1.2',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden', // Prevent text overflow
            wordWrap: 'break-word'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {biome.content.title}
        </motion.h1>

        <motion.h2
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: '#bbb',
            marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
            textAlign: 'center',
            lineHeight: '1.3',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            wordWrap: 'break-word'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {biome.subtitle}
        </motion.h2>

        <motion.p
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
            lineHeight: '1.6',
            marginBottom: 'clamp(1rem, 3vw, 2rem)',
            opacity: 0.9,
            textAlign: 'center',
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            wordWrap: 'break-word',
            padding: '0'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {biome.content.description}
        </motion.p>

        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.8rem, 2vw, 1rem)',
            width: '100%',
            maxWidth: '100%',
            alignItems: 'center',
            padding: '0',
            overflow: 'hidden' // Prevent container overflow
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
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
                fontSize: 'clamp(0.8rem, 1.8vw, 1rem)',
                textAlign: 'center',
                transition: 'all 0.1s ease',
                width: '100%',
                maxWidth: '100%',
                minWidth: '0', // Allow shrinking
                cursor: 'pointer',
                boxSizing: 'border-box',
                wordWrap: 'break-word',
                overflowWrap: 'break-word', // Force wrap long words
                hyphens: 'auto', // Allow hyphenation
                lineHeight: '1.4',
                overflow: 'hidden' // Hide any overflow
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 1.2 + detailIndex * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02, 
                background: 'rgba(255, 255, 255, 0.25)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
                transition: { duration: 0.1 }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.05 }
              }}
            >
              {detail}
            </motion.div>
          ))}

          {/* CV Download Button - NO OVERFLOW */}
          {biome.content.hasDownload && (
            <motion.button
              onClick={handleDownloadCV}
              style={{
                padding: 'clamp(1rem, 3vw, 1.2rem) clamp(1.5rem, 4vw, 2rem)',
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
                minWidth: '0',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap',
                overflow: 'hidden' // Prevent button overflow
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 1.5 + biome.content.details.length * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                background: 'linear-gradient(45deg, #FF8A65, #FFB74D)',
                boxShadow: '0 6px 25px rgba(255, 107, 53, 0.5)',
                transition: { duration: 0.1 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.05 }
              }}
            >
              📄 Descargar CV
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}

export default BiomeSection