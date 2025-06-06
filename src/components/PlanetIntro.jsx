import { useEffect, useRef } from 'react'
import { motion } from "motion/react"
import * as THREE from 'three'

const PlanetIntro = ({ onComplete }) => {
    const mountRef = useRef(null)
    const sceneRef = useRef()

    useEffect(() => {
        if (!mountRef.current) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setClearColor(0x000000, 1)
        mountRef.current.appendChild(renderer.domElement)

        const geometry = new THREE.SphereGeometry(2, 64, 64)
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const ctx = canvas.getContext('2d')
        
        const noise = (x, y) => {
            const n1 = Math.sin(x * 2) * Math.cos(y * 2)
            const n2 = Math.sin(x * 4) * Math.cos(y * 4) * 0.5
            const n3 = Math.sin(x * 8) * Math.cos(y * 8) * 0.25
            const total = (n1 + n2 + n3) / 1.75
            return total * 0.5 + 0.5
        }
        
        for (let i = 0; i < canvas.height; i++) {
            for (let j = 0; j < canvas.width; j++) {
                const lat = (i / canvas.height) * Math.PI
                const lon = (j / canvas.width) * Math.PI * 2
                const elevation = noise(lat, lon)
                
                if (elevation > 0.6) {
                    const green = 50 + (elevation - 0.6) * 200
                    ctx.fillStyle = `rgb(0, ${Math.min(255, green)}, 0)`
                } else {
                    const blue = 50 + (0.6 - elevation) * 100
                    ctx.fillStyle = `rgb(0, 0, ${Math.min(255, blue)})`
                }
                ctx.fillRect(j, i, 1, 1)
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshPhongMaterial({ 
            map: texture,
            shininess: 30,
            specular: 0x222222
        })
        const planet = new THREE.Mesh(geometry, material)
        scene.add(planet)

        const starsGeometry = new THREE.BufferGeometry()
        const starsVertices = []
        for (let i = 0; i < 1000; i++) {
            starsVertices.push(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            )
        }
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
        const starsMaterial = new THREE.PointsMaterial({ size: 0.3, color: 0xffffff })
        const stars = new THREE.Points(starsGeometry, starsMaterial)
        scene.add(stars)

        const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
        scene.add(ambientLight)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 3, 5)
        scene.add(directionalLight)

        camera.position.set(0, 0, 15)
        camera.lookAt(0, 0, 0)

        let time = 0
        const animate = () => {
            time += 0.016

            planet.rotation.y += 0.003
            stars.rotation.y += 0.0005
            
            const orbitRadius = 12
            camera.position.x = Math.sin(time * 0.3) * orbitRadius
            camera.position.z = Math.cos(time * 0.3) * orbitRadius
            camera.position.y = Math.sin(time * 0.15) * 3
            camera.lookAt(0, 0, 0)

            renderer.render(scene, camera)
            sceneRef.current.animationId = requestAnimationFrame(animate)
        }

        sceneRef.current = { scene, camera, renderer, planet, animationId: 0 }
        animate()

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (sceneRef.current) {
                cancelAnimationFrame(sceneRef.current.animationId)
                if (mountRef.current && renderer.domElement) {
                    mountRef.current.removeChild(renderer.domElement)
                }
                renderer.dispose()
                geometry.dispose()
                material.dispose()
                texture.dispose()
            }
        }
    }, [onComplete])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="planet-intro"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 30%, #0f3460 70%, #000000 100%)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
            
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 2 }}
                style={{
                    position: 'absolute',
                    top: '20%',
                    width: '100%',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                    zIndex: 10,
                    transform: 'translateY(-50%)'
                }}
            >
                June Herrera Watanabe
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    width: '100%',
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    zIndex: 10
                }}
            >
                Ingeniería en Ciencias de la Computación
            </motion.div>


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 7, duration: 2 }}
                onAnimationComplete={() => onComplete()}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'black',
                    zIndex: 1001
                }}
            />
        </motion.div>
    )
}

export default PlanetIntro