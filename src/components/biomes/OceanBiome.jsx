import { useEffect, useRef, useState } from 'react'

const OceanBiome = () => {
    const canvasRef = useRef(null)
    const animationRef = useRef()
    const oceanInstanceRef = useRef()
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        if (!canvasRef.current) return

        class ImmersiveOceanBiome {
            constructor(canvas) {
                this.canvas = canvas
                this.ctx = this.canvas.getContext('2d')
                this.particles = []
                this.seaCreatures = []
                this.bubbles = []
                this.backgroundAlgae = []
                this.vibrantCorals = []
                this.stars = []
                this.time = 0
                this.mouse = { x: 0, y: 0 }
                this.currentStrength = 1
                this.currentDirection = 0
                this.frameCount = 0
                this.cursorInfluenceRadius = 50
                this.cursorStrength = 30
                
                this.init()
                this.createStars()
                this.createBackgroundAlgae()
                this.createVibrantCorals()
                this.createOceanFloor()
                this.createCorals()
                this.createSeaweed()
                this.createKelp()
                this.createSeaCreatures()
                this.createBubbles()
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

            applyCursorInteraction(obj) {
                const dx = this.mouse.x - obj.x
                const dy = this.mouse.y - obj.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                
                if (distance < this.cursorInfluenceRadius && distance > 0) {
                    const force = (this.cursorInfluenceRadius - distance) / this.cursorInfluenceRadius
                    const angle = Math.atan2(dy, dx)
                    const pushX = -Math.cos(angle) * force * this.cursorStrength
                    const pushY = -Math.sin(angle) * force * this.cursorStrength
                    
                    obj.offsetX = (obj.offsetX || 0) + pushX * 0.1
                    obj.offsetY = (obj.offsetY || 0) + pushY * 0.1
                } else {
                    // Return to original position gradually
                    obj.offsetX = (obj.offsetX || 0) * 0.95
                    obj.offsetY = (obj.offsetY || 0) * 0.95
                }
            }

            createStars() {
                for (let i = 0; i < 100; i++) {
                    const star = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height * 0.5,
                        originalX: 0,
                        originalY: 0,
                        offsetX: 0,
                        offsetY: 0,
                        size: Math.random() * 2 + 0.5,
                        brightness: Math.random(),
                        twinkleSpeed: Math.random() * 0.02 + 0.01,
                        vx: (Math.random() - 0.5) * 0.3,
                        vy: (Math.random() - 0.5) * 0.2,
                        phase: Math.random() * Math.PI * 2
                    }
                    star.originalX = star.x
                    star.originalY = star.y
                    this.stars.push(star)
                }
            }

            createBackgroundAlgae() {
                for (let i = 0; i < 150; i++) {
                    const algae = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        originalX: 0,
                        originalY: 0,
                        offsetX: 0,
                        offsetY: 0,
                        size: Math.random() * 3 + 1,
                        originalSize: Math.random() * 3 + 1,
                        color: `hsl(${120 + Math.random() * 80}, ${60 + Math.random() * 30}%, ${40 + Math.random() * 30}%)`,
                        vx: (Math.random() - 0.5) * 1.2,
                        vy: (Math.random() - 0.5) * 0.8,
                        swayPhase: Math.random() * Math.PI * 2,
                        breathePhase: Math.random() * Math.PI * 2,
                        opacity: 0.1 + Math.random() * 0.2,
                        rotationSpeed: (Math.random() - 0.5) * 0.05,
                        rotation: 0
                    }
                    algae.originalSize = algae.size
                    algae.originalX = algae.x
                    algae.originalY = algae.y
                    this.backgroundAlgae.push(algae)
                }
            }

            createVibrantCorals() {
                for (let i = 0; i < 8; i++) {
                    const coral = {
                        x: Math.random() * this.canvas.width,
                        y: this.canvas.height - 100 - Math.random() * 200,
                        originalX: 0,
                        originalY: 0,
                        offsetX: 0,
                        offsetY: 0,
                        size: 20 + Math.random() * 40,
                        color: `hsl(${300 + Math.random() * 120}, ${70 + Math.random() * 20}%, ${50 + Math.random() * 25}%)`,
                        branches: [],
                        swayPhase: Math.random() * Math.PI * 2,
                        glowPhase: Math.random() * Math.PI * 2
                    }
                    coral.originalX = coral.x
                    coral.originalY = coral.y

                    for (let j = 0; j < 8; j++) {
                        const angle = (j / 8) * Math.PI * 2
                        const length = 30 + Math.random() * 50
                        coral.branches.push({
                            angle: angle,
                            length: length,
                            segments: Math.floor(length / 10),
                            color: `hsl(${300 + Math.random() * 120}, ${60 + Math.random() * 30}%, ${45 + Math.random() * 20}%)`
                        })
                    }
                    this.vibrantCorals.push(coral)
                }
            }
                        createOceanFloor() {
                for (let i = 0; i < 800; i++) {
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: this.canvas.height - Math.random() * 60,
                        originalX: 0,
                        originalY: 0,
                        offsetX: 0,
                        offsetY: 0,
                        size: Math.random() * 15 + 8,
                        color: `hsl(${35 + Math.random() * 40}, ${40 + Math.random() * 30}%, ${65 + Math.random() * 25}%)`,
                        type: 'sand'
                    }
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }

                for (let i = 0; i < 50; i++) {
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: this.canvas.height - Math.random() * 50 - 15,
                        originalX: 0,
                        originalY: 0,
                        offsetX: 0,
                        offsetY: 0,
                        size: Math.random() * 35 + 20,
                        color: `hsl(${200 + Math.random() * 60}, ${30 + Math.random() * 40}%, ${30 + Math.random() * 30}%)`,
                        type: 'rock'
                    }
                    particle.originalX = particle.x
                    particle.originalY = particle.y
                    this.particles.push(particle)
                }
            }
            
            createCorals() {
                for (let i = 0; i < 15; i++) {
                    const baseX = Math.random() * this.canvas.width
                    const baseY = this.canvas.height - 30 - Math.random() * 25
                    const coralHeight = 40 + Math.random() * 40
                    const coralColor = `hsl(${280 + Math.random() * 80}, ${70 + Math.random() * 20}%, ${55 + Math.random() * 20}%)`
                    
                    for (let j = 0; j < 10; j++) {
                        const angle = (j / 10) * Math.PI * 2
                        const radius = Math.random() * 30 + 15
                        const height = Math.random() * coralHeight
                        const particleX = baseX + Math.cos(angle) * radius * (height / coralHeight)
                        
                        const particle = {
                            x: particleX,
                            y: baseY - height,
                            originalX: particleX,
                            originalY: baseY - height,
                            offsetX: 0,
                            offsetY: 0,
                            size: Math.random() * 8 + 4,
                            originalSize: Math.random() * 8 + 4,
                            color: coralColor,
                            type: 'coral',
                            swayPhase: Math.random() * Math.PI * 2,
                            breathePhase: Math.random() * Math.PI * 2,
                            breatheSpeed: 0.015 + Math.random() * 0.02,
                            baseX: particleX
                        }
                        particle.originalSize = particle.size
                        this.particles.push(particle)
                    }
                }
            }
            
            createSeaweed() {
                for (let i = 0; i < 20; i++) {
                    const baseX = Math.random() * this.canvas.width
                    const baseY = this.canvas.height - 15
                    const height = 80 + Math.random() * 120
                    
                    for (let j = 0; j < 10; j++) {
                        const progress = j / 10
                        const segmentY = baseY - progress * height
                        
                        const particle = {
                            x: baseX,
                            y: segmentY,
                            originalX: baseX,
                            originalY: segmentY,
                            offsetX: 0,
                            offsetY: 0,
                            size: Math.random() * 6 + 3,
                            originalSize: Math.random() * 6 + 3,
                            color: `hsl(${100 + Math.random() * 80}, ${70 + Math.random() * 20}%, ${35 + Math.random() * 25}%)`,
                            type: 'seaweed',
                            swayPhase: Math.random() * Math.PI * 2,
                            breathePhase: Math.random() * Math.PI * 2,
                            breatheSpeed: 0.02 + Math.random() * 0.015,
                            segmentProgress: progress,
                            baseX: baseX,
                            baseY: segmentY
                        }
                        particle.originalSize = particle.size
                        this.particles.push(particle)
                    }
                }
            }
            
            createKelp() {
                for (let i = 0; i < 10; i++) {
                    const baseX = (i * this.canvas.width / 10) + Math.random() * 100
                    const baseY = this.canvas.height - 10
                    const trunkHeight = 200 + Math.random() * 300
                    
                    for (let j = 0; j < 25; j++) {
                        const progress = j / 25
                        const segmentY = baseY - progress * trunkHeight
                        const naturalCurve = Math.sin(progress * Math.PI * 0.5) * 20
                        
                        const particle = {
                            x: baseX + naturalCurve,
                            y: segmentY,
                            originalX: baseX + naturalCurve,
                            originalY: segmentY,
                            offsetX: 0,
                            offsetY: 0,
                            size: (1 - progress * 0.3) * 16 + 8,
                            originalSize: (1 - progress * 0.3) * 16 + 8,
                            color: `hsl(${80 + Math.random() * 40}, ${50 + Math.random() * 30}%, ${25 + Math.random() * 20}%)`,
                            type: 'kelp_trunk',
                            swayPhase: Math.random() * Math.PI * 2,
                            breathePhase: Math.random() * Math.PI * 2,
                            breatheSpeed: 0.01 + Math.random() * 0.02,
                            segmentProgress: progress,
                            baseX: baseX + naturalCurve,
                            baseY: segmentY
                        }
                        this.particles.push(particle)
                        
                        if (j > 5 && j % 4 === 0) {
                            for (let side = -1; side <= 1; side += 2) {
                                const bladeLength = 30 + Math.random() * 50
                                
                                for (let bs = 0; bs < 8; bs++) {
                                    const bladeProgress = bs / 8
                                    const bladeX = baseX + naturalCurve + side * (8 + bladeProgress * bladeLength)
                                    const bladeY = segmentY - bladeProgress * 25
                                    
                                    const bladeParticle = {
                                        x: bladeX,
                                        y: bladeY,
                                        originalX: bladeX,
                                        originalY: bladeY,
                                        offsetX: 0,
                                        offsetY: 0,
                                        size: (1 - bladeProgress * 0.5) * 10 + 5,
                                        originalSize: (1 - bladeProgress * 0.5) * 10 + 5,
                                        color: `hsl(${100 + Math.random() * 60}, ${60 + Math.random() * 30}%, ${30 + Math.random() * 25}%)`,
                                        type: 'kelp_blade',
                                        swayPhase: Math.random() * Math.PI * 2,
                                        breathePhase: Math.random() * Math.PI * 2,
                                        breatheSpeed: 0.02 + Math.random() * 0.01,
                                        segmentProgress: progress,
                                        bladeProgress: bladeProgress,
                                        side: side,
                                        baseX: bladeX,
                                        baseY: bladeY,
                                        trunkX: baseX + naturalCurve,
                                        trunkY: segmentY
                                    }
                                    this.particles.push(bladeParticle)
                                }
                            }
                        }
                    }
                }
            }
                        createSeaCreatures() {
                for (let i = 0; i < 8; i++) {
                    this.createTropicalFish()
                }
                
                for (let i = 0; i < 2; i++) {
                    this.createJellyfish()
                }
                
                this.createSquid()
                this.createShark()
            }
            
            createTropicalFish() {
                const fishTypes = ['tropical', 'angelfish', 'clownfish', 'tang', 'wrasse']
                const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)]
                
                const fish = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * (this.canvas.height - 200) + 100,
                    originalX: 0,
                    originalY: 0,
                    offsetX: 0,
                    offsetY: 0,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'fish',
                    fishType: fishType,
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    swimSpeed: 0.3 + Math.random() * 1.2,
                    verticalSpeed: 0.2 + Math.random() * 0.6,
                    size: 0.6 + Math.random() * 0.8,
                    changeTimer: Math.random() * 2,
                    verticalTimer: Math.random() * 3,
                    breathePhase: Math.random() * Math.PI * 2,
                    breatheSpeed: 0.03 + Math.random() * 0.04,
                    targetY: 0,
                    verticalDirection: Math.random() > 0.5 ? 1 : -1
                }
                
                let bodyColor, finColor, accentColor
                
                switch (fishType) {
                    case 'tropical':
                        bodyColor = `hsl(${200 + Math.random() * 160}, ${70 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`
                        finColor = `hsl(${30 + Math.random() * 60}, ${80 + Math.random() * 15}%, ${60 + Math.random() * 15}%)`
                        accentColor = `hsl(${300 + Math.random() * 60}, ${70 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`
                        break
                    case 'angelfish':
                        bodyColor = `hsl(${50 + Math.random() * 30}, ${60 + Math.random() * 30}%, ${60 + Math.random() * 20}%)`
                        finColor = `hsl(${40 + Math.random() * 40}, ${70 + Math.random() * 20}%, ${70 + Math.random() * 15}%)`
                        accentColor = `hsl(${0 + Math.random() * 20}, ${60 + Math.random() * 30}%, ${40 + Math.random() * 20}%)`
                        break
                    case 'clownfish':
                        bodyColor = `hsl(${15 + Math.random() * 20}, ${85 + Math.random() * 10}%, ${55 + Math.random() * 15}%)`
                        finColor = `hsl(${0 + Math.random() * 10}, ${70 + Math.random() * 20}%, ${30 + Math.random() * 20}%)`
                        accentColor = '#FFFFFF'
                        break
                    case 'tang':
                        bodyColor = `hsl(${200 + Math.random() * 40}, ${70 + Math.random() * 20}%, ${40 + Math.random() * 20}%)`
                        finColor = `hsl(${50 + Math.random() * 30}, ${80 + Math.random() * 15}%, ${60 + Math.random() * 15}%)`
                        accentColor = `hsl(${250 + Math.random() * 40}, ${60 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`
                        break
                    case 'wrasse':
                        bodyColor = `hsl(${280 + Math.random() * 60}, ${60 + Math.random() * 30}%, ${45 + Math.random() * 25}%)`
                        finColor = `hsl(${120 + Math.random() * 40}, ${70 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`
                        accentColor = `hsl(${180 + Math.random() * 40}, ${70 + Math.random() * 20}%, ${60 + Math.random() * 15}%)`
                        break
                }
                
                let bodyParts = []
                
                if (fishType === 'angelfish') {
                    bodyParts = [
                        { x: 0, y: 0, size: 18, color: bodyColor, type: 'body', originalSize: 18 },
                        { x: 8, y: 0, size: 15, color: bodyColor, type: 'body', originalSize: 15 },
                        { x: -8, y: 0, size: 12, color: bodyColor, type: 'body', originalSize: 12 },
                        { x: 15, y: 0, size: 10, color: bodyColor, type: 'head', originalSize: 10 },
                        { x: 18, y: -2, size: 3, color: '#FFFFFF', type: 'eye', originalSize: 3 },
                        { x: 5, y: -15, size: 8, color: finColor, type: 'fin', originalSize: 8 },
                        { x: 5, y: 15, size: 8, color: finColor, type: 'fin', originalSize: 8 },
                        { x: -15, y: 0, size: 10, color: finColor, type: 'tail', originalSize: 10 },
                        { x: 5, y: -5, size: 4, color: accentColor, type: 'stripe', originalSize: 4 },
                        { x: 5, y: 5, size: 4, color: accentColor, type: 'stripe', originalSize: 4 }
                    ]
                } else if (fishType === 'clownfish') {
                    bodyParts = [
                        { x: 0, y: 0, size: 12, color: bodyColor, type: 'body', originalSize: 12 },
                        { x: 8, y: 0, size: 10, color: bodyColor, type: 'body', originalSize: 10 },
                        { x: -8, y: 0, size: 8, color: bodyColor, type: 'body', originalSize: 8 },
                        { x: 15, y: 0, size: 7, color: bodyColor, type: 'head', originalSize: 7 },
                        { x: 18, y: -2, size: 2, color: '#000000', type: 'eye', originalSize: 2 },
                        { x: 3, y: -8, size: 5, color: finColor, type: 'fin', originalSize: 5 },
                        { x: 3, y: 8, size: 5, color: finColor, type: 'fin', originalSize: 5 },
                        { x: -12, y: 0, size: 6, color: finColor, type: 'tail', originalSize: 6 },
                        { x: 5, y: 0, size: 3, color: accentColor, type: 'stripe', originalSize: 3 },
                        { x: -3, y: 0, size: 3, color: accentColor, type: 'stripe', originalSize: 3 }
                    ]
                } else {
                    bodyParts = [
                        { x: 0, y: 0, size: 15, color: bodyColor, type: 'body', originalSize: 15 },
                        { x: 8, y: 0, size: 12, color: bodyColor, type: 'body', originalSize: 12 },
                        { x: -8, y: 0, size: 10, color: bodyColor, type: 'body', originalSize: 10 },
                        { x: 15, y: 0, size: 8, color: bodyColor, type: 'head', originalSize: 8 },
                        { x: 18, y: -2, size: 3, color: '#FFFFFF', type: 'eye', originalSize: 3 },
                        { x: 5, y: -8, size: 6, color: finColor, type: 'fin', originalSize: 6 },
                        { x: 5, y: 8, size: 6, color: finColor, type: 'fin', originalSize: 6 },
                        { x: -15, y: 0, size: 8, color: finColor, type: 'tail', originalSize: 8 },
                        { x: 3, y: 0, size: 3, color: accentColor, type: 'spot', originalSize: 3 }
                    ]
                }
                
                fish.parts = bodyParts
                fish.targetY = fish.y
                fish.originalX = fish.x
                fish.originalY = fish.y
                this.seaCreatures.push(fish)
            }
            
            createJellyfish() {
                const jellyfish = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * (this.canvas.height - 300) + 50,
                    originalX: 0,
                    originalY: 0,
                    offsetX: 0,
                    offsetY: 0,
                    vx: 0,
                    vy: 0,
                    type: 'jellyfish',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.015 + Math.random() * 0.015,
                    size: 1 + Math.random() * 0.5,
                    breathePhase: Math.random() * Math.PI * 2,
                    breatheSpeed: 0.02 + Math.random() * 0.03
                }
                
                const jellyfishColor = `hsl(${200 + Math.random() * 160}, ${50 + Math.random() * 40}%, ${60 + Math.random() * 30}%)`
                
                const bodyParts = [
                    { x: 0, y: 0, size: 20, color: jellyfishColor, type: 'bell', originalSize: 20 },
                    { x: -5, y: 15, size: 2, color: jellyfishColor, type: 'tentacle', originalSize: 2 },
                    { x: 0, y: 20, size: 2, color: jellyfishColor, type: 'tentacle', originalSize: 2 },
                    { x: 5, y: 15, size: 2, color: jellyfishColor, type: 'tentacle', originalSize: 2 }
                ]
                
                jellyfish.parts = bodyParts
                jellyfish.originalX = jellyfish.x
                jellyfish.originalY = jellyfish.y
                this.seaCreatures.push(jellyfish)
            }
            
            createSquid() {
                const squid = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * (this.canvas.height - 250) + 100,
                    originalX: 0,
                    originalY: 0,
                    offsetX: 0,
                    offsetY: 0,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'squid',
                    parts: [],
                    jetTimer: Math.random() * 2,
                    jetSpeed: 0.8 + Math.random() * 1.2,
                    size: 1.2,
                    breathePhase: Math.random() * Math.PI * 2,
                    breatheSpeed: 0.04 + Math.random() * 0.02
                }
                
                const squidColor = `hsl(${320 + Math.random() * 40}, ${30 + Math.random() * 40}%, ${30 + Math.random() * 20}%)`
                
                const bodyParts = [
                    { x: 0, y: 0, size: 15, color: squidColor, type: 'body', originalSize: 15 },
                    { x: 8, y: 0, size: 12, color: squidColor, type: 'body', originalSize: 12 },
                    { x: 15, y: 0, size: 10, color: squidColor, type: 'head', originalSize: 10 },
                    { x: 18, y: -3, size: 4, color: '#000000', type: 'eye', originalSize: 4 },
                    { x: 20, y: -8, size: 3, color: squidColor, type: 'tentacle', originalSize: 3 },
                    { x: 25, y: -5, size: 2, color: squidColor, type: 'tentacle', originalSize: 2 },
                    { x: 25, y: 0, size: 2, color: squidColor, type: 'tentacle', originalSize: 2 },
                    { x: 25, y: 5, size: 2, color: squidColor, type: 'tentacle', originalSize: 2 }
                ]
                
                squid.parts = bodyParts
                squid.originalX = squid.x
                squid.originalY = squid.y
                this.seaCreatures.push(squid)
            }
            
            createShark() {
                const shark = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * (this.canvas.height - 300) + 150,
                    originalX: 0,
                    originalY: 0,
                    offsetX: 0,
                    offsetY: 0,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'shark',
                    parts: [],
                    swimSpeed: 1.2 + Math.random() * 0.6,
                    size: 1.8,
                    changeTimer: Math.random() * 3,
                    breathePhase: Math.random() * Math.PI * 2,
                    breatheSpeed: 0.025 + Math.random() * 0.02
                }
                
                const sharkColor = `hsl(${200 + Math.random() * 20}, ${15 + Math.random() * 20}%, ${25 + Math.random() * 15}%)`
                
                const bodyParts = [
                    { x: 0, y: 0, size: 20, color: sharkColor, type: 'body', originalSize: 20 },
                    { x: 15, y: 0, size: 18, color: sharkColor, type: 'body', originalSize: 18 },
                    { x: 30, y: 0, size: 15, color: sharkColor, type: 'head', originalSize: 15 },
                    { x: 35, y: -5, size: 3, color: '#000000', type: 'eye', originalSize: 3 },
                    { x: -10, y: -15, size: 10, color: sharkColor, type: 'fin', originalSize: 10 },
                    { x: 15, y: -10, size: 6, color: sharkColor, type: 'fin', originalSize: 6 },
                    { x: 15, y: 10, size: 6, color: sharkColor, type: 'fin', originalSize: 6 },
                    { x: -25, y: 0, size: 12, color: sharkColor, type: 'tail', originalSize: 12 }
                ]
                
                shark.parts = bodyParts
                shark.originalX = shark.x
                shark.originalY = shark.y
                this.seaCreatures.push(shark)
            }
            
            createBubbles() {
                for (let i = 0; i < 25; i++) {
                    const bubble = {
                        x: Math.random() * this.canvas.width,
                        y: this.canvas.height + Math.random() * 200,
                        originalX: 0,
                        originalY: 0,
                        offsetX: 0,
                        offsetY: 0,
                        size: Math.random() * 15 + 8,
                        riseSpeed: Math.random() * 1.5 + 0.5,
                        wobblePhase: Math.random() * Math.PI * 2
                    }
                    bubble.originalX = bubble.x
                    bubble.originalY = bubble.y
                    this.bubbles.push(bubble)
                }
            }
                        animate() {
                this.time += 0.016
                this.frameCount++
                
                if (this.frameCount % 3 === 0) {
                    this.currentDirection = Math.sin(this.time * 0.005) * 0.3
                    this.currentStrength = (Math.sin(this.time * 0.006) + 1) * 0.4 + 0.2
                }
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                
                this.animateStars()
                this.animateBackgroundAlgae()
                this.animateVibrantCorals()
                this.animateParticles()
                this.animateSeaCreatures()
                this.animateBubbles()
                
                this.drawStars()
                this.drawBackgroundAlgae()
                this.drawVibrantCorals()
                this.drawParticles()
                this.drawSeaCreatures()
                this.drawBubbles()
                
                animationRef.current = requestAnimationFrame(() => this.animate())
            }

            animateStars() {
                this.stars.forEach(star => {
                    this.applyCursorInteraction(star)
                    
                    star.phase += star.twinkleSpeed
                    star.brightness = 0.3 + Math.sin(star.phase) * 0.7
                    
                    star.x += star.vx
                    star.y += star.vy
                    
                    if (star.x < 0) star.x = this.canvas.width
                    if (star.x > this.canvas.width) star.x = 0
                    if (star.y < 0) star.y = this.canvas.height * 0.5
                    if (star.y > this.canvas.height * 0.5) star.y = 0
                    
                    star.originalX = star.x
                    star.originalY = star.y
                })
            }

            animateBackgroundAlgae() {
                this.backgroundAlgae.forEach(algae => {
                    this.applyCursorInteraction(algae)
                    
                    algae.breathePhase += algae.breatheSpeed || 0.03
                    const breatheScale = 1 + Math.sin(algae.breathePhase) * 0.3
                    algae.size = algae.originalSize * breatheScale
                    
                    algae.rotation += algae.rotationSpeed
                    
                    algae.x += algae.vx + Math.sin(this.time * 0.01 + algae.swayPhase) * 0.5
                    algae.y += algae.vy + Math.cos(this.time * 0.008 + algae.swayPhase) * 0.3
                    
                    if (algae.x < -20) algae.x = this.canvas.width + 20
                    if (algae.x > this.canvas.width + 20) algae.x = -20
                    if (algae.y < -20) algae.y = this.canvas.height + 20
                    if (algae.y > this.canvas.height + 20) algae.y = -20
                    
                    algae.originalX = algae.x
                    algae.originalY = algae.y
                })
            }

            animateVibrantCorals() {
                this.vibrantCorals.forEach(coral => {
                    this.applyCursorInteraction(coral)
                    
                    coral.swayPhase += 0.01
                    coral.glowPhase += 0.02
                })
            }
            
            animateParticles() {
                this.particles.forEach(particle => {
                    this.applyCursorInteraction(particle)
                    
                    if (particle.type === 'coral' || particle.type === 'seaweed' || 
                        particle.type === 'kelp_trunk' || particle.type === 'kelp_blade') {
                        particle.breathePhase += particle.breatheSpeed || 0.025
                        const breatheScale = 1 + Math.sin(particle.breathePhase) * 0.2
                        particle.size = particle.originalSize * breatheScale
                    }
                    
                    switch (particle.type) {
                        case 'coral':
                            const coralSway = Math.sin(this.time * 0.01 + particle.swayPhase) * 3
                            particle.x = particle.baseX + coralSway
                            particle.originalX = particle.x
                            break
                            
                        case 'seaweed':
                            const seaweedSwayX = Math.sin(this.time * 0.015 + particle.swayPhase) * 8 * particle.segmentProgress
                            const seaweedSwayY = Math.cos(this.time * 0.012 + particle.swayPhase) * 3 * particle.segmentProgress
                            particle.x = particle.baseX + seaweedSwayX
                            particle.y = particle.baseY + seaweedSwayY
                            particle.originalX = particle.x
                            particle.originalY = particle.y
                            break
                            
                        case 'kelp_trunk':
                            const trunkSway = Math.sin(this.time * 0.01 + particle.swayPhase) * 10 * particle.segmentProgress
                            particle.x = particle.baseX + trunkSway
                            particle.originalX = particle.x
                            break
                            
                        case 'kelp_blade':
                            const trunkSwayX = Math.sin(this.time * 0.01 + particle.swayPhase) * 10 * particle.segmentProgress
                            const bladeSwayX = Math.sin(this.time * 0.025 + particle.swayPhase + particle.bladeProgress) * 15 * particle.bladeProgress
                            const bladeSwayY = Math.cos(this.time * 0.02 + particle.swayPhase) * 5 * particle.bladeProgress
                            
                            const trunkNewX = particle.trunkX + trunkSwayX
                            const offsetX = particle.baseX - particle.trunkX
                            const offsetY = particle.baseY - particle.trunkY
                            
                            particle.x = trunkNewX + offsetX + bladeSwayX * particle.side
                            particle.y = particle.baseY + offsetY + bladeSwayY
                            particle.originalX = particle.x
                            particle.originalY = particle.y
                            break
                    }
                })
            }
            
            animateSeaCreatures() {
                this.seaCreatures.forEach(creature => {
                    this.applyCursorInteraction(creature)
                    
                    creature.changeTimer += 0.016
                    creature.breathePhase += creature.breatheSpeed || 0.05
                    
                    const breatheScale = 1 + Math.sin(creature.breathePhase) * 0.1
                    creature.parts.forEach(part => {
                        if (part.type === 'body' || part.type === 'bell') {
                            part.size = part.originalSize * breatheScale
                        }
                    })
                    
                    switch (creature.type) {
                        case 'fish':
                            if (creature.changeTimer > (2 + Math.random() * 4)) {
                                creature.changeTimer = 0
                                creature.direction *= -1
                            }
                            
                            creature.verticalTimer += 0.016
                            if (creature.verticalTimer > (1.5 + Math.random() * 3)) {
                                creature.verticalTimer = 0
                                creature.verticalDirection *= -1
                                const minY = 80
                                const maxY = this.canvas.height - 150
                                creature.targetY = minY + Math.random() * (maxY - minY)
                            }
                            
                            creature.vx += (creature.direction * creature.swimSpeed - creature.vx) * 0.02
                            const yDiff = creature.targetY - creature.y
                            creature.vy += (yDiff * 0.01 - creature.vy) * 0.05
                            
                            creature.x += creature.vx
                            creature.y += creature.vy
                            
                            if (creature.x < -50) creature.x = this.canvas.width + 50
                            if (creature.x > this.canvas.width + 50) creature.x = -50
                            
                            creature.y = Math.max(80, Math.min(this.canvas.height - 150, creature.y))
                            
                            creature.originalX = creature.x
                            creature.originalY = creature.y
                            break
                            
                        case 'jellyfish':
                            creature.animPhase += creature.pulseSpeed
                            creature.y += Math.sin(creature.animPhase) * -0.3 - 0.1
                            creature.x += Math.sin(this.time * 0.02 + creature.breathePhase * 0.5) * 0.3
                            
                            if (creature.y < 0) creature.y = this.canvas.height - 100
                            if (creature.x < -50) creature.x = this.canvas.width + 50
                            if (creature.x > this.canvas.width + 50) creature.x = -50
                            
                            creature.originalX = creature.x
                            creature.originalY = creature.y
                            break
                            
                        case 'squid':
                            creature.jetTimer += 0.016
                            
                            if (creature.jetTimer > (2 + Math.random() * 3)) {
                                creature.jetTimer = 0
                                creature.vx = creature.direction * creature.jetSpeed * 2
                                creature.vy = (Math.random() - 0.5) * creature.jetSpeed
                                creature.direction *= -1
                            }
                            
                            creature.vx *= 0.95
                            creature.vy *= 0.98
                            creature.x += creature.vx
                            creature.y += creature.vy
                            
                            if (creature.x < -100) creature.x = this.canvas.width + 100
                            if (creature.x > this.canvas.width + 100) creature.x = -100
                            creature.y = Math.max(50, Math.min(this.canvas.height - 200, creature.y))
                            
                            creature.originalX = creature.x
                            creature.originalY = creature.y
                            break
                            
                        case 'shark':
                            if (creature.changeTimer > (4 + Math.random() * 6)) {
                                creature.changeTimer = 0
                                creature.direction *= -1
                            }
                            
                            creature.vx += (creature.direction * creature.swimSpeed - creature.vx) * 0.01
                            creature.x += creature.vx
                            
                            if (creature.x < -100) creature.x = this.canvas.width + 100
                            if (creature.x > this.canvas.width + 100) creature.x = -100
                            
                            creature.originalX = creature.x
                            creature.originalY = creature.y
                            break
                    }
                })
            }
            
            animateBubbles() {
                this.bubbles.forEach(bubble => {
                    this.applyCursorInteraction(bubble)
                    
                    bubble.y -= bubble.riseSpeed
                    bubble.x += Math.sin(this.time * 0.02 + bubble.wobblePhase) * 2
                    
                    if (bubble.y < -20) {
                        bubble.y = this.canvas.height + 50
                        bubble.x = Math.random() * this.canvas.width
                    }
                    
                    bubble.originalX = bubble.x
                    bubble.originalY = bubble.y
                })
            }
                        drawStars() {
                this.stars.forEach(star => {
                    this.ctx.globalAlpha = star.brightness
                    this.ctx.fillStyle = '#FFFFFF'
                    this.ctx.beginPath()
                    this.ctx.arc(star.x + star.offsetX, star.y + star.offsetY, star.size, 0, Math.PI * 2)
                    this.ctx.fill()
                })
                this.ctx.globalAlpha = 1.0
            }

            drawBackgroundAlgae() {
                this.backgroundAlgae.forEach(algae => {
                    this.ctx.save()
                    this.ctx.globalAlpha = algae.opacity
                    this.ctx.translate(algae.x + algae.offsetX, algae.y + algae.offsetY)
                    this.ctx.rotate(algae.rotation)
                    this.ctx.fillStyle = algae.color
                    this.ctx.beginPath()
                    this.ctx.arc(0, 0, algae.size, 0, Math.PI * 2)
                    this.ctx.fill()
                    this.ctx.restore()
                })
                this.ctx.globalAlpha = 1.0
            }

            drawVibrantCorals() {
                this.vibrantCorals.forEach(coral => {
                    this.ctx.save()
                    
                    const glowIntensity = 0.3 + Math.sin(coral.glowPhase) * 0.2
                    this.ctx.shadowColor = coral.color
                    this.ctx.shadowBlur = 15 * glowIntensity
                    
                    this.ctx.globalAlpha = 0.8
                    this.ctx.fillStyle = coral.color
                    this.ctx.beginPath()
                    this.ctx.arc(coral.x + coral.offsetX, coral.y + coral.offsetY, coral.size, 0, Math.PI * 2)
                    this.ctx.fill()
                    
                    coral.branches.forEach(branch => {
                        for (let i = 0; i < branch.segments; i++) {
                            const segmentProgress = i / branch.segments
                            const sway = Math.sin(coral.swayPhase + segmentProgress) * 5
                            const branchX = coral.x + coral.offsetX + Math.cos(branch.angle + sway * 0.1) * branch.length * segmentProgress
                            const branchY = coral.y + coral.offsetY + Math.sin(branch.angle + sway * 0.1) * branch.length * segmentProgress
                            const segmentSize = coral.size * (1 - segmentProgress * 0.6) * 0.3
                            
                            this.ctx.fillStyle = branch.color
                            this.ctx.beginPath()
                            this.ctx.arc(branchX, branchY, segmentSize, 0, Math.PI * 2)
                            this.ctx.fill()
                        }
                    })
                    
                    this.ctx.restore()
                })
                this.ctx.globalAlpha = 1.0
                this.ctx.shadowBlur = 0
            }
            
            drawParticles() {
                this.ctx.globalAlpha = 0.8
                this.particles.forEach(particle => {
                    this.ctx.fillStyle = particle.color
                    this.ctx.beginPath()
                    this.ctx.arc(particle.x + particle.offsetX, particle.y + particle.offsetY, particle.size, 0, Math.PI * 2)
                    this.ctx.fill()
                })
                this.ctx.globalAlpha = 1.0
            }
                        
            drawSeaCreatures() {
                this.seaCreatures.forEach(creature => {
                    this.ctx.save()
                    this.ctx.translate(creature.x + creature.offsetX, creature.y + creature.offsetY)
                    this.ctx.scale(creature.direction * creature.size, creature.size)
                    
                    creature.parts.forEach(part => {
                        this.ctx.fillStyle = part.color
                        this.ctx.beginPath()
                        this.ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2)
                        this.ctx.fill()
                    })
                    
                    this.ctx.restore()
                })
            }
            
            drawBubbles() {
                this.ctx.globalAlpha = 0.6
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
                this.ctx.lineWidth = 1
                
                this.bubbles.forEach(bubble => {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
                    this.ctx.beginPath()
                    this.ctx.arc(bubble.x + bubble.offsetX, bubble.y + bubble.offsetY, bubble.size, 0, Math.PI * 2)
                    this.ctx.fill()
                    this.ctx.stroke()
                })
                this.ctx.globalAlpha = 1.0
            }
            
            onWindowResize() {
                this.canvas.width = window.innerWidth
                this.canvas.height = window.innerHeight
            }
        }

        // Initialize the ocean biome
        oceanInstanceRef.current = new ImmersiveOceanBiome(canvasRef.current)

        // Cleanup function
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            if (oceanInstanceRef.current) {
                window.removeEventListener('resize', oceanInstanceRef.current.onWindowResize)
            }
        }
    }, [])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (oceanInstanceRef.current) {
                oceanInstanceRef.current.onWindowResize()
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
                background: 'radial-gradient(ellipse at center, #0066cc 0%, #004080 30%, #003366 60%, #001a33 100%)',
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
                    border: '2px solid rgba(64, 224, 255, 0.8)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    boxShadow: '0 0 20px rgba(64, 224, 255, 0.5)',
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

export default OceanBiome