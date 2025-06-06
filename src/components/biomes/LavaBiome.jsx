import { useEffect, useRef, useState } from 'react'

const LavaBiome = () => {
    const canvasRef = useRef(null)
    const animationRef = useRef()
    const lavaInstanceRef = useRef()
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (!canvasRef.current) return

        class Dense2DParticleLavaBiome {
            constructor(canvas) {
                this.canvas = canvas
                this.ctx = this.canvas.getContext('2d')
                this.particles = []
                this.animals = []
                this.volcanoParticles = []
                this.skySmoke = []
                this.time = 0
                this.mouse = { x: 0, y: 0 }
                this.heatWaves = 1
                this.volcanoActivity = 0
                
                this.init()
                this.createLavaBiome()
                this.createAnimals()
                this.createVolcanoParticles()
                this.createSkySmoke()
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
            
            createSkySmoke() {
                for (let i = 0; i < 30; i++) {
                    const smoke = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height * 0.4,
                        size: Math.random() * 40 + 30,
                        baseSize: Math.random() * 40 + 30,
                        color: `hsla(0, 0%, ${30 + Math.random() * 30}%, ${0.2 + Math.random() * 0.3})`,
                        vx: (Math.random() - 0.5) * 0.8,
                        vy: -Math.random() * 0.3 - 0.1,
                        rotationSpeed: (Math.random() - 0.5) * 0.02,
                        rotation: Math.random() * Math.PI * 2,
                        expandRate: Math.random() * 0.01 + 0.005,
                        life: Math.random() * 300 + 200
                    }
                    this.skySmoke.push(smoke)
                }
            }
            
            createVolcanoParticles() {
                const volcanoX = this.canvas.width * 0.5
                const volcanoBase = this.canvas.height // Ground level
                const volcanoTop = this.canvas.height * 0.15
                const volcanoHeight = volcanoBase - volcanoTop
                
                // Create volcano slope/skirt particles - narrower and denser
                for (let layer = 0; layer < 25; layer++) {
                    const layerProgress = layer / 24
                    const layerY = volcanoBase - (layerProgress * volcanoHeight * 1.2)
                    const layerWidth = 200 + (1 - layerProgress) * 300 // Much narrower base
                    
                    const particlesInLayer = Math.floor(45 - layer * 1.5) // More particles per layer
                    
                    for (let i = 0; i < particlesInLayer; i++) {
                        const angle = (Math.PI * 2 * i) / particlesInLayer
                        const radiusVariation = 0.9 + Math.random() * 0.2 // Less variation
                        const radius = (layerWidth * 0.5) * radiusVariation
                        
                        const x = volcanoX + Math.cos(angle) * radius
                        const y = layerY + (Math.random() - 0.5) * 15 // Less vertical spread
                        
                        // Skip if too close to center at top layers
                        if (layerProgress > 0.8 && Math.abs(x - volcanoX) < 40) continue
                        
                        let color, size
                        const rockType = Math.random()
                        
                        if (layerProgress < 0.3) { // Lower layers - darker, bigger
                            color = `hsl(${15 + Math.random() * 10}, ${30 + Math.random() * 20}%, ${5 + Math.random() * 12}%)`
                            size = Math.random() * 30 + 25 // Bigger particles
                        } else if (layerProgress < 0.7) { // Middle layers
                            color = `hsl(${10 + Math.random() * 15}, ${25 + Math.random() * 25}%, ${8 + Math.random() * 15}%)`
                            size = Math.random() * 25 + 20 // Bigger particles
                        } else { // Upper layers - more volcanic
                            color = `hsl(${5 + Math.random() * 20}, ${40 + Math.random() * 30}%, ${15 + Math.random() * 20}%)`
                            size = Math.random() * 22 + 18 // Bigger particles
                        }
                        
                        this.volcanoParticles.push({
                            x: x,
                            y: y,
                            size: size,
                            baseSize: size,
                            color: color,
                            type: 'volcano_slope',
                            layer: layer,
                            heatPulse: Math.random() * Math.PI * 2,
                            heatIntensity: Math.random() * 0.15 + 0.05,
                            originalRadius: radius,
                            angle: angle
                        })
                    }
                }
                                // Create main volcano body with triangular shape - denser
                for (let i = 0; i < 300; i++) { // More particles
                    const progress = Math.random()
                    const height = volcanoTop + progress * volcanoHeight * 0.85
                    
                    // Triangular width calculation - narrower
                    const heightFromTop = height - volcanoTop
                    const maxHeightFromTop = volcanoHeight * 0.85
                    const widthProgress = heightFromTop / maxHeightFromTop
                    const width = 40 + widthProgress * 160 // Narrower width
                    
                    const x = volcanoX + (Math.random() - 0.5) * width
                    const y = height
                    
                    const rockType = Math.random()
                    let color, size
                    
                    if (rockType < 0.6) {
                        color = `hsl(${15 + Math.random() * 10}, ${20 + Math.random() * 30}%, ${8 + Math.random() * 15}%)`
                        size = Math.random() * 25 + 18 // Bigger particles
                    } else {
                        color = `hsl(${0 + Math.random() * 15}, ${40 + Math.random() * 30}%, ${20 + Math.random() * 15}%)`
                        size = Math.random() * 20 + 15 // Bigger particles
                    }
                    
                    this.volcanoParticles.push({
                        x: x,
                        y: y,
                        size: size,
                        baseSize: size,
                        color: color,
                        type: 'volcano_body',
                        heatPulse: Math.random() * Math.PI * 2,
                        heatIntensity: Math.random() * 0.2 + 0.1
                    })
                }
                
                // Create crater particles
                const craterRadius = 35 // Smaller crater
                for (let i = 0; i < 50; i++) { // More crater particles
                    const angle = (Math.PI * 2 * i) / 50
                    const radius = craterRadius + (Math.random() - 0.5) * 10
                    const x = volcanoX + Math.cos(angle) * radius
                    const y = volcanoTop + Math.sin(angle) * radius * 0.3
                    
                    const lavaType = Math.random()
                    let color, size
                    
                    if (lavaType < 0.4) {
                        color = `hsl(${0 + Math.random() * 20}, ${80 + Math.random() * 15}%, ${60 + Math.random() * 25}%)`
                        size = Math.random() * 18 + 15
                    } else if (lavaType < 0.7) {
                        color = `hsl(${25 + Math.random() * 25}, ${70 + Math.random() * 20}%, ${70 + Math.random() * 20}%)`
                        size = Math.random() * 15 + 12
                    } else {
                        color = `hsl(${40 + Math.random() * 20}, ${90 + Math.random() * 10}%, ${80 + Math.random() * 15}%)`
                        size = Math.random() * 12 + 10
                    }
                    
                    this.volcanoParticles.push({
                        x: x,
                        y: y,
                        size: size,
                        baseSize: size,
                        color: color,
                        type: 'crater_lava',
                        bubblePhase: Math.random() * Math.PI * 2,
                        bubbleSpeed: Math.random() * 0.05 + 0.03,
                        glowIntensity: Math.random() * 0.8 + 0.5
                    })
                }
                
                // Create inner crater molten core
                for (let i = 0; i < 20; i++) { // More core particles
                    const angle = Math.random() * Math.PI * 2
                    const radius = Math.random() * 20 // Smaller radius
                    const x = volcanoX + Math.cos(angle) * radius
                    const y = volcanoTop + Math.sin(angle) * radius * 0.2
                    
                    this.volcanoParticles.push({
                        x: x,
                        y: y,
                        size: Math.random() * 15 + 18,
                        baseSize: Math.random() * 15 + 18,
                        color: `hsl(${Math.random() * 40}, 100%, ${80 + Math.random() * 20}%)`,
                        type: 'molten_core',
                        pulsePhase: Math.random() * Math.PI * 2,
                        pulseSpeed: Math.random() * 0.08 + 0.05,
                        glowIntensity: 1.2 + Math.random() * 0.5
                    })
                }
                
                // Create lava flows down the slopes - narrower
                for (let i = 0; i < 100; i++) { // More lava flows
                    const side = Math.random() > 0.5 ? 1 : -1
                    const flowProgress = Math.random()
                    const flowY = volcanoTop + flowProgress * volcanoHeight * 0.7
                    
                    // Calculate width at this height for triangular shape - narrower
                    const heightFromTop = flowY - volcanoTop
                    const maxHeightFromTop = volcanoHeight * 0.7
                    const widthAtHeight = 40 + (heightFromTop / maxHeightFromTop) * 120 // Narrower flows
                    
                    const flowX = volcanoX + side * (widthAtHeight * 0.3 + Math.random() * widthAtHeight * 0.3)
                    
                    this.volcanoParticles.push({
                        x: flowX,
                        y: flowY,
                        size: Math.random() * 20 + 12,
                        baseSize: Math.random() * 20 + 12,
                        color: `hsl(${Math.random() * 30}, ${70 + Math.random() * 25}%, ${50 + Math.random() * 30}%)`,
                        type: 'lava_flow',
                        flowSpeed: Math.random() * 0.3 + 0.1,
                        bubblePhase: Math.random() * Math.PI * 2,
                        bubbleSpeed: Math.random() * 0.04 + 0.02,
                        glowIntensity: Math.random() * 0.8 + 0.6
                    })
                }
            }
            
            createLavaBiome() {
                console.log('Creating molten lava biome...')
                
                this.createVolcanicRocks(300)
                this.createGroundRocks(400)
                this.createLavaFlows(300)
                this.createFallingLava(150)
                this.createAshClouds(80) // More ash clouds but smaller
                this.createEmbers(400)
                
                console.log('Total particles:', this.particles.length)
            }
            
            createGroundRocks(count) {
                const groundLevel = this.canvas.height - 120
                
                for (let i = 0; i < count; i++) {
                    const rockType = Math.random()
                    let color, size
                    
                    if (rockType < 0.5) {
                        color = `hsl(${15 + Math.random() * 10}, ${20 + Math.random() * 30}%, ${10 + Math.random() * 20}%)`
                        size = Math.random() * 8 + 6
                    } else if (rockType < 0.8) {
                        color = `hsl(${0 + Math.random() * 20}, ${30 + Math.random() * 40}%, ${15 + Math.random() * 25}%)`
                        size = Math.random() * 16 + 10
                    } else {
                        color = `hsl(${10 + Math.random() * 15}, ${25 + Math.random() * 35}%, ${8 + Math.random() * 18}%)`
                        size = Math.random() * 25 + 15
                    }
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: groundLevel + Math.random() * 100,
                        size: size,
                        baseSize: size,
                        color: color,
                        type: 'ground_rock',
                        originalX: 0,
                        originalY: 0,
                        heatPulse: Math.random() * Math.PI * 2,
                        heatIntensity: Math.random() * 0.15 + 0.05,
                        settled: Math.random() > 0.1
                    }
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }
            }
                        createAnimals() {
                console.log('Creating reptilian creatures...')
                
                for (let i = 0; i < 6; i++) {
                    this.createLizard()
                }
                
                for (let i = 0; i < 4; i++) {
                    this.createSalamander()
                }
                
                this.createDragon()
                
                console.log('Total animals:', this.animals.length)
            }
            
            createLizard() {
                const lizard = {
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height - 60 - Math.random() * 20,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'lizard',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    wanderTimer: 0,
                    wanderTarget: { x: 0, y: 0 },
                    size: 0.8 + Math.random() * 0.4,
                    idleTimer: 0,
                    idleDuration: 3 + Math.random() * 4,
                    isWalking: false,
                    breathePhase: Math.random() * Math.PI * 2,
                    heatGlow: Math.random() * 0.5 + 0.5
                }
                
                const lizardColors = ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E']
                const mainColor = lizardColors[Math.floor(Math.random() * lizardColors.length)]
                const spotColor = Math.random() > 0.5 ? '#8B0000' : '#FF4500'
                
                const bodyParts = [
                    { x: 0, y: 0, size: 28, color: mainColor, type: 'body' },
                    { x: -8, y: -3, size: 25, color: mainColor, type: 'body' },
                    { x: 8, y: -3, size: 25, color: mainColor, type: 'body' },
                    { x: 0, y: -8, size: 22, color: mainColor, type: 'body' },
                    { x: 0, y: 8, size: 22, color: mainColor, type: 'body' },
                    { x: -12, y: -8, size: 8, color: spotColor, type: 'spot' },
                    { x: 15, y: -5, size: 6, color: spotColor, type: 'spot' },
                    { x: -5, y: 12, size: 7, color: spotColor, type: 'spot' },
                    { x: -25, y: -5, size: 15, color: mainColor, type: 'head' },
                    { x: -35, y: -3, size: 12, color: mainColor, type: 'head' },
                    { x: -32, y: -8, size: 3, color: '#FF0000', type: 'eye' },
                    { x: -28, y: -8, size: 3, color: '#FF0000', type: 'eye' },
                    { x: -10, y: 25, size: 6, color: mainColor, type: 'leg' },
                    { x: -3, y: 25, size: 6, color: mainColor, type: 'leg' },
                    { x: 3, y: 25, size: 6, color: mainColor, type: 'leg' },
                    { x: 10, y: 25, size: 6, color: mainColor, type: 'leg' },
                    { x: 20, y: 2, size: 8, color: mainColor, type: 'tail' },
                    { x: 28, y: 4, size: 7, color: mainColor, type: 'tail' },
                    { x: 35, y: 6, size: 6, color: mainColor, type: 'tail' },
                    { x: 40, y: 8, size: 5, color: mainColor, type: 'tail' }
                ]
                
                lizard.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.02 + 0.01,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.015 + 0.008,
                    breatheAmount: part.type === 'body' ? 0.12 : 0.06
                }))
                
                this.animals.push(lizard)
            }
            
            createSalamander() {
                const salamander = {
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height - 50 - Math.random() * 15,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'salamander',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    wanderTimer: 0,
                    wanderTarget: { x: 0, y: 0 },
                    size: 0.7 + Math.random() * 0.3,
                    idleTimer: 0,
                    idleDuration: 2 + Math.random() * 3,
                    isWalking: false,
                    breathePhase: Math.random() * Math.PI * 2,
                    heatGlow: Math.random() * 0.8 + 0.7
                }
                
                const salamanderColors = ['#FF4500', '#FF6347', '#DC143C', '#B22222', '#8B0000']
                const mainColor = salamanderColors[Math.floor(Math.random() * salamanderColors.length)]
                
                const bodyParts = [
                    { x: 0, y: 0, size: 25, color: mainColor, type: 'body' },
                    { x: -6, y: -2, size: 22, color: mainColor, type: 'body' },
                    { x: 6, y: -2, size: 22, color: mainColor, type: 'body' },
                    { x: 0, y: -6, size: 20, color: mainColor, type: 'body' },
                    { x: 0, y: 6, size: 20, color: mainColor, type: 'body' },
                    { x: -8, y: -6, size: 6, color: '#FFD700', type: 'glow' },
                    { x: 10, y: -4, size: 5, color: '#FFD700', type: 'glow' },
                    { x: -3, y: 8, size: 5, color: '#FFD700', type: 'glow' },
                    { x: -20, y: -3, size: 12, color: mainColor, type: 'head' },
                    { x: -28, y: -2, size: 10, color: mainColor, type: 'head' },
                    { x: -26, y: -6, size: 2.5, color: '#FFFF00', type: 'eye' },
                    { x: -22, y: -6, size: 2.5, color: '#FFFF00', type: 'eye' },
                    { x: -8, y: 22, size: 5, color: mainColor, type: 'leg' },
                    { x: -2, y: 22, size: 5, color: mainColor, type: 'leg' },
                    { x: 2, y: 22, size: 5, color: mainColor, type: 'leg' },
                    { x: 8, y: 22, size: 5, color: mainColor, type: 'leg' },
                    { x: 18, y: 1, size: 7, color: mainColor, type: 'tail' },
                    { x: 24, y: 3, size: 6, color: mainColor, type: 'tail' },
                    { x: 30, y: 5, size: 5, color: mainColor, type: 'tail' }
                ]
                
                salamander.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.025 + 0.015,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.02 + 0.01,
                    breatheAmount: part.type === 'body' ? 0.15 : 0.08
                }))
                
                this.animals.push(salamander)
            }
                        createDragon() {
                const dragon = {
                    x: this.canvas.width * 0.7,
                    y: this.canvas.height - 100,
                    vx: 0,
                    vy: 0,
                    direction: -1,
                    type: 'dragon',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    wanderTimer: 0,
                    wanderTarget: { x: 0, y: 0 },
                    size: 1.5,
                    idleTimer: 0,
                    idleDuration: 4 + Math.random() * 6,
                    isWalking: false,
                    breathePhase: Math.random() * Math.PI * 2,
                    heatGlow: 1.5,
                    fireBreath: {
                        active: false,
                        timer: 0,
                        duration: 0
                    }
                }
                
                const dragonColors = ['#8B0000', '#DC143C', '#B22222']
                const mainColor = dragonColors[Math.floor(Math.random() * dragonColors.length)]
                
                const bodyParts = [
                    { x: 0, y: 0, size: 45, color: mainColor, type: 'body' },
                    { x: -15, y: -5, size: 42, color: mainColor, type: 'body' },
                    { x: 15, y: -5, size: 42, color: mainColor, type: 'body' },
                    { x: 0, y: -12, size: 38, color: mainColor, type: 'body' },
                    { x: 0, y: 12, size: 38, color: mainColor, type: 'body' },
                    { x: -20, y: 8, size: 35, color: mainColor, type: 'body' },
                    { x: 20, y: 8, size: 35, color: mainColor, type: 'body' },
                    { x: 0, y: 8, size: 25, color: '#FF4500', type: 'belly' },
                    { x: -8, y: 12, size: 20, color: '#FF6347', type: 'belly' },
                    { x: 8, y: 12, size: 20, color: '#FF6347', type: 'belly' },
                    { x: -35, y: -8, size: 25, color: mainColor, type: 'head' },
                    { x: -48, y: -5, size: 22, color: mainColor, type: 'head' },
                    { x: -58, y: -2, size: 18, color: mainColor, type: 'snout' },
                    { x: -42, y: -20, size: 8, color: '#8B4513', type: 'horn' },
                    { x: -38, y: -22, size: 7, color: '#8B4513', type: 'horn' },
                    { x: -46, y: -18, size: 6, color: '#8B4513', type: 'horn' },
                    { x: -52, y: -12, size: 4, color: '#FFFF00', type: 'eye' },
                    { x: -45, y: -12, size: 4, color: '#FFFF00', type: 'eye' },
                    { x: -10, y: -25, size: 20, color: '#8B0000', type: 'wing' },
                    { x: -5, y: -35, size: 18, color: '#8B0000', type: 'wing' },
                    { x: 5, y: -35, size: 18, color: '#8B0000', type: 'wing' },
                    { x: 10, y: -25, size: 20, color: '#8B0000', type: 'wing' },
                    { x: -15, y: 40, size: 12, color: mainColor, type: 'leg' },
                    { x: -5, y: 40, size: 12, color: mainColor, type: 'leg' },
                    { x: 5, y: 40, size: 12, color: mainColor, type: 'leg' },
                    { x: 15, y: 40, size: 12, color: mainColor, type: 'leg' },
                    { x: -15, y: 48, size: 8, color: '#000000', type: 'claw' },
                    { x: -5, y: 48, size: 8, color: '#000000', type: 'claw' },
                    { x: 5, y: 48, size: 8, color: '#000000', type: 'claw' },
                    { x: 15, y: 48, size: 8, color: '#000000', type: 'claw' },
                    { x: 35, y: 5, size: 15, color: mainColor, type: 'tail' },
                    { x: 48, y: 8, size: 13, color: mainColor, type: 'tail' },
                    { x: 58, y: 12, size: 11, color: mainColor, type: 'tail' },
                    { x: 66, y: 15, size: 9, color: mainColor, type: 'tail' },
                    { x: 72, y: 18, size: 7, color: mainColor, type: 'tail' }
                ]
                
                dragon.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.015 + 0.008,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.012 + 0.006,
                    breatheAmount: part.type === 'body' ? 0.1 : part.type === 'belly' ? 0.2 : 0.05
                }))
                
                this.animals.push(dragon)
            }
            
            createVolcanicRocks(count) {
                for (let i = 0; i < count; i++) {
                    const rockType = Math.random()
                    let color, size
                    
                    if (rockType < 0.4) {
                        color = `hsl(${15 + Math.random() * 10}, ${20 + Math.random() * 30}%, ${8 + Math.random() * 15}%)`
                        size = Math.random() * 25 + 20
                    } else if (rockType < 0.7) {
                        color = `hsl(${0 + Math.random() * 15}, ${60 + Math.random() * 30}%, ${25 + Math.random() * 20}%)`
                        size = Math.random() * 20 + 15
                    } else {
                        color = `hsl(${20 + Math.random() * 25}, ${70 + Math.random() * 20}%, ${40 + Math.random() * 20}%)`
                        size = Math.random() * 15 + 12
                    }
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: this.canvas.height - Math.random() * 100,
                        size: size,
                        baseSize: size,
                        color: color,
                        type: 'rock',
                        originalX: 0,
                        originalY: 0,
                        heatPulse: Math.random() * Math.PI * 2,
                        heatIntensity: Math.random() * 0.3 + 0.2,
                        glowPhase: Math.random() * Math.PI * 2
                    }
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }
            }
            
            createLavaFlows(count) {
                for (let i = 0; i < count; i++) {
                    const lavaType = Math.random()
                    let color, size
                    
                    if (lavaType < 0.5) {
                        color = `hsl(${0 + Math.random() * 20}, ${80 + Math.random() * 15}%, ${45 + Math.random() * 25}%)`
                        size = Math.random() * 20 + 15
                    } else {
                        color = `hsl(${25 + Math.random() * 25}, ${70 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`
                        size = Math.random() * 16 + 12
                    }
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: this.canvas.height - Math.random() * 80,
                        size: size,
                        baseSize: size,
                        color: color,
                        type: 'lava',
                        originalX: 0,
                        originalY: 0,
                        flowSpeed: Math.random() * 0.5 + 0.2,
                        bubblePhase: Math.random() * Math.PI * 2,
                        bubbleSpeed: Math.random() * 0.03 + 0.02,
                        heatGlow: Math.random() * 0.5 + 0.8
                    }
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }
            }
            
            createFallingLava(count) {
                for (let i = 0; i < count; i++) {
                    const color = `hsl(${Math.random() * 30}, ${70 + Math.random() * 25}%, ${50 + Math.random() * 30}%)`
                    const size = Math.random() * 8 + 4
                    
                    const particle = {
                        x: this.canvas.width * 0.4 + Math.random() * this.canvas.width * 0.2,
                        y: Math.random() * this.canvas.height * 0.5,
                        size: size,
                        baseSize: size,
                        color: color,
                        type: 'falling_lava',
                        vx: (Math.random() - 0.5) * 4,
                        vy: Math.random() * 2 + 1,
                        gravity: 0.1,
                        life: 1,
                        maxLife: Math.random() * 3 + 2,
                        trail: []
                    }
                    this.particles.push(particle)
                }
            }
            
            createAshClouds(count) {
                for (let i = 0; i < count; i++) {
                    const ashColor = `hsla(0, 0%, ${20 + Math.random() * 40}%, ${0.3 + Math.random() * 0.4})`
                    const size = Math.random() * 12 + 8 // Much smaller ash particles
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height * 0.6,
                        size: size,
                        baseSize: size,
                        color: ashColor,
                        type: 'ash',
                        originalX: 0,
                        originalY: 0,
                        driftSpeed: Math.random() * 0.8 + 0.3,
                        driftDirection: Math.random() * Math.PI * 2,
                        expandRate: Math.random() * 0.01 + 0.005
                    }
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }
            }
            
            createEmbers(count) {
                for (let i = 0; i < count; i++) {
                    const emberColor = `hsl(${20 + Math.random() * 20}, ${80 + Math.random() * 15}%, ${60 + Math.random() * 20}%)`
                    const size = Math.random() * 4 + 2
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        size: size,
                        baseSize: size,
                        color: emberColor,
                        type: 'ember',
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 1.5 - 0.5,
                        twinkle: Math.random() * Math.PI * 2,
                        twinkleSpeed: Math.random() * 0.1 + 0.05,
                        life: Math.random() * 200 + 100
                    }
                    this.particles.push(particle)
                }
            }
                        animate() {
                this.time += 0.016
                
                this.heatWaves = (Math.sin(this.time * 0.01) + 1) * 0.5 + 0.5
                this.volcanoActivity = Math.sin(this.time * 0.005) * 0.5 + 0.5
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                
                this.animateSkySmoke()
                this.animateVolcanoParticles()
                this.animateParticles()
                this.animateAnimals()
                this.drawSkySmoke()
                this.drawVolcanoParticles()
                this.drawParticles()
                this.drawAnimals()
                
                animationRef.current = requestAnimationFrame(() => this.animate())
            }
            
            animateSkySmoke() {
                this.skySmoke.forEach((smoke, index) => {
                    smoke.x += smoke.vx
                    smoke.y += smoke.vy
                    smoke.rotation += smoke.rotationSpeed
                    smoke.size += smoke.expandRate
                    smoke.life--
                    
                    // Wrap around screen edges
                    if (smoke.x < -100) smoke.x = this.canvas.width + 100
                    if (smoke.x > this.canvas.width + 100) smoke.x = -100
                    if (smoke.y < -100) smoke.y = this.canvas.height * 0.4
                    
                    // Reset when life expires
                    if (smoke.life <= 0) {
                        smoke.x = Math.random() * this.canvas.width
                        smoke.y = this.canvas.height * 0.4 + Math.random() * 50
                        smoke.size = smoke.baseSize
                        smoke.life = Math.random() * 300 + 200
                    }
                })
            }
            
            animateVolcanoParticles() {
                this.volcanoParticles.forEach(particle => {
                    switch (particle.type) {
                        case 'volcano_slope':
                        case 'volcano_body':
                            particle.heatPulse += 0.015
                            const heatGlow = Math.sin(particle.heatPulse) * particle.heatIntensity
                            particle.size = particle.baseSize * (1 + heatGlow)
                            break
                            
                        case 'crater_lava':
                            particle.bubblePhase += particle.bubbleSpeed
                            const bubble = Math.sin(particle.bubblePhase) * 0.4
                            particle.size = particle.baseSize * (1 + bubble)
                            break
                            
                        case 'molten_core':
                            particle.pulsePhase += particle.pulseSpeed
                            const pulse = Math.sin(particle.pulsePhase) * 0.6
                            particle.size = particle.baseSize * (1 + pulse)
                            break
                            
                        case 'lava_flow':
                            particle.bubblePhase += particle.bubbleSpeed
                            const flowBubble = Math.sin(particle.bubblePhase) * 0.3
                            particle.size = particle.baseSize * (1 + flowBubble)
                            particle.y += particle.flowSpeed
                            if (particle.y > this.canvas.height) {
                                particle.y = this.canvas.height * 0.2
                            }
                            break
                    }
                })
            }
            
            animateParticles() {
                this.particles.forEach((particle, index) => {
                    switch (particle.type) {
                        case 'rock':
                        case 'ground_rock':
                            particle.heatPulse += 0.02
                            const heatGlow = Math.sin(particle.heatPulse) * particle.heatIntensity
                            particle.size = particle.baseSize * (1 + heatGlow)
                            
                            if (particle.type === 'ground_rock' && !particle.settled) {
                                particle.y += 0.1
                                if (Math.random() < 0.01) particle.settled = true
                            }
                            break
                            
                        case 'lava':
                            particle.bubblePhase += particle.bubbleSpeed
                            const bubble = Math.sin(particle.bubblePhase) * 0.3
                            particle.size = particle.baseSize * (1 + bubble)
                            particle.y += Math.sin(this.time * 0.01 + particle.x * 0.01) * 0.2
                            break
                            
                        case 'falling_lava':
                            particle.vy += particle.gravity
                            particle.x += particle.vx
                            particle.y += particle.vy
                            particle.life += 0.016
                            
                            if (particle.y > this.canvas.height || particle.life > particle.maxLife) {
                                particle.x = this.canvas.width * 0.5 + (Math.random() - 0.5) * 60
                                particle.y = this.canvas.height * 0.15
                                particle.vx = (Math.random() - 0.5) * 6
                                particle.vy = -Math.random() * 8 - 3
                                particle.life = 0
                            }
                            break
                            
                        case 'ash':
                            particle.x += Math.cos(particle.driftDirection) * particle.driftSpeed
                            particle.y += Math.sin(particle.driftDirection) * particle.driftSpeed * 0.3
                            particle.size += particle.expandRate
                            
                            if (particle.x < -50 || particle.x > this.canvas.width + 50 || 
                                particle.y < -50 || particle.y > this.canvas.height + 50) {
                                particle.x = Math.random() * this.canvas.width
                                particle.y = this.canvas.height + 50
                                particle.size = particle.baseSize
                            }
                            break
                            
                        case 'ember':
                            particle.x += particle.vx
                            particle.y += particle.vy
                            particle.twinkle += particle.twinkleSpeed
                            particle.life--
                            
                            const twinkleEffect = Math.sin(particle.twinkle) * 0.5 + 0.5
                            particle.size = particle.baseSize * twinkleEffect
                            
                            if (particle.life <= 0) {
                                particle.x = Math.random() * this.canvas.width
                                particle.y = this.canvas.height + 10
                                particle.vx = (Math.random() - 0.5) * 2
                                particle.vy = -Math.random() * 1.5 - 0.5
                                particle.life = Math.random() * 200 + 100
                            }
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
                        animal.idleDuration = animal.isWalking ? 3 + Math.random() * 4 : 2 + Math.random() * 3
                        
                        if (animal.isWalking) {
                            animal.wanderTarget.x = Math.random() * this.canvas.width
                            animal.wanderTarget.y = animal.y + (Math.random() - 0.5) * 30
                            if (animal.type === 'dragon') {
                                animal.wanderTarget.y = Math.max(this.canvas.height - 150, Math.min(this.canvas.height - 80, animal.wanderTarget.y))
                            } else {
                                animal.wanderTarget.y = Math.max(this.canvas.height - 90, Math.min(this.canvas.height - 40, animal.wanderTarget.y))
                            }
                        }
                    }
                    
                    if (animal.isWalking) {
                        const dx = animal.wanderTarget.x - animal.x
                        const dy = animal.wanderTarget.y - animal.y
                        const distance = Math.sqrt(dx * dx + dy * dy)
                        
                        if (distance > 15) {
                            const speed = animal.type === 'dragon' ? 0.4 : animal.type === 'salamander' ? 0.25 : 0.2
                            animal.vx = (dx / distance) * speed
                            animal.vy = (dy / distance) * speed * 0.1
                            animal.direction = animal.vx > 0 ? -1 : 1
                        } else {
                            animal.vx *= 0.9
                            animal.vy *= 0.9
                        }
                        
                        animal.x += animal.vx
                        animal.y += animal.vy
                        animal.animPhase += 0.04
                    } else {
                        animal.vx *= 0.8
                        animal.vy *= 0.8
                    }
                    
                    animal.x = Math.max(60, Math.min(this.canvas.width - 60, animal.x))
                    if (animal.type === 'dragon') {
                        animal.y = Math.max(this.canvas.height - 150, Math.min(this.canvas.height - 80, animal.y))
                    } else {
                        animal.y = Math.max(this.canvas.height - 90, Math.min(this.canvas.height - 40, animal.y))
                    }
                    
                    if (animal.type === 'dragon') {
                        animal.fireBreath.timer += 0.016
                        if (animal.fireBreath.timer > 5 && !animal.fireBreath.active) {
                            animal.fireBreath.active = true
                            animal.fireBreath.duration = 1 + Math.random() * 2
                            animal.fireBreath.timer = 0
                        }
                        if (animal.fireBreath.active && animal.fireBreath.timer > animal.fireBreath.duration) {
                            animal.fireBreath.active = false
                            animal.fireBreath.timer = 0
                        }
                    }
                    
                    animal.parts.forEach(part => {
                        part.animPhase += part.animSpeed
                        
                        const breathe = Math.sin(animal.breathePhase + part.animPhase) * part.breatheAmount
                        part.size = part.baseSize * (1 + breathe)
                        
                        if ((part.type === 'leg' || part.type === 'claw') && animal.isWalking) {
                            const walkBob = Math.sin(animal.animPhase * 2 + part.animPhase) * Math.abs(animal.vx) * 8
                            part.y = part.originalY + walkBob
                        } else if (part.type === 'leg' || part.type === 'claw') {
                            part.y += (part.originalY - part.y) * 0.1
                        }
                        
                        if (part.type === 'tail') {
                            const tailSway = Math.sin(animal.animPhase * 1.5 + part.animPhase) * (animal.isWalking ? 4 : 2)
                            part.x = part.originalX + tailSway * animal.direction
                        }
                        
                        if (part.type === 'wing' && animal.type === 'dragon') {
                            const wingFlap = Math.sin(animal.animPhase * 3) * 5
                            part.y = part.originalY + wingFlap
                        }
                    })
                })
            }
                        drawSkySmoke() {
                this.skySmoke.forEach(smoke => {
                    this.ctx.save()
                    this.ctx.translate(smoke.x, smoke.y)
                    this.ctx.rotate(smoke.rotation)
                    this.ctx.globalAlpha = 0.4
                    this.ctx.fillStyle = smoke.color
                    this.ctx.beginPath()
                    this.ctx.arc(0, 0, smoke.size, 0, Math.PI * 2)
                    this.ctx.fill()
                    this.ctx.restore()
                })
            }
            
            drawVolcanoParticles() {
                this.volcanoParticles.forEach(particle => {
                    this.ctx.save()
                    
                    if (particle.type === 'crater_lava' || particle.type === 'molten_core' || particle.type === 'lava_flow') {
                        this.ctx.shadowColor = particle.color
                        this.ctx.shadowBlur = particle.glowIntensity * 20
                    }
                    
                    this.ctx.globalAlpha = 0.9
                    this.ctx.fillStyle = particle.color
                    this.ctx.beginPath()
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                    this.ctx.fill()
                    
                    this.ctx.restore()
                })
            }
            
            drawParticles() {
                this.particles.forEach(particle => {
                    this.ctx.save()
                    
                    if (particle.type === 'lava' || particle.type === 'falling_lava') {
                        this.ctx.shadowColor = particle.color
                        this.ctx.shadowBlur = 15
                    } else if (particle.type === 'ember') {
                        this.ctx.shadowColor = '#FFD700'
                        this.ctx.shadowBlur = 10
                    }
                    
                    this.ctx.globalAlpha = particle.type === 'ash' ? 0.6 : 0.8
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
                    
                    if (animal.type === 'dragon' && animal.fireBreath.active) {
                        this.ctx.save()
                        this.ctx.globalAlpha = 0.7
                        for (let i = 0; i < 8; i++) {
                            const fireX = -60 + i * 15
                            const fireY = -5 + (Math.random() - 0.5) * 10
                            const fireSize = 8 + Math.random() * 12
                            const fireColor = `hsl(${Math.random() * 30}, 100%, ${60 + Math.random() * 20}%)`
                            
                            this.ctx.fillStyle = fireColor
                            this.ctx.beginPath()
                            this.ctx.arc(fireX, fireY, fireSize, 0, Math.PI * 2)
                            this.ctx.fill()
                        }
                        this.ctx.restore()
                    }
                    
                    animal.parts.forEach(part => {
                        this.ctx.save()
                        
                        if (part.type === 'glow' || part.type === 'belly' || part.type === 'eye') {
                            this.ctx.shadowColor = part.color
                            this.ctx.shadowBlur = 8
                        }
                        
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
            }
        }

        // Initialize the lava biome
        lavaInstanceRef.current = new Dense2DParticleLavaBiome(canvasRef.current)

        // Cleanup function
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            if (lavaInstanceRef.current) {
                window.removeEventListener('resize', lavaInstanceRef.current.onWindowResize)
            }
        }
    }, [])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (lavaInstanceRef.current) {
                lavaInstanceRef.current.onWindowResize()
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleMouseMove = (e) => {
        setCursorPos({ x: e.clientX, y: e.clientY })
    }

    return (
        <div 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, #8B0000 0%, #FF4500 30%, #FF6347 60%, #DC143C 100%)',
                overflow: 'hidden',
                margin: 0,
                padding: 0,
                cursor: 'none'
            }}
            onMouseMove={handleMouseMove}
        >
            {/* Custom cursor */}
            <div
                style={{
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                    left: cursorPos.x - 10,
                    top: cursorPos.y - 10,
                    transform: 'translate(-50%, -50%)'
                }}
            />

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

export default LavaBiome