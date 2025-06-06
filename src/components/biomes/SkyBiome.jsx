import { useEffect, useRef } from 'react'

const SkyBiome = () => {
    const canvasRef = useRef(null)
    const animationRef = useRef()
    const skyInstanceRef = useRef()

    useEffect(() => {
        if (!canvasRef.current) return

        class Dense2DParticleSky {
            constructor(canvas) {
                this.canvas = canvas
                this.ctx = this.canvas.getContext('2d')
                this.particles = []
                this.birds = []
                this.sun = null
                this.rainbow = null
                this.time = 0
                this.mouse = { x: 0, y: 0 }
                this.windStrength = 1
                this.windDirection = 0
                
                this.init()
                this.createSky()
                this.createBirds()
                this.createSun()
                this.createRainbow()
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
                    baseSize: 50,
                    size: 50,
                    color: '#FFD700',
                    pulseSpeed: 0.02,
                    pulsePhase: 0,
                    glowIntensity: 1
                }
            }
            
            createRainbow() {
                this.rainbow = {
                    centerX: this.canvas.width * 0.5,
                    centerY: this.canvas.height * 1.2,
                    radius: this.canvas.width * 0.8,
                    width: 40,
                    opacity: 0.4,
                    animPhase: 0,
                    breatheSpeed: 0.01,
                    colors: [
                        '#FF0000', // Red
                        '#FF7F00', // Orange
                        '#FFFF00', // Yellow
                        '#00FF00', // Green
                        '#0000FF', // Blue
                        '#4B0082', // Indigo
                        '#9400D3'  // Violet
                    ]
                }
            }
            
            createSky() {
                console.log('Creating windy 2D sky...')
                
                this.createClouds(2500)
                this.createStars(150)
                this.createFloatingParticles(800)
                
                console.log('Total particles:', this.particles.length)
            }
            
            createBirds() {
                console.log('Creating birds...')
                
                // Create different bird species (smaller and fewer)
                for (let i = 0; i < 2; i++) {
                    this.createCardinal()
                }
                
                for (let i = 0; i < 3; i++) {
                    this.createBlueJay()
                }
                
                for (let i = 0; i < 2; i++) {
                    this.createRobin()
                }
                
                for (let i = 0; i < 3; i++) {
                    this.createCanary()
                }
                
                console.log('Total birds:', this.birds.length)
            }
            
            createCardinal() {
                const bird = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * (this.canvas.height * 0.7) + 50,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 1.5,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'cardinal',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    flapPhase: Math.random() * Math.PI * 2,
                    flapSpeed: 0.3,
                    size: 0.7 + Math.random() * 0.3, // Smaller birds
                    breathePhase: Math.random() * Math.PI * 2,
                    glideTimer: 0,
                    glideDuration: 2 + Math.random() * 3,
                    isFlapping: true
                }
                
                const bodyParts = [
                    // Fat round body - concentrated like a ball
                    { x: 0, y: 0, size: 18, color: '#DC143C', type: 'body' },
                    { x: -6, y: -2, size: 16, color: '#DC143C', type: 'body' },
                    { x: 6, y: -2, size: 16, color: '#DC143C', type: 'body' },
                    { x: 0, y: -5, size: 15, color: '#DC143C', type: 'body' },
                    { x: 0, y: 5, size: 15, color: '#DC143C', type: 'body' },
                    
                    // Head
                    { x: -15, y: -5, size: 11, color: '#DC143C', type: 'head' },
                    { x: -20, y: -4, size: 9, color: '#DC143C', type: 'head' },
                    
                    // Crest
                    { x: -17, y: -12, size: 5, color: '#B22222', type: 'crest' },
                    
                    // Beak
                    { x: -23, y: -3, size: 4, color: '#FF6347', type: 'beak' },
                    
                    // Eyes
                    { x: -18, y: -7, size: 2, color: '#000000', type: 'eye' },
                    
                    // Wings (will animate)
                    { x: -3, y: -8, size: 12, color: '#8B0000', type: 'wing' },
                    { x: 3, y: -8, size: 12, color: '#8B0000', type: 'wing' },
                    
                    // Tail
                    { x: 17, y: 1, size: 8, color: '#8B0000', type: 'tail' },
                ]
                
                bird.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.02 + 0.01,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.015 + 0.008,
                    breatheAmount: part.type === 'body' ? 0.12 : 0.06
                }))
                
                this.birds.push(bird)
            }
            
            createBlueJay() {
                const bird = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * (this.canvas.height * 0.7) + 50,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: (Math.random() - 0.5) * 1.8,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'bluejay',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    flapPhase: Math.random() * Math.PI * 2,
                    flapSpeed: 0.25,
                    size: 0.8 + Math.random() * 0.3, // Smaller birds
                    breathePhase: Math.random() * Math.PI * 2,
                    glideTimer: 0,
                    glideDuration: 1.5 + Math.random() * 2.5,
                    isFlapping: true
                }
                
                const bodyParts = [
                    // Fat round body
                    { x: 0, y: 0, size: 17, color: '#4169E1', type: 'body' },
                    { x: -5, y: -2, size: 15, color: '#4169E1', type: 'body' },
                    { x: 5, y: -2, size: 15, color: '#4169E1', type: 'body' },
                    { x: 0, y: -4, size: 14, color: '#4169E1', type: 'body' },
                    { x: 0, y: 4, size: 14, color: '#4169E1', type: 'body' },
                    
                    // White belly
                    { x: 0, y: 3, size: 12, color: '#F0F8FF', type: 'belly' },
                    { x: -3, y: 5, size: 10, color: '#F0F8FF', type: 'belly' },
                    { x: 3, y: 5, size: 10, color: '#F0F8FF', type: 'belly' },
                    
                    // Head
                    { x: -14, y: -4, size: 10, color: '#4169E1', type: 'head' },
                    { x: -18, y: -3, size: 8, color: '#4169E1', type: 'head' },
                    
                    // Crest
                    { x: -16, y: -10, size: 4, color: '#191970', type: 'crest' },
                    
                    // Beak
                    { x: -21, y: -2, size: 3, color: '#2F4F4F', type: 'beak' },
                    
                    // Eyes
                    { x: -16, y: -6, size: 2, color: '#000000', type: 'eye' },
                    
                    // Wings
                    { x: -3, y: -7, size: 11, color: '#191970', type: 'wing' },
                    { x: 3, y: -7, size: 11, color: '#191970', type: 'wing' },
                    
                    // Tail
                    { x: 16, y: 1, size: 7, color: '#191970', type: 'tail' },
                ]
                
                bird.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.02 + 0.01,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.015 + 0.008,
                    breatheAmount: part.type === 'body' ? 0.12 : 0.06
                }))
                
                this.birds.push(bird)
            }
            
            createRobin() {
                const bird = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * (this.canvas.height * 0.7) + 50,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 1.5,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'robin',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    flapPhase: Math.random() * Math.PI * 2,
                    flapSpeed: 0.28,
                    size: 0.7 + Math.random() * 0.3, // Smaller birds
                    breathePhase: Math.random() * Math.PI * 2,
                    glideTimer: 0,
                    glideDuration: 2 + Math.random() * 3,
                    isFlapping: true
                }
                
                const bodyParts = [
                    // Fat round body
                    { x: 0, y: 0, size: 16, color: '#8B4513', type: 'body' },
                    { x: -4, y: -2, size: 14, color: '#8B4513', type: 'body' },
                    { x: 4, y: -2, size: 14, color: '#8B4513', type: 'body' },
                    { x: 0, y: -4, size: 13, color: '#8B4513', type: 'body' },
                    { x: 0, y: 4, size: 13, color: '#8B4513', type: 'body' },
                    
                    // Red breast
                    { x: -8, y: 1, size: 12, color: '#CD5C5C', type: 'breast' },
                    { x: -4, y: 5, size: 10, color: '#CD5C5C', type: 'breast' },
                    { x: 0, y: 6, size: 9, color: '#CD5C5C', type: 'breast' },
                    
                    // Head
                    { x: -12, y: -4, size: 9, color: '#8B4513', type: 'head' },
                    { x: -16, y: -3, size: 8, color: '#8B4513', type: 'head' },
                    
                    // Beak
                    { x: -19, y: -1, size: 3, color: '#FFD700', type: 'beak' },
                    
                    // Eyes
                    { x: -15, y: -5, size: 2, color: '#000000', type: 'eye' },
                    
                    // Wings
                    { x: -2, y: -7, size: 10, color: '#654321', type: 'wing' },
                    { x: 2, y: -7, size: 10, color: '#654321', type: 'wing' },
                    
                    // Tail
                    { x: 14, y: 0, size: 6, color: '#654321', type: 'tail' },
                ]
                
                bird.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.02 + 0.01,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.015 + 0.008,
                    breatheAmount: part.type === 'body' ? 0.12 : 0.06
                }))
                
                this.birds.push(bird)
            }
            
            createCanary() {
                const bird = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * (this.canvas.height * 0.7) + 50,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 2,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'canary',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    flapPhase: Math.random() * Math.PI * 2,
                    flapSpeed: 0.35,
                    size: 0.6 + Math.random() * 0.2, // Smaller birds
                    breathePhase: Math.random() * Math.PI * 2,
                    glideTimer: 0,
                    glideDuration: 1 + Math.random() * 2,
                    isFlapping: true
                }
                
                const bodyParts = [
                    // Fat round body
                    { x: 0, y: 0, size: 14, color: '#FFFF00', type: 'body' },
                    { x: -3, y: -1, size: 12, color: '#FFFF00', type: 'body' },
                    { x: 3, y: -1, size: 12, color: '#FFFF00', type: 'body' },
                    { x: 0, y: -3, size: 11, color: '#FFFF00', type: 'body' },
                    { x: 0, y: 3, size: 11, color: '#FFFF00', type: 'body' },
                    
                    // Head
                    { x: -10, y: -3, size: 8, color: '#FFD700', type: 'head' },
                    { x: -14, y: -1, size: 7, color: '#FFD700', type: 'head' },
                    
                    // Beak
                    { x: -17, y: -1, size: 3, color: '#FF8C00', type: 'beak' },
                    
                    // Eyes
                    { x: -12, y: -4, size: 1, color: '#000000', type: 'eye' },
                    
                    // Wings
                    { x: -1, y: -5, size: 9, color: '#FFA500', type: 'wing' },
                    { x: 1, y: -5, size: 9, color: '#FFA500', type: 'wing' },
                    
                    // Tail
                    { x: 12, y: 0, size: 5, color: '#FFA500', type: 'tail' },
                ]
                
                bird.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.02 + 0.01,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.015 + 0.008,
                    breatheAmount: part.type === 'body' ? 0.12 : 0.06
                }))
                
                this.birds.push(bird)
            }
            
            createClouds(count) {
                const cloudCount = 25
                const spacing = this.canvas.width / cloudCount
                
                for (let i = 0; i < cloudCount; i++) {
                    const cloudX = i * spacing + (Math.random() - 0.5) * spacing * 0.5
                    const cloudY = Math.random() * this.canvas.height * 0.6 + 50
                    const cloudSize = Math.random() * 150 + 100
                    
                    const particlesPerCloud = Math.floor(count / cloudCount)
                    
                    for (let j = 0; j < particlesPerCloud; j++) {
                        const angle = Math.random() * Math.PI * 2
                        const radius = Math.random() * cloudSize * 0.6
                        
                        const opacity = Math.random() * 0.4 + 0.3
                        const grayValue = Math.floor(200 + Math.random() * 55)
                        
                        const particle = {
                            x: cloudX + Math.cos(angle) * radius,
                            y: cloudY + Math.sin(angle) * radius * 0.6,
                            size: Math.random() * 40 + 20,
                            baseSize: Math.random() * 40 + 20,
                            color: `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${opacity})`,
                            type: 'cloud',
                            originalX: cloudX + Math.cos(angle) * radius,
                            originalY: cloudY + Math.sin(angle) * radius * 0.6,
                            driftSpeed: Math.random() * 0.5 + 0.2, // Increased movement
                            swayAmount: Math.random() * 4 + 2, // Increased sway
                            swaySpeed: Math.random() * 0.02 + 0.01, // Increased sway speed
                            swayPhase: Math.random() * Math.PI * 2,
                            breatheSpeed: Math.random() * 0.025 + 0.015, // Increased breathing
                            breathePhase: Math.random() * Math.PI * 2,
                            breatheAmount: 0.3 + Math.random() * 0.4, // More breathing
                            windSensitivity: Math.random() * 0.6 + 0.4, // More wind sensitive
                            cursorSensitivity: 0.4 + Math.random() * 0.3,
                            cursorOffset: { x: 0, y: 0 }
                        }
                        
                        this.particles.push(particle)
                    }
                }
            }
            
            createStars(count) {
                for (let i = 0; i < count; i++) {
                    const twinkleSpeed = Math.random() * 0.02 + 0.01
                    const brightness = Math.random() * 0.6 + 0.4
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height * 0.4,
                        size: Math.random() * 4 + 2,
                        baseSize: Math.random() * 4 + 2,
                        color: `rgba(255, 255, 255, ${brightness})`,
                        type: 'star',
                        originalX: 0,
                        originalY: 0,
                        twinkleSpeed: twinkleSpeed,
                        twinklePhase: Math.random() * Math.PI * 2,
                        twinkleAmount: Math.random() * 0.5 + 0.3,
                        swayAmount: Math.random() * 0.5 + 0.2,
                        swaySpeed: Math.random() * 0.008 + 0.003,
                        swayPhase: Math.random() * Math.PI * 2,
                        windSensitivity: Math.random() * 0.1 + 0.05,
                        cursorSensitivity: 0.1 + Math.random() * 0.1,
                        cursorOffset: { x: 0, y: 0 }
                    }
                    
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }
            }
            
            createFloatingParticles(count) {
                for (let i = 0; i < count; i++) {
                    const particleType = Math.random()
                    let color, size
                    
                    if (particleType < 0.6) {
                        // Dust particles
                        const alpha = Math.random() * 0.3 + 0.1
                        color = `rgba(255, 255, 255, ${alpha})`
                        size = Math.random() * 3 + 1
                    } else {
                        // Sparkles
                        const alpha = Math.random() * 0.5 + 0.3
                        color = `rgba(255, 255, 200, ${alpha})`
                        size = Math.random() * 5 + 2
                    }
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        size: size,
                        baseSize: size,
                        color: color,
                        type: 'floating',
                        originalX: 0,
                        originalY: 0,
                        floatSpeed: Math.random() * 0.5 + 0.2,
                        swayAmount: Math.random() * 20 + 10,
                        swaySpeed: Math.random() * 0.02 + 0.01,
                        swayPhase: Math.random() * Math.PI * 2,
                        breatheSpeed: Math.random() * 0.025 + 0.015,
                        breathePhase: Math.random() * Math.PI * 2,
                        breatheAmount: 0.3 + Math.random() * 0.4,
                        windSensitivity: Math.random() * 0.6 + 0.4,
                        cursorSensitivity: 0.5 + Math.random() * 0.3,
                        cursorOffset: { x: 0, y: 0 }
                    }
                    
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }
            }

            animate() {
                this.animationId = requestAnimationFrame(() => this.animate())
                
                this.time += 0.016
                
                // Dynamic wind simulation
                this.windDirection = Math.sin(this.time * 0.01) * 0.5 + Math.sin(this.time * 0.003) * 0.3
                this.windStrength = (Math.sin(this.time * 0.008) + 1) * 0.5 + 0.3
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                
                this.drawRainbow()
                this.drawSun()
                this.animateParticles()
                this.animateBirds()
                this.drawParticles()
                this.drawBirds()
            }
            
            drawRainbow() {
                this.ctx.save()
                
                // Animate rainbow breathing
                this.rainbow.animPhase += this.rainbow.breatheSpeed
                const breathe = Math.sin(this.rainbow.animPhase) * 0.1 + 1
                const currentRadius = this.rainbow.radius * breathe
                const currentOpacity = this.rainbow.opacity * (0.8 + Math.sin(this.rainbow.animPhase * 0.5) * 0.2)
                
                // Draw rainbow arcs
                for (let i = 0; i < this.rainbow.colors.length; i++) {
                    const radius = currentRadius - (i * this.rainbow.width)
                    
                    this.ctx.globalAlpha = currentOpacity
                    this.ctx.strokeStyle = this.rainbow.colors[i]
                    this.ctx.lineWidth = this.rainbow.width
                    this.ctx.beginPath()
                    this.ctx.arc(this.rainbow.centerX, this.rainbow.centerY, radius, Math.PI, 0)
                    this.ctx.stroke()
                }
                
                this.ctx.restore()
            }
            
            drawSun() {
                this.ctx.save()
                
                // Animate sun pulsing
                this.sun.pulsePhase += this.sun.pulseSpeed
                this.sun.size = this.sun.baseSize * (1 + Math.sin(this.sun.pulsePhase) * 0.1)
                
                // Create intense glow effect
                const glowSize = this.sun.size * 5
                const gradient = this.ctx.createRadialGradient(
                    this.sun.x, this.sun.y, 0,
                    this.sun.x, this.sun.y, glowSize
                )
                gradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)')
                gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.7)')
                gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.3)')
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
                
                // Draw outer glow
                this.ctx.globalCompositeOperation = 'screen'
                this.ctx.fillStyle = gradient
                this.ctx.beginPath()
                this.ctx.arc(this.sun.x, this.sun.y, glowSize, 0, Math.PI * 2)
                this.ctx.fill()
                
                // Draw bright core
                this.ctx.globalCompositeOperation = 'source-over'
                this.ctx.globalAlpha = 1
                this.ctx.fillStyle = this.sun.color
                this.ctx.beginPath()
                this.ctx.arc(this.sun.x, this.sun.y, this.sun.size, 0, Math.PI * 2)
                this.ctx.fill()
                
                // Add bright white center
                this.ctx.fillStyle = '#FFFFFF'
                this.ctx.beginPath()
                this.ctx.arc(this.sun.x, this.sun.y, this.sun.size * 0.4, 0, Math.PI * 2)
                this.ctx.fill()
                
                this.ctx.restore()
            }
            
            animateParticles() {
                this.particles.forEach(particle => {
                    // Apply breathing/growing effect to all particles
                    const breathe = Math.sin(this.time * particle.breatheSpeed + particle.breathePhase) * particle.breatheAmount
                    particle.size = particle.baseSize * (1 + breathe)
                    
                    // Wind effect for all particles
                    const windEffect = this.windStrength * particle.windSensitivity
                    const windSway = Math.sin(this.time * 0.02 + particle.swayPhase) * windEffect
                    
                    // Smooth cursor interaction for all particles
                    const dx = this.mouse.x - particle.x
                    const dy = this.mouse.y - particle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const maxDistance = 150
                    
                    // Smooth cursor offset animation
                    if (distance < maxDistance) {
                        const force = (1 - distance / maxDistance) * particle.cursorSensitivity
                        const targetOffsetX = -dx / distance * force * 15
                        const targetOffsetY = -dy / distance * force * 15
                        
                        particle.cursorOffset.x += (targetOffsetX - particle.cursorOffset.x) * 0.1
                        particle.cursorOffset.y += (targetOffsetY - particle.cursorOffset.y) * 0.1
                    } else {
                        particle.cursorOffset.x *= 0.95
                        particle.cursorOffset.y *= 0.95
                    }
                    
                    switch (particle.type) {
                        case 'cloud':
                            const cloudDrift = this.time * particle.driftSpeed
                            const cloudSway = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount
                            
                            particle.x = particle.originalX + cloudDrift + (cloudSway + windSway * 2) * this.windDirection + particle.cursorOffset.x
                            particle.y = particle.originalY + Math.sin(this.time * 0.015 + particle.swayPhase) * windEffect * 2 + particle.cursorOffset.y
                            
                            // Wrap around screen
                            if (particle.x > this.canvas.width + 100) {
                                particle.x = -100
                                particle.originalX = -100 - cloudDrift
                            }
                            break
                            
                        case 'star':
                            const twinkle = Math.sin(this.time * particle.twinkleSpeed + particle.twinklePhase) * particle.twinkleAmount
                            particle.size = particle.baseSize * (1 + twinkle)
                            
                            const starSway = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount
                            particle.x = particle.originalX + (starSway + windSway * 0.3) * this.windDirection + particle.cursorOffset.x
                            particle.y = particle.originalY + Math.sin(this.time * 0.005 + particle.swayPhase) * windEffect * 0.2 + particle.cursorOffset.y
                            break
                            
                        case 'floating':
                            particle.y -= particle.floatSpeed
                            
                            const floatSway = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount
                            particle.x = particle.originalX + (floatSway + windSway * 2) * this.windDirection + particle.cursorOffset.x
                            
                            // Reset when particle goes off screen
                            if (particle.y < -50) {
                                particle.y = this.canvas.height + 50
                                particle.x = Math.random() * this.canvas.width
                                particle.originalX = particle.x
                            }
                            if (particle.x < -100) particle.x = this.canvas.width + 100
                            if (particle.x > this.canvas.width + 100) particle.x = -100
                            break
                    }
                })
            }
            
            animateBirds() {
                this.birds.forEach(bird => {
                    bird.breathePhase += 0.02
                    bird.flapPhase += bird.flapSpeed
                    
                    // Gliding behavior
                    bird.glideTimer += 0.016
                    if (bird.glideTimer > bird.glideDuration) {
                        bird.glideTimer = 0
                        bird.isFlapping = !bird.isFlapping
                        bird.glideDuration = bird.isFlapping ? 1 + Math.random() * 2 : 2 + Math.random() * 3
                    }
                    
                    // Flight physics
                    if (bird.isFlapping) {
                        const flapLift = Math.sin(bird.flapPhase) * 0.5
                        bird.vy += flapLift - 0.1 // Upward force when flapping
                    } else {
                        bird.vy += 0.05 // Gravity when gliding
                    }
                    
                    // Add some randomness to movement
                    bird.vx += (Math.random() - 0.5) * 0.1
                    bird.vy += (Math.random() - 0.5) * 0.05
                    
                    // Limit velocities
                    const maxSpeed = bird.type === 'canary' ? 3 : 2.5
                    bird.vx = Math.max(-maxSpeed, Math.min(maxSpeed, bird.vx))
                    bird.vy = Math.max(-2, Math.min(2, bird.vy))
                    
                    // Update position
                    bird.x += bird.vx
                    bird.y += bird.vy
                    
                    // Update direction based on movement
                    if (Math.abs(bird.vx) > 0.1) {
                        bird.direction = bird.vx > 0 ? -1 : 1
                    }
                    
                    // Screen wrapping
                    if (bird.x < -100) bird.x = this.canvas.width + 100
                    if (bird.x > this.canvas.width + 100) bird.x = -100
                    if (bird.y < -50) bird.y = this.canvas.height + 50
                    if (bird.y > this.canvas.height + 50) bird.y = -50
                    
                    // Animate bird parts
                    bird.parts.forEach(part => {
                        part.animPhase += part.animSpeed
                        
                        const breathe = Math.sin(bird.breathePhase + part.animPhase) * part.breatheAmount
                        part.size = part.baseSize * (1 + breathe)
                        
                        // Wing flapping animation
                        if (part.type === 'wing' && bird.isFlapping) {
                            const flapAmount = Math.sin(bird.flapPhase * 2) * 8
                            part.y = part.originalY + flapAmount
                        } else if (part.type === 'wing') {
                            part.y += (part.originalY - part.y) * 0.1
                        }
                        
                        // Tail movement
                        if (part.type === 'tail') {
                            const tailSway = Math.sin(bird.flapPhase * 0.5) * 3 * bird.direction
                            part.x = part.originalX + tailSway
                        }
                    })
                })
            }
            
            drawParticles() {
                this.particles.forEach(particle => {
                    this.ctx.save()
                    
                    if (particle.type === 'star') {
                        this.ctx.globalAlpha = 0.8
                    } else if (particle.type === 'cloud') {
                        this.ctx.globalAlpha = 1
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
            
            drawBirds() {
                this.birds.forEach(bird => {
                    this.ctx.save()
                    this.ctx.translate(bird.x, bird.y)
                    this.ctx.scale(bird.direction * bird.size, bird.size)
                    
                    bird.parts.forEach(part => {
                        this.ctx.save()
                        this.ctx.globalAlpha = 0.9
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
                
                // Update sun and rainbow positions
                if (this.sun) {
                    this.sun.x = this.canvas.width * 0.85
                    this.sun.y = this.canvas.height * 0.15
                }
                
                if (this.rainbow) {
                    this.rainbow.centerX = this.canvas.width * 0.5
                    this.rainbow.radius = this.canvas.width * 0.8
                }
            }
        }

        skyInstanceRef.current = new Dense2DParticleSky(canvasRef.current)

        return () => {
            if (skyInstanceRef.current && skyInstanceRef.current.animationId) {
                cancelAnimationFrame(skyInstanceRef.current.animationId)
            }
            window.removeEventListener('resize', skyInstanceRef.current?.onWindowResize)
        }
    }, [])

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {/* Background gradient */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, #1e3c72 0%, #2a5298 20%, #87CEEB 50%, #b8d4f2 100%)',
                    zIndex: -1
                }}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto'
                }}
            />
        </div>
    )
}

export default SkyBiome