import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { gsap } from 'gsap'
import BiomeSection from './BiomeSection'
import SkyBiome from './biomes/SkyBiome'
import ForestBiome from './biomes/ForestBiome'
import SnowBiome from './biomes/SnowBiome'
import OceanBiome from './biomes/OceanBiome'
import LavaBiome from './biomes/LavaBiome'

const biomes = [
  {
    id: 'sky',
    title: 'Acerca de Mí',
    subtitle: 'Volando Alto en la Tecnología',
    component: SkyBiome,
    content: {
      title: 'June Herrera Watanabe 👨‍💻',
      description: 'Estudiante de Ingeniería en Ciencias de la Computación en la Universidad del Valle de Guatemala, con enfoque en desarrollo backend, automatización e inteligencia artificial.',
      details: [
        '🚀 Enfoque en desarrollo backend y automatización',
        '🤖 Experiencia en software empresarial e IA',
        '🇯🇵 Nacido en Japón (28 enero 2005), ciudadano Guatemalteco 🇬🇹',
        '💡 Apasionado por crear soluciones eficientes y escalables'
      ]
    }
  },
  {
    id: 'forest',
    title: 'Habilidades',
    subtitle: 'Creciendo en el Ecosistema Tech',
    component: ForestBiome,
    content: {
      title: 'Competencias Técnicas 🛠️',
      description: 'Dominio de múltiples lenguajes y tecnologías para crear soluciones innovadoras.',
      details: [
        '⚙️ Backend: Python 🐍 • Kotlin • Java ☕ • C++ • C# • PHP',
        '🎨 Frontend: React ⚛️ • Next.js • HTML5 • CSS3 • JavaScript • TypeScript',
        '📱 Móvil: Jetpack Compose • Android Development',
        '🗃️ Bases de Datos: SQL • Firebase 🔥',
        '🧠 Otros: Lua • Machine Learning • Algoritmos'
      ]
    }
  },
  {
    id: 'snow',
    title: 'Formación',
    subtitle: 'Construyendo Bases Sólidas',
    component: SnowBiome,
    content: {
      title: 'Formación Académica 🎓',
      description: 'Un camino educativo enfocado en ciencias de la computación y tecnología.',
      details: [
        '🏛️ Universidad del Valle de Guatemala (2022 - presente)',
        '💻 Ingeniería en Ciencias de la Computación y TI',
        '🏫 Colegio Suizo Americano Acatán (2018-2022)',
        '📚 Bachiller en Ciencias y Letras - Computación',
        '🎒 Colegio Bilingüe Vista Hermosa (2009-2017)'
      ]
    }
  },
  {
    id: 'ocean',
    title: 'Proyectos',
    subtitle: 'Navegando en la Innovación',
    component: OceanBiome,
    content: {
      title: 'Proyectos Destacados 🚀',
      description: 'Soluciones tecnológicas que abordan necesidades reales con impacto significativo.',
      details: [
        '🤝 UVGMeet - App de networking para estudiantes UVG',
        '💊 Sistema de Gestión Farmacéutica - Plataforma web completa',
        '🔬 LabDocs - App móvil para laboratorios científicos',
        '🌾 Agrisom - Recomendaciones agrícolas con IA',
        '💉 Registro COVID-19 - Seguimiento de vacunación',
        '🥗 Nutrionix - Herramienta web de nutrición personalizada'
      ]
    }
  },
  {
    id: 'lava',
    title: 'Contacto',
    subtitle: 'Conectemos y Creemos Juntos',
    component: LavaBiome,
    content: {
      title: 'Hablemos 📞',
      description: '¿Listo para crear algo increíble juntos? Estoy disponible para proyectos emocionantes y oportunidades de colaboración.',
      details: [
        '📧 Email: lordkemono@gmail.com',
        '📱 Teléfono: +502 4642-9884',
        '🎮 Discord: skemono',
        '🌍 Idiomas: Español 🇪🇸 • Inglés 🇺🇸 • Japonés 🇯🇵',
        '✨ Disponible para proyectos innovadores'
      ],
      hasDownload: true // Special flag for download button
    }
  }
]

const Portfolio = () => {
  const [currentBiome, setCurrentBiome] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef(null)

  const nextBiome = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentBiome((prev) => (prev + 1) % biomes.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const prevBiome = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentBiome((prev) => (prev - 1 + biomes.length) % biomes.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const goToBiome = (index) => {
    if (isTransitioning || index === currentBiome) return
    setIsTransitioning(true)
    setCurrentBiome(index)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextBiome()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevBiome()
      }
    }

    const handleWheel = (e) => {
      if (isTransitioning) return
      e.preventDefault()
      
      if (e.deltaY > 0) {
        nextBiome()
      } else {
        prevBiome()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [isTransitioning])

  return (
    <motion.div
      ref={containerRef}
      className="portfolio-carousel"
      style={{
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
        boxSizing: 'border-box'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Navigation Dots */}
      <div style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {biomes.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToBiome(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.7)',
              background: index === currentBiome ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Centered Navigation Arrows */}
      <div style={{
        position: 'fixed',
        bottom: '4rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <motion.button
          onClick={prevBiome}
          disabled={isTransitioning}
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isTransitioning ? 0.5 : 1
          }}
          whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.2)' }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>

        <motion.button
          onClick={nextBiome}
          disabled={isTransitioning}
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.7)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isTransitioning ? 0.5 : 1
          }}
          whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.2)' }}
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </div>

      {/* Biome Navigation Indicator */}
      <div style={{
        position: 'fixed',
        top: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        color: 'white',
        textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {biomes[currentBiome].title}
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {currentBiome + 1} / {biomes.length}
        </div>
      </div>

      {/* Biome Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBiome}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{
            width: '100%',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <BiomeSection
            biome={biomes[currentBiome]}
            index={currentBiome}
          />
        </motion.div>
      </AnimatePresence>

      {/* Centered Instructions */}
    <motion.div
        style={{
            position: 'fixed',
            bottom: '1rem',
            left: '0',
            right: '0',
            zIndex: 1000,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            margin: '0 auto',
            width: 'fit-content'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
    >
        <div>Navegar: Flechas • Scroll • Click flechas/puntos</div>
    </motion.div>

    </motion.div>
  )
}

export default Portfolio