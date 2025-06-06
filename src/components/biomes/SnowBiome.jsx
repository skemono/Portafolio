import { useEffect, useRef } from 'react'

const SnowBiome = () => {
    const canvasRef = useRef(null)
    const animationRef = useRef()
    const snowInstanceRef = useRef()

    useEffect(() => {
        if (!canvasRef.current) return

        class SnowyPineForest {
            constructor(canvas) {
                this.canvas = canvas
                this.ctx = this.canvas.getContext('2d')
                this.particles = []
                this.animals = []
                this.snowflakes = []
                this.sun = null
                this.time = 0
                this.mouse = { x: 0, y: 0 }
                this.windStrength = 1
                this.windDirection = 0
                
                this.init()
                this.createForest()
                this.createAnimals()
                this.createSun()
                this.createSnowflakes(150)
                this.animate()
            }
            
            init() {
                this.canvas.width = window.innerWidth
                this.canvas.height = window.innerHeight
                
                this.setupControls()
                window.addEventListener('resize', () => this.onWindowResize())
            }
            
            setupControls() {
                document.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX
                    this.mouse.y = e.clientY
                })
            }
            
            createSun() {
                const sunX = this.canvas.width * 0.85
                const sunY = this.canvas.height * 0.15
                
                this.sun = {
                    x: sunX,
                    y: sunY,
                    baseSize: 35,
                    size: 35,
                    color: '#F0F8FF',
                    pulseSpeed: 0.02,
                    pulsePhase: 0,
                    glowIntensity: 1
                }
            }
            
            createSnowflakes(count) {
                for (let i = 0; i < count; i++) {
                    const snowflake = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        size: Math.random() * 4 + 2,
                        baseSize: Math.random() * 4 + 2,
                        fallSpeed: Math.random() * 1 + 0.5,
                        swaySpeed: Math.random() * 0.02 + 0.01,
                        swayAmount: Math.random() * 20 + 10,
                        swayPhase: Math.random() * Math.PI * 2,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.05,
                        opacity: Math.random() * 0.8 + 0.2,
                        windSensitivity: Math.random() * 0.8 + 0.3
                    }
                    this.snowflakes.push(snowflake)
                }
            }
            
            createForest() {
                console.log('Creating snowy pine forest...')
                
                this.createPineTrees(2500)
                this.createUndergrowth(800)
                
                console.log('Total particles:', this.particles.length)
            }
            
            createAnimals() {
                console.log('Creating winter animals...')
                
                // Create fat foxes
                for (let i = 0; i < 4; i++) {
                    this.createFox()
                }
                
                // Create fat bears
                for (let i = 0; i < 3; i++) {
                    this.createBear()
                }
                
                console.log('Total animals:', this.animals.length)
            }
                        createFox() {
                const fox = {
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height - 65 - Math.random() * 20,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'fox',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    wanderTimer: 0,
                    wanderTarget: { x: 0, y: 0 },
                    size: 1.1 + Math.random() * 0.3,
                    idleTimer: 0,
                    idleDuration: 2 + Math.random() * 4,
                    isWalking: false,
                    breathePhase: Math.random() * Math.PI * 2
                }
                
                const bodyParts = [
                    // Main fat body - round and fluffy
                    { x: 0, y: 0, size: 28, color: '#FF6347', type: 'body' },
                    { x: -8, y: -3, size: 26, color: '#FF4500', type: 'body' },
                    { x: 8, y: -3, size: 26, color: '#FF6347', type: 'body' },
                    { x: 0, y: -7, size: 24, color: '#FF4500', type: 'body' },
                    { x: 0, y: 7, size: 24, color: '#FF6347', type: 'body' },
                    { x: -12, y: 4, size: 22, color: '#FF4500', type: 'body' },
                    { x: 12, y: 4, size: 22, color: '#FF6347', type: 'body' },
                    
                    // White belly
                    { x: -3, y: 8, size: 18, color: '#FFFFFF', type: 'belly' },
                    { x: 3, y: 8, size: 18, color: '#FFFFFF', type: 'belly' },
                    { x: 0, y: 12, size: 15, color: '#FFFFFF', type: 'belly' },
                    
                    // Head
                    { x: -22, y: -8, size: 16, color: '#FF6347', type: 'head' },
                    { x: -28, y: -6, size: 14, color: '#FF4500', type: 'head' },
                    
                    // Snout
                    { x: -32, y: -4, size: 8, color: '#FFFFFF', type: 'snout' },
                    { x: -36, y: -3, size: 4, color: '#000000', type: 'nose' },
                    
                    // Ears
                    { x: -26, y: -16, size: 6, color: '#FF4500', type: 'ear' },
                    { x: -20, y: -16, size: 6, color: '#FF6347', type: 'ear' },
                    { x: -26, y: -16, size: 3, color: '#FFFFFF', type: 'ear_inner' },
                    { x: -20, y: -16, size: 3, color: '#FFFFFF', type: 'ear_inner' },
                    
                    // Eyes
                    { x: -26, y: -10, size: 2, color: '#000000', type: 'eye' },
                    { x: -22, y: -10, size: 2, color: '#000000', type: 'eye' },
                    
                    // Legs
                    { x: -10, y: 28, size: 7, color: '#8B4513', type: 'leg' },
                    { x: -3, y: 28, size: 7, color: '#8B4513', type: 'leg' },
                    { x: 3, y: 28, size: 7, color: '#8B4513', type: 'leg' },
                    { x: 10, y: 28, size: 7, color: '#8B4513', type: 'leg' },
                    { x: -10, y: 34, size: 5, color: '#000000', type: 'paw' },
                    { x: -3, y: 34, size: 5, color: '#000000', type: 'paw' },
                    { x: 3, y: 34, size: 5, color: '#000000', type: 'paw' },
                    { x: 10, y: 34, size: 5, color: '#000000', type: 'paw' },
                    
                    // Fluffy tail
                    { x: 20, y: -2, size: 12, color: '#FF6347', type: 'tail' },
                    { x: 28, y: -4, size: 10, color: '#FF4500', type: 'tail' },
                    { x: 34, y: -6, size: 8, color: '#FFFFFF', type: 'tail_tip' }
                ]
                
                fox.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.02 + 0.01,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.015 + 0.008,
                    breatheAmount: part.type === 'body' ? 0.15 : 0.08
                }))
                
                this.animals.push(fox)
            }
            
            createBear() {
                const bear = {
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height - 75 - Math.random() * 15,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'bear',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    wanderTimer: 0,
                    wanderTarget: { x: 0, y: 0 },
                    size: 1.3 + Math.random() * 0.4,
                    idleTimer: 0,
                    idleDuration: 3 + Math.random() * 5,
                    isWalking: false,
                    breathePhase: Math.random() * Math.PI * 2
                }
                
                const bodyParts = [
                    // Main massive body
                    { x: 0, y: 0, size: 40, color: '#8B4513', type: 'body' },
                    { x: -12, y: -5, size: 38, color: '#A0522D', type: 'body' },
                    { x: 12, y: -5, size: 38, color: '#8B4513', type: 'body' },
                    { x: 0, y: -12, size: 35, color: '#A0522D', type: 'body' },
                    { x: 0, y: 12, size: 35, color: '#8B4513', type: 'body' },
                    { x: -18, y: 6, size: 32, color: '#A0522D', type: 'body' },
                    { x: 18, y: 6, size: 32, color: '#8B4513', type: 'body' },
                    { x: -8, y: 8, size: 30, color: '#A0522D', type: 'body' },
                    { x: 8, y: 8, size: 30, color: '#8B4513', type: 'body' },
                    
                    // Head
                    { x: -30, y: -12, size: 22, color: '#8B4513', type: 'head' },
                    { x: -38, y: -10, size: 18, color: '#A0522D', type: 'head' },
                    
                    // Snout
                    { x: -42, y: -8, size: 12, color: '#654321', type: 'snout' },
                    { x: -47, y: -6, size: 6, color: '#000000', type: 'nose' },
                    
                    // Ears
                    { x: -34, y: -22, size: 8, color: '#8B4513', type: 'ear' },
                    { x: -26, y: -22, size: 8, color: '#A0522D', type: 'ear' },
                    { x: -34, y: -22, size: 4, color: '#654321', type: 'ear_inner' },
                    { x: -26, y: -22, size: 4, color: '#654321', type: 'ear_inner' },
                    
                    // Eyes
                    { x: -36, y: -16, size: 3, color: '#000000', type: 'eye' },
                    { x: -30, y: -16, size: 3, color: '#000000', type: 'eye' },
                    
                    // Massive legs
                    { x: -15, y: 35, size: 12, color: '#654321', type: 'leg' },
                    { x: -5, y: 35, size: 12, color: '#654321', type: 'leg' },
                    { x: 5, y: 35, size: 12, color: '#654321', type: 'leg' },
                    { x: 15, y: 35, size: 12, color: '#654321', type: 'leg' },
                    { x: -15, y: 44, size: 8, color: '#000000', type: 'paw' },
                    { x: -5, y: 44, size: 8, color: '#000000', type: 'paw' },
                    { x: 5, y: 44, size: 8, color: '#000000', type: 'paw' },
                    { x: 15, y: 44, size: 8, color: '#000000', type: 'paw' },
                    
                    // Small tail
                    { x: 35, y: 2, size: 6, color: '#8B4513', type: 'tail' }
                ]
                
                bear.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.015 + 0.008,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.012 + 0.006,
                    breatheAmount: part.type === 'body' ? 0.12 : 0.06
                }))
                
                this.animals.push(bear)
            }
                        createPineTrees(count) {
                const treeCount = 30
                const spacing = this.canvas.width / treeCount
                
                const treeClusters = []
                for (let i = 0; i < treeCount; i++) {
                    const baseX = i * spacing + (Math.random() - 0.5) * spacing * 0.3
                    const baseY = this.canvas.height - Math.random() * 40 - 20
                    
                    treeClusters.push({
                        x: baseX,
                        y: baseY,
                        height: Math.random() * 500 + 400,
                        width: Math.random() * 80 + 40,
                        lean: (Math.random() - 0.5) * 0.15,
                        foliageDensity: Math.random() * 0.3 + 0.8,
                        snowAmount: Math.random() * 0.4 + 0.3,
                        swayPhase: Math.random() * Math.PI * 2,
                        breathePhase: Math.random() * Math.PI * 2,
                        windSensitivity: Math.random() * 0.4 + 0.4,
                        treeVariant: Math.floor(Math.random() * 4) // Different pine varieties
                    })
                }
                
                treeClusters.forEach(tree => {
                    const particlesPerTree = Math.floor(count / treeClusters.length)
                    
                    for (let i = 0; i < particlesPerTree; i++) {
                        const progress = i / particlesPerTree
                        
                        let particle
                        
                        if (progress < 0.2) {
                            // Trunk with snow
                            const trunkWidth = tree.width * (1 - progress * 0.7)
                            const leanOffset = tree.lean * progress * tree.height
                            
                            let trunkColor
                            switch (tree.treeVariant) {
                                case 0: // Dark pine
                                    trunkColor = `hsl(20, ${20 + Math.random() * 15}%, ${10 + Math.random() * 12}%)`
                                    break
                                case 1: // Silver pine
                                    trunkColor = `hsl(0, ${5 + Math.random() * 10}%, ${25 + Math.random() * 15}%)`
                                    break
                                case 2: // Brown pine
                                    trunkColor = `hsl(25, ${30 + Math.random() * 20}%, ${15 + Math.random() * 15}%)`
                                    break
                                default: // Standard pine
                                    trunkColor = `hsl(15, ${25 + Math.random() * 20}%, ${12 + Math.random() * 18}%)`
                            }
                            
                            particle = {
                                x: tree.x + (Math.random() - 0.5) * trunkWidth + leanOffset,
                                y: tree.y - progress * tree.height,
                                size: Math.random() * 10 + 6,
                                baseSize: Math.random() * 10 + 6,
                                color: trunkColor,
                                type: 'trunk',
                                originalX: tree.x + leanOffset,
                                originalY: tree.y - progress * tree.height,
                                swayAmount: Math.random() * 1.2 + 0.4,
                                swaySpeed: Math.random() * 0.012 + 0.004,
                                swayPhase: tree.swayPhase + Math.random() * 0.5,
                                breatheSpeed: Math.random() * 0.018 + 0.008,
                                breathePhase: tree.breathePhase + Math.random() * Math.PI,
                                breatheAmount: 0.15 + Math.random() * 0.25,
                                windSensitivity: tree.windSensitivity * (1 - progress * 0.3),
                                height: progress,
                                cursorSensitivity: 0.25 + Math.random() * 0.25,
                                cursorOffset: { x: 0, y: 0 }
                            }
                        } else {
                            // Pine foliage with snow
                            const canopyProgress = (progress - 0.2) / 0.8
                            
                            // Create layered pine structure
                            const layerIndex = Math.floor(canopyProgress * 8)
                            const layerProgress = (canopyProgress * 8) - layerIndex
                            
                            // Pine trees get narrower towards the top
                            const layerRadius = (1 - canopyProgress * 0.85) * tree.width + 20
                            const yOffset = canopyProgress * tree.height * 0.6
                            
                            // Vary pine colors
                            let foliageColor, snowColor
                            switch (tree.treeVariant) {
                                case 0: // Dark pine
                                    foliageColor = `hsl(${120 + Math.random() * 15}, ${60 + Math.random() * 20}%, ${12 + Math.random() * 15}%)`
                                    break
                                case 1: // Blue pine
                                    foliageColor = `hsl(${180 + Math.random() * 20}, ${40 + Math.random() * 25}%, ${20 + Math.random() * 18}%)`
                                    break
                                case 2: // Green pine
                                    foliageColor = `hsl(${100 + Math.random() * 30}, ${50 + Math.random() * 30}%, ${18 + Math.random() * 20}%)`
                                    break
                                default: // Standard pine
                                    foliageColor = `hsl(${110 + Math.random() * 25}, ${55 + Math.random() * 25}%, ${15 + Math.random() * 18}%)`
                            }
                            
                            snowColor = `hsl(${200 + Math.random() * 40}, ${20 + Math.random() * 30}%, ${85 + Math.random() * 15}%)`
                            
                            const foliageSize = Math.random() * 14 + 8
                            
                            // Add snow particles on top of foliage
                            if (Math.random() < tree.snowAmount) {
                                const angle = Math.random() * Math.PI * 2
                                const radius = Math.random() * layerRadius * 0.8
                                const leanOffset = tree.lean * (0.2 + canopyProgress * 0.8) * tree.height
                                
                                // Snow particle
                                const snowParticle = {
                                    x: tree.x + Math.cos(angle) * radius + leanOffset,
                                    y: tree.y - tree.height * 0.2 - yOffset - 5,
                                    size: Math.random() * 8 + 4,
                                    baseSize: Math.random() * 8 + 4,
                                    color: snowColor,
                                    type: 'snow',
                                    originalX: tree.x + Math.cos(angle) * radius + leanOffset,
                                    originalY: tree.y - tree.height * 0.2 - yOffset - 5,
                                    swayAmount: Math.random() * 2 + 1,
                                    swaySpeed: Math.random() * 0.02 + 0.01,
                                    swayPhase: tree.swayPhase + Math.random() * 1.5,
                                    breatheSpeed: Math.random() * 0.025 + 0.015,
                                    breathePhase: tree.breathePhase + Math.random() * Math.PI,
                                    breatheAmount: 0.3 + Math.random() * 0.4,
                                    windSensitivity: tree.windSensitivity * (1.2 + canopyProgress),
                                    cursorSensitivity: 0.4 + Math.random() * 0.4,
                                    cursorOffset: { x: 0, y: 0 }
                                }
                                this.particles.push(snowParticle)
                            }
                            
                            const angle = Math.random() * Math.PI * 2
                            const radius = Math.random() * layerRadius * tree.foliageDensity
                            const leanOffset = tree.lean * (0.2 + canopyProgress * 0.8) * tree.height
                            
                            particle = {
                                x: tree.x + Math.cos(angle) * radius + leanOffset,
                                y: tree.y - tree.height * 0.2 - yOffset,
                                size: foliageSize,
                                baseSize: foliageSize,
                                color: foliageColor,
                                type: 'foliage',
                                originalX: tree.x + Math.cos(angle) * radius + leanOffset,
                                originalY: tree.y - tree.height * 0.2 - yOffset,
                                swayAmount: Math.random() * 2.5 + 1.5,
                                swaySpeed: Math.random() * 0.02 + 0.012,
                                swayPhase: tree.swayPhase + Math.random() * 1.5,
                                breatheSpeed: Math.random() * 0.025 + 0.015,
                                breathePhase: tree.breathePhase + Math.random() * Math.PI,
                                breatheAmount: 0.3 + Math.random() * 0.4,
                                windSensitivity: tree.windSensitivity * (1.2 + canopyProgress),
                                cursorSensitivity: 0.5 + Math.random() * 0.4,
                                cursorOffset: { x: 0, y: 0 }
                            }
                        }
                        
                        this.particles.push(particle)
                    }
                })
            }
            
            createUndergrowth(count) {
                for (let i = 0; i < count; i++) {
                    const baseSize = Math.random() * 6 + 8
                    
                    // Winter undergrowth colors
                    const isSnowCovered = Math.random() < 0.6
                    let color
                    
                    if (isSnowCovered) {
                        color = `hsl(${200 + Math.random() * 40}, ${15 + Math.random() * 25}%, ${80 + Math.random() * 20}%)`
                    } else {
                        const grassHue = 70 + Math.random() * 40
                        const grassSat = 30 + Math.random() * 20
                        const grassLight = 20 + Math.random() * 15
                        color = `hsl(${grassHue}, ${grassSat}%, ${grassLight}%)`
                    }
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: this.canvas.height - Math.random() * 50,
                        size: baseSize,
                        baseSize: baseSize,
                        color: color,
                        type: isSnowCovered ? 'snow_bush' : 'undergrowth',
                        originalX: 0,
                        originalY: 0,
                        swayAmount: Math.random() * 1.5 + 0.8,
                        swaySpeed: Math.random() * 0.02 + 0.008,
                        swayPhase: Math.random() * Math.PI * 2,
                        breatheSpeed: Math.random() * 0.02 + 0.012,
                        breathePhase: Math.random() * Math.PI * 2,
                        breatheAmount: 0.3 + Math.random() * 0.4,
                        windSensitivity: Math.random() * 0.8 + 0.4,
                        cursorSensitivity: 0.5 + Math.random() * 0.3,
                        cursorOffset: { x: 0, y: 0 }
                    }
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }
            }
                        animate() {
                this.time += 0.016
                
                // Gentle winter wind
                this.windDirection = Math.sin(this.time * 0.008) * 0.3 + Math.sin(this.time * 0.002) * 0.2
                this.windStrength = (Math.sin(this.time * 0.006) + 1) * 0.3 + 0.2
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                
                this.drawSun()
                this.animateParticles()
                this.animateSnowflakes()
                this.animateAnimals()
                this.drawParticles()
                this.drawSnowflakes()
                this.drawAnimals()
                
                animationRef.current = requestAnimationFrame(() => this.animate())
            }
            
            drawSun() {
                this.ctx.save()
                
                // Animate sun pulsing (winter sun is dimmer)
                this.sun.pulsePhase += this.sun.pulseSpeed
                this.sun.size = this.sun.baseSize * (1 + Math.sin(this.sun.pulsePhase) * 0.08)
                
                // Create soft winter glow
                const glowSize = this.sun.size * 3
                const gradient = this.ctx.createRadialGradient(
                    this.sun.x, this.sun.y, 0,
                    this.sun.x, this.sun.y, glowSize
                )
                gradient.addColorStop(0, 'rgba(240, 248, 255, 0.7)')
                gradient.addColorStop(0.3, 'rgba(230, 240, 255, 0.5)')
                gradient.addColorStop(0.6, 'rgba(200, 220, 255, 0.3)')
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
                
                this.ctx.globalCompositeOperation = 'screen'
                this.ctx.fillStyle = gradient
                this.ctx.beginPath()
                this.ctx.arc(this.sun.x, this.sun.y, glowSize, 0, Math.PI * 2)
                this.ctx.fill()
                
                this.ctx.globalCompositeOperation = 'source-over'
                this.ctx.globalAlpha = 0.8
                this.ctx.fillStyle = this.sun.color
                this.ctx.beginPath()
                this.ctx.arc(this.sun.x, this.sun.y, this.sun.size, 0, Math.PI * 2)
                this.ctx.fill()
                
                this.ctx.restore()
            }
            
            animateSnowflakes() {
                this.snowflakes.forEach(snowflake => {
                    const windEffect = this.windStrength * snowflake.windSensitivity
                    const windSway = Math.sin(this.time * snowflake.swaySpeed + snowflake.swayPhase) * snowflake.swayAmount
                    
                    snowflake.y += snowflake.fallSpeed
                    snowflake.x += windSway * this.windDirection + windEffect * this.windDirection * 2
                    snowflake.rotation += snowflake.rotationSpeed
                    
                    if (snowflake.y > this.canvas.height + 10) {
                        snowflake.y = -10
                        snowflake.x = Math.random() * this.canvas.width
                    }
                    if (snowflake.x < -50) snowflake.x = this.canvas.width + 50
                    if (snowflake.x > this.canvas.width + 50) snowflake.x = -50
                })
            }
            
            animateParticles() {
                this.particles.forEach(particle => {
                    const breathe = Math.sin(this.time * particle.breatheSpeed + particle.breathePhase) * particle.breatheAmount
                    particle.size = particle.baseSize * (1 + breathe)
                    
                    const windEffect = this.windStrength * particle.windSensitivity
                    const windSway = Math.sin(this.time * 0.015 + particle.swayPhase) * windEffect
                    
                    const dx = this.mouse.x - particle.x
                    const dy = this.mouse.y - particle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const maxDistance = 120
                    
                    if (distance < maxDistance) {
                        const force = (1 - distance / maxDistance) * particle.cursorSensitivity
                        const targetOffsetX = -dx / distance * force * 12
                        const targetOffsetY = -dy / distance * force * 12
                        
                        particle.cursorOffset.x += (targetOffsetX - particle.cursorOffset.x) * 0.08
                        particle.cursorOffset.y += (targetOffsetY - particle.cursorOffset.y) * 0.08
                    } else {
                        particle.cursorOffset.x *= 0.92
                        particle.cursorOffset.y *= 0.92
                    }
                    
                    switch (particle.type) {
                        case 'trunk':
                            const trunkWind = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount
                            const heightMultiplier = particle.height * 1.5
                            
                            particle.x = particle.originalX + (trunkWind + windSway * heightMultiplier) * this.windDirection + particle.cursorOffset.x
                            particle.y = particle.originalY + particle.cursorOffset.y * 0.2
                            break
                            
                        case 'foliage':
                        case 'snow':
                            const foliageWind = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount
                            const foliageWindEffect = windSway * 2
                            
                            particle.x = particle.originalX + (foliageWind + foliageWindEffect) * this.windDirection + particle.cursorOffset.x
                            particle.y = particle.originalY + Math.sin(this.time * 0.015 + particle.swayPhase) * windEffect * 0.6 + particle.cursorOffset.y * 0.5
                            break
                            
                        case 'undergrowth':
                        case 'snow_bush':
                            const grassWind = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount
                            const grassWindEffect = windSway * 1.5
                            
                            particle.x = particle.originalX + (grassWind + grassWindEffect) * this.windDirection + particle.cursorOffset.x
                            particle.y = particle.originalY + Math.sin(this.time * particle.swaySpeed * 1.5 + particle.swayPhase) * windEffect * 0.3 + particle.cursorOffset.y * 0.15
                            break
                    }
                })
            }
            
            animateAnimals() {
                this.animals.forEach(animal => {
                    animal.breathePhase += 0.015
                    animal.idleTimer += 0.016
                    
                    if (animal.idleTimer > animal.idleDuration) {
                        animal.idleTimer = 0
                        animal.isWalking = !animal.isWalking
                        animal.idleDuration = animal.isWalking ? 
                            (animal.type === 'bear' ? 3 + Math.random() * 4 : 2 + Math.random() * 3) :
                            (animal.type === 'bear' ? 2 + Math.random() * 3 : 1.5 + Math.random() * 2.5)
                        
                        if (animal.isWalking) {
                            animal.wanderTarget.x = Math.random() * this.canvas.width
                            animal.wanderTarget.y = animal.y + (Math.random() - 0.5) * 25
                            animal.wanderTarget.y = Math.max(this.canvas.height - 90, Math.min(this.canvas.height - 50, animal.wanderTarget.y))
                        }
                    }
                    
                    if (animal.isWalking) {
                        const dx = animal.wanderTarget.x - animal.x
                        const dy = animal.wanderTarget.y - animal.y
                        const distance = Math.sqrt(dx * dx + dy * dy)
                        
                        if (distance > 15) {
                            const speed = animal.type === 'fox' ? 0.25 : animal.type === 'bear' ? 0.15 : 0.2
                            animal.vx = (dx / distance) * speed
                            animal.vy = (dy / distance) * speed * 0.1
                            
                            animal.direction = animal.vx > 0 ? -1 : 1
                        } else {
                            animal.vx *= 0.85
                            animal.vy *= 0.85
                        }
                        
                        animal.x += animal.vx
                        animal.y += animal.vy
                        
                        animal.animPhase += animal.type === 'bear' ? 0.03 : 0.04
                    } else {
                        animal.vx *= 0.75
                        animal.vy *= 0.75
                    }
                    
                    animal.x = Math.max(60, Math.min(this.canvas.width - 60, animal.x))
                    animal.y = Math.max(this.canvas.height - 90, Math.min(this.canvas.height - 50, animal.y))
                    
                    animal.parts.forEach(part => {
                        part.animPhase += part.animSpeed
                        
                        const breathe = Math.sin(animal.breathePhase + part.animPhase) * part.breatheAmount
                        part.size = part.baseSize * (1 + breathe)
                        
                        if ((part.type === 'leg' || part.type === 'paw') && animal.isWalking) {
                            const walkBob = Math.sin(animal.animPhase * 2 + part.animPhase) * Math.abs(animal.vx) * 8
                            part.y = part.originalY + walkBob
                        } else if (part.type === 'leg' || part.type === 'paw') {
                            part.y += (part.originalY - part.y) * 0.1
                        }
                        
                        if (part.type === 'tail' || part.type === 'tail_tip') {
                            const tailWag = Math.sin(animal.animPhase * (animal.isWalking ? 2.5 : 1.2)) * (animal.isWalking ? 4 : 2)
                            part.x = part.originalX + tailWag * animal.direction
                        }
                        
                        if (part.type === 'head' || part.type === 'ear' || part.type === 'ear_inner' || part.type === 'eye' || part.type === 'snout' || part.type === 'nose') {
                            const headBob = Math.sin(animal.animPhase * 1.3) * Math.abs(animal.vx) * (animal.isWalking ? 2.5 : 0.8)
                            part.y = part.originalY + headBob
                        }
                    })
                })
            }
                        drawSnowflakes() {
                this.snowflakes.forEach(snowflake => {
                    this.ctx.save()
                    this.ctx.translate(snowflake.x, snowflake.y)
                    this.ctx.rotate(snowflake.rotation)
                    this.ctx.globalAlpha = snowflake.opacity
                    
                    this.ctx.fillStyle = '#FFFFFF'
                    this.ctx.beginPath()
                    this.ctx.arc(0, 0, snowflake.size, 0, Math.PI * 2)
                    this.ctx.fill()
                    
                    // Add sparkle effect
                    this.ctx.globalAlpha = snowflake.opacity * 0.5
                    this.ctx.fillStyle = '#E6F3FF'
                    this.ctx.beginPath()
                    this.ctx.arc(0, 0, snowflake.size * 0.6, 0, Math.PI * 2)
                    this.ctx.fill()
                    
                    this.ctx.restore()
                })
            }
            
            drawParticles() {
                this.particles.forEach(particle => {
                    this.ctx.save()
                    
                    if (particle.type === 'trunk') {
                        this.ctx.globalAlpha = 0.85
                    } else if (particle.type === 'foliage') {
                        this.ctx.globalAlpha = 0.75
                    } else if (particle.type === 'snow') {
                        this.ctx.globalAlpha = 0.9
                    } else {
                        this.ctx.globalAlpha = 0.7
                    }
                    
                    this.ctx.fillStyle = particle.color
                    this.ctx.beginPath()
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                    this.ctx.fill()
                    
                    this.ctx.restore()
                })
            }
            
            drawAnimals() {
                this.animals.forEach(animal => {
                    this.ctx.save()
                    this.ctx.translate(animal.x, animal.y)
                    this.ctx.scale(animal.direction * animal.size, animal.size)
                    
                    animal.parts.forEach(part => {
                        this.ctx.save()
                        this.ctx.globalAlpha = 0.95
                        this.ctx.fillStyle = part.color
                        this.ctx.beginPath()
                        this.ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2)
                        this.ctx.fill()
                        this.ctx.restore()
                    })
                    
                    this.ctx.restore()
                })
            }
            
            onWindowResize() {
                this.canvas.width = window.innerWidth
                this.canvas.height = window.innerHeight
            }
        }

        // Initialize the snow biome
        snowInstanceRef.current = new SnowyPineForest(canvasRef.current)

        // Cleanup function
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            if (snowInstanceRef.current) {
                window.removeEventListener('resize', snowInstanceRef.current.onWindowResize)
            }
        }
    }, [])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (snowInstanceRef.current) {
                snowInstanceRef.current.onWindowResize()
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, #B0E0E6 0%, #E6F3FF 30%, #F0F8FF 70%, #FFFFFF 100%)',
                overflow: 'hidden',
                margin: 0,
                padding: 0
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%'
                }}
            />
        </div>
    )
}

export default SnowBiome