import { useEffect, useRef, useState } from 'react';

const ForestBiome = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef();
    const forestInstanceRef = useRef();
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!canvasRef.current) return;

        class Dense2DParticleForest {
            constructor(canvas, mouseRef) {
                this.canvas = canvas;
                this.ctx = this.canvas.getContext('2d');
                this.particles = [];
                this.animals = [];
                this.sun = null;
                this.time = 0;
                this.mouseRef = mouseRef;
                this.windStrength = 1;
                this.windDirection = 0;
                
                this.init();
                this.createForest();
                this.createAnimals();
                this.createSun();
                this.animate();
            }
            
            init() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                window.addEventListener('resize', () => this.onWindowResize());
            }
            
            createSun() {
                const sunX = this.canvas.width * 0.85;
                const sunY = this.canvas.height * 0.15;
                
                this.sun = {
                    x: sunX,
                    y: sunY,
                    baseSize: 40,
                    size: 40,
                    color: '#FFD700',
                    pulseSpeed: 0.02,
                    pulsePhase: 0,
                    glowIntensity: 1
                };
            }
            
            createForest() {
                this.createDenseTrees(3000);
                this.createFallingLeaves(100);
                this.createUndergrowth(1000);
            }
            
            createAnimals() {
                // Create cows
                for (let i = 0; i < 4; i++) {
                    this.createCow();
                }
                
                // Create pigs
                for (let i = 0; i < 5; i++) {
                    this.createPig();
                }
            }
            
            createCow() {
                const cow = {
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height - 60 - Math.random() * 20,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'cow',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    wanderTimer: 0,
                    wanderTarget: { x: 0, y: 0 },
                    size: 1.2 + Math.random() * 0.4,
                    idleTimer: 0,
                    idleDuration: 2 + Math.random() * 4,
                    isWalking: false,
                    breathePhase: Math.random() * Math.PI * 2
                };
                
                const bodyParts = [
                    { x: 0, y: 0, size: 35, color: '#FFFFFF', type: 'body' },
                    { x: -10, y: -4, size: 32, color: '#FFFFFF', type: 'body' },
                    { x: 10, y: -4, size: 32, color: '#FFFFFF', type: 'body' },
                    { x: 0, y: -10, size: 30, color: '#FFFFFF', type: 'body' },
                    { x: 0, y: 10, size: 30, color: '#FFFFFF', type: 'body' },
                    { x: -15, y: 5, size: 28, color: '#FFFFFF', type: 'body' },
                    { x: 15, y: 5, size: 28, color: '#FFFFFF', type: 'body' },
                    { x: -18, y: -12, size: 12, color: '#000000', type: 'spot' },
                    { x: 20, y: -8, size: 9, color: '#000000', type: 'spot' },
                    { x: -12, y: 15, size: 10, color: '#000000', type: 'spot' },
                    { x: 25, y: 18, size: 8, color: '#000000', type: 'spot' },
                    { x: -28, y: -10, size: 18, color: '#FFFFFF', type: 'head' },
                    { x: -35, y: -8, size: 15, color: '#FFFFFF', type: 'head' },
                    { x: -40, y: -18, size: 6, color: '#FFB6C1', type: 'ear' },
                    { x: -31, y: -21, size: 6, color: '#FFB6C1', type: 'ear' },
                    { x: -33, y: -12, size: 2, color: '#000000', type: 'eye' },
                    { x: -28, y: -12, size: 2, color: '#000000', type: 'eye' },
                    { x: -12, y: 30, size: 9, color: '#FFFFFF', type: 'leg' },
                    { x: -4, y: 30, size: 9, color: '#FFFFFF', type: 'leg' },
                    { x: 4, y: 30, size: 9, color: '#FFFFFF', type: 'leg' },
                    { x: 12, y: 30, size: 9, color: '#FFFFFF', type: 'leg' },
                    { x: -12, y: 38, size: 6, color: '#8B4513', type: 'hoof' },
                    { x: -4, y: 38, size: 6, color: '#8B4513', type: 'hoof' },
                    { x: 4, y: 38, size: 6, color: '#8B4513', type: 'hoof' },
                    { x: 12, y: 38, size: 6, color: '#8B4513', type: 'hoof' },
                    { x: 38, y: 3, size: 5, color: '#FFFFFF', type: 'tail' },
                    { x: 42, y: 5, size: 6, color: '#8B4513', type: 'tail_tip' }
                ];
                
                cow.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.02 + 0.01,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.015 + 0.008,
                    breatheAmount: part.type === 'body' ? 0.15 : 0.08
                }));
                
                this.animals.push(cow);
            }
            
            createPig() {
                const pig = {
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height - 55 - Math.random() * 15,
                    vx: 0,
                    vy: 0,
                    direction: Math.random() > 0.5 ? 1 : -1,
                    type: 'pig',
                    parts: [],
                    animPhase: Math.random() * Math.PI * 2,
                    wanderTimer: 0,
                    wanderTarget: { x: 0, y: 0 },
                    size: 1.0 + Math.random() * 0.4,
                    idleTimer: 0,
                    idleDuration: 1.5 + Math.random() * 3,
                    isWalking: false,
                    breathePhase: Math.random() * Math.PI * 2
                };
                
                const bodyParts = [
                    { x: 0, y: 0, size: 30, color: '#FFB6C1', type: 'body' },
                    { x: -8, y: -3, size: 28, color: '#FFB6C1', type: 'body' },
                    { x: 8, y: -3, size: 28, color: '#FFB6C1', type: 'body' },
                    { x: 0, y: -8, size: 25, color: '#FFB6C1', type: 'body' },
                    { x: 0, y: 8, size: 25, color: '#FFB6C1', type: 'body' },
                    { x: -10, y: 4, size: 23, color: '#FFB6C1', type: 'body' },
                    { x: 10, y: 4, size: 23, color: '#FFB6C1', type: 'body' },
                    { x: -24, y: -6, size: 15, color: '#FFB6C1', type: 'head' },
                    { x: -32, y: -4, size: 13, color: '#FFB6C1', type: 'head' },
                    { x: -37, y: -3, size: 9, color: '#FF69B4', type: 'snout' },
                    { x: -42, y: -1, size: 6, color: '#FF1493', type: 'snout_tip' },
                    { x: -34, y: -13, size: 5, color: '#FFB6C1', type: 'ear' },
                    { x: -26, y: -13, size: 5, color: '#FFB6C1', type: 'ear' },
                    { x: -29, y: -9, size: 2, color: '#000000', type: 'eye' },
                    { x: -24, y: -9, size: 2, color: '#000000', type: 'eye' },
                    { x: -10, y: 30, size: 8, color: '#FFB6C1', type: 'leg' },
                    { x: -3, y: 30, size: 8, color: '#FFB6C1', type: 'leg' },
                    { x: 3, y: 30, size: 8, color: '#FFB6C1', type: 'leg' },
                    { x: 10, y: 30, size: 8, color: '#FFB6C1', type: 'leg' },
                    { x: -10, y: 36, size: 5, color: '#8B4513', type: 'hoof' },
                    { x: -3, y: 36, size: 5, color: '#8B4513', type: 'hoof' },
                    { x: 3, y: 36, size: 5, color: '#8B4513', type: 'hoof' },
                    { x: 10, y: 36, size: 5, color: '#8B4513', type: 'hoof' },
                    { x: 21, y: -1, size: 4, color: '#FFB6C1', type: 'tail' },
                    { x: 24, y: -4, size: 4, color: '#FFB6C1', type: 'tail' },
                    { x: 26, y: -6, size: 4, color: '#FFB6C1', type: 'tail' }
                ];
                
                pig.parts = bodyParts.map(part => ({
                    ...part,
                    originalX: part.x,
                    originalY: part.y,
                    baseSize: part.size,
                    animSpeed: Math.random() * 0.03 + 0.015,
                    animPhase: Math.random() * Math.PI * 2,
                    breatheSpeed: Math.random() * 0.02 + 0.01,
                    breatheAmount: part.type === 'body' ? 0.18 : 0.1
                }));
                
                this.animals.push(pig);
            }
            
            createDenseTrees(count) {
                const treeCount = 35;
                const spacing = this.canvas.width / treeCount;
                
                const treeClusters = [];
                for (let i = 0; i < treeCount; i++) {
                    const treeType = Math.random();
                    const baseX = i * spacing + (Math.random() - 0.5) * spacing * 0.3;
                    const baseY = this.canvas.height - Math.random() * 60 - 20;
                    
                    treeClusters.push({
                        x: baseX,
                        y: baseY,
                        height: Math.random() * 600 + 600,
                        width: Math.random() * 100 + 60,
                        lean: (Math.random() - 0.5) * 0.2,
                        branchiness: Math.random() * 0.7 + 0.3,
                        foliageDensity: Math.random() * 0.2 + 1,
                        type: treeType < 0.15 ? 'pine' : treeType < 0.3 ? 'oak' : treeType < 0.45 ? 'birch' : 
                              treeType < 0.6 ? 'willow' : treeType < 0.75 ? 'maple' : treeType < 0.9 ? 'cedar' : 'palm',
                        swayPhase: Math.random() * Math.PI * 2,
                        breathePhase: Math.random() * Math.PI * 2,
                        windSensitivity: Math.random() * 0.5 + 0.5
                    });
                }
                
                treeClusters.forEach(tree => {
                    const particlesPerTree = Math.floor(count / treeClusters.length);
                    
                    for (let i = 0; i < particlesPerTree; i++) {
                        const progress = i / particlesPerTree;
                        
                        let particle;
                        
                        if (progress < 0.25) {
                            const trunkWidth = tree.width * (1 - progress * 0.6);
                            const leanOffset = tree.lean * progress * tree.height;
                            
                            let trunkColor;
                            switch (tree.type) {
                                case 'birch':
                                    trunkColor = `hsl(0, 0%, ${80 + Math.random() * 15}%)`;
                                    break;
                                case 'palm':
                                    trunkColor = `hsl(30, ${40 + Math.random() * 20}%, ${35 + Math.random() * 15}%)`;
                                    break;
                                case 'cedar':
                                    trunkColor = `hsl(15, ${30 + Math.random() * 20}%, ${20 + Math.random() * 15}%)`;
                                    break;
                                default:
                                    trunkColor = `hsl(25, ${25 + Math.random() * 25}%, ${12 + Math.random() * 18}%)`;
                            }
                            
                            particle = {
                                x: tree.x + (Math.random() - 0.5) * trunkWidth + leanOffset,
                                y: tree.y - progress * tree.height,
                                size: Math.random() * 12 + 8,
                                baseSize: Math.random() * 12 + 8,
                                color: trunkColor,
                                type: 'trunk',
                                originalX: tree.x + leanOffset,
                                originalY: tree.y - progress * tree.height,
                                swayAmount: Math.random() * 1.5 + 0.5,
                                swaySpeed: Math.random() * 0.015 + 0.005,
                                swayPhase: tree.swayPhase + Math.random() * 0.5,
                                breatheSpeed: Math.random() * 0.02 + 0.01,
                                breathePhase: tree.breathePhase + Math.random() * Math.PI,
                                breatheAmount: 0.2 + Math.random() * 0.3,
                                windSensitivity: tree.windSensitivity * (1 - progress * 0.3),
                                height: progress,
                                cursorSensitivity: 0.3 + Math.random() * 0.3,
                                cursorOffset: { x: 0, y: 0 },
                                leafAnimation: {
                                    bobSpeed: Math.random() * 0.02 + 0.008,
                                    bobAmount: Math.random() * 1.5 + 0.8,
                                    bobPhase: Math.random() * Math.PI * 2,
                                    swaySpeed: Math.random() * 0.06 + 0.04,
                                    swayAmount: Math.random() * 2.5 + 1.5,
                                    swayPhase: Math.random() * Math.PI * 2,
                                    shakeIntensity: Math.random() * 0.8 + 0.5,
                                    shakeSpeed: Math.random() * 0.15 + 0.1
                                }
                            };
                        } else {
                            const canopyProgress = (progress - 0.25) / 0.75;
                            
                            if (canopyProgress > 0.6 && Math.random() < 0.5) {
                                continue;
                            }
                            
                            let layerRadius, yOffset, foliageColor, foliageSize;
                            
                            switch (tree.type) {
                                case 'pine':
                                    layerRadius = (1 - canopyProgress * 0.9) * 120 + 50;
                                    yOffset = canopyProgress * tree.height * 0.5;
                                    foliageColor = `hsl(${95 + Math.random() * 25}, ${65 + Math.random() * 25}%, ${20 + Math.random() * 20}%)`;
                                    foliageSize = Math.random() * 18 + 12;
                                    break;
                                case 'oak':
                                    layerRadius = Math.sin(canopyProgress * Math.PI) * 140 + 60;
                                    yOffset = canopyProgress * tree.height * 0.4;
                                    foliageColor = `hsl(${75 + Math.random() * 45}, ${50 + Math.random() * 35}%, ${25 + Math.random() * 25}%)`;
                                    foliageSize = Math.random() * 20 + 15;
                                    break;
                                case 'willow':
                                    layerRadius = (1 - canopyProgress * 0.2) * 120 + 50;
                                    yOffset = canopyProgress * tree.height * 0.5;
                                    foliageColor = `hsl(${85 + Math.random() * 35}, ${55 + Math.random() * 30}%, ${30 + Math.random() * 25}%)`;
                                    foliageSize = Math.random() * 16 + 12;
                                    break;
                                case 'maple':
                                    layerRadius = Math.sin(canopyProgress * Math.PI) * 100 + 45;
                                    yOffset = canopyProgress * tree.height * 0.45;
                                    foliageColor = `hsl(${Math.random() < 0.3 ? 10 + Math.random() * 30 : 60 + Math.random() * 40}, ${60 + Math.random() * 25}%, ${35 + Math.random() * 20}%)`;
                                    foliageSize = Math.random() * 18 + 14;
                                    break;
                                case 'cedar':
                                    layerRadius = (1 - canopyProgress * 0.8) * 90 + 40;
                                    yOffset = canopyProgress * tree.height * 0.5;
                                    foliageColor = `hsl(${110 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${18 + Math.random() * 15}%)`;
                                    foliageSize = Math.random() * 15 + 12;
                                    break;
                                case 'palm':
                                    layerRadius = canopyProgress > 0.7 ? (1 - (canopyProgress - 0.7) * 2) * 150 + 40 : 30;
                                    yOffset = canopyProgress * tree.height * 0.2;
                                    foliageColor = `hsl(${100 + Math.random() * 30}, ${60 + Math.random() * 25}%, ${30 + Math.random() * 20}%)`;
                                    foliageSize = Math.random() * 22 + 16;
                                    break;
                                default: // birch
                                    layerRadius = (1 - canopyProgress * 0.6) * 90 + 40;
                                    yOffset = canopyProgress * tree.height * 0.4;
                                    foliageColor = `hsl(${65 + Math.random() * 55}, ${50 + Math.random() * 30}%, ${30 + Math.random() * 25}%)`;
                                    foliageSize = Math.random() * 17 + 13;
                            }
                            
                            const clumpSize = 1 + Math.floor(Math.random() * 1);
                            for (let c = 0; c < clumpSize; c++) {
                                const angle = Math.random() * Math.PI * 2;
                                const radius = Math.random() * layerRadius * tree.foliageDensity * 0.6;
                                const clumpOffset = (Math.random() - 0.5) * 15;
                                const leanOffset = tree.lean * (0.25 + canopyProgress * 0.75) * tree.height;
                                
                                particle = {
                                    x: tree.x + Math.cos(angle) * radius + leanOffset + clumpOffset,
                                    y: tree.y - tree.height * 0.25 - yOffset + (Math.random() - 0.5) * 10,
                                    size: foliageSize * (0.8 + Math.random() * 0.4),
                                    baseSize: foliageSize * (0.8 + Math.random() * 0.4),
                                    color: foliageColor,
                                    type: 'foliage',
                                    originalX: tree.x + Math.cos(angle) * radius + leanOffset + clumpOffset,
                                    originalY: tree.y - tree.height * 0.25 - yOffset + (Math.random() - 0.5) * 10,
                                    swayAmount: Math.random() * 3 + 2,
                                    swaySpeed: Math.random() * 0.025 + 0.015,
                                    swayPhase: tree.swayPhase + Math.random() * 1.5,
                                    breatheSpeed: Math.random() * 0.03 + 0.02,
                                    breathePhase: tree.breathePhase + Math.random() * Math.PI,
                                    breatheAmount: 0.4 + Math.random() * 0.5,
                                    windSensitivity: tree.windSensitivity * (1.5 + canopyProgress),
                                    radius: radius,
                                    angle: angle,
                                    cursorSensitivity: 0.6 + Math.random() * 0.5,
                                    cursorOffset: { x: 0, y: 0 },
                                    leafAnimation: {
                                        bobSpeed: Math.random() * 0.08 + 0.05,
                                        bobAmount: Math.random() * 3 + 2,
                                        bobPhase: Math.random() * Math.PI * 2,
                                        swaySpeed: Math.random() * 0.06 + 0.04,
                                        swayAmount: Math.random() * 2.5 + 1.5,
                                        swayPhase: Math.random() * Math.PI * 2,
                                        shakeIntensity: Math.random() * 0.8 + 0.5,
                                        shakeSpeed: Math.random() * 0.15 + 0.1
                                    }
                                };
                                
                                this.particles.push(particle);
                            }
                        }
                        
                        if (particle && progress < 0.25) {
                            this.particles.push(particle);
                        }
                    }
                });
            }
            
            createFallingLeaves(count) {
                for (let i = 0; i < count; i++) {
                    const leafType = Math.random();
                    let color;
                    
                    if (leafType < 0.4) {
                        color = `hsl(${25 + Math.random() * 35}, ${70 + Math.random() * 20}%, ${40 + Math.random() * 30}%)`;
                    } else if (leafType < 0.7) {
                        color = `hsl(${60 + Math.random() * 30}, ${50 + Math.random() * 40}%, ${35 + Math.random() * 25}%)`;
                    } else {
                        color = `hsl(${0 + Math.random() * 20}, ${60 + Math.random() * 30}%, ${45 + Math.random() * 25}%)`;
                    }
                    
                    const baseSize = Math.random() * 10 + 6;
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height - 200,
                        size: baseSize,
                        baseSize: baseSize,
                        color: color,
                        type: 'leaf',
                        originalX: 0,
                        originalY: 0,
                        fallSpeed: Math.random() * 1.5 + 0.5,
                        swaySpeed: Math.random() * 0.025 + 0.01,
                        swayAmount: Math.random() * 30 + 15,
                        rotation: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.1,
                        breatheSpeed: Math.random() * 0.03 + 0.02,
                        breathePhase: Math.random() * Math.PI * 2,
                        breatheAmount: 0.3 + Math.random() * 0.4,
                        windSensitivity: Math.random() * 0.6 + 0.3,
                        swayPhase: Math.random() * Math.PI * 2,
                        cursorSensitivity: 0.8 + Math.random() * 0.5,
                        cursorOffset: { x: 0, y: 0 }
                    };
                    particle.originalX = particle.x;
                    particle.originalY = particle.y;
                    this.particles.push(particle);
                }
            }
            
            createUndergrowth(count) {
                for (let i = 0; i < count; i++) {
                    const baseSize = Math.random() * 8 + 10;
                    
                    const grassHue = 85 + Math.random() * 25;
                    const grassSat = 55 + Math.random() * 15;
                    const grassLight = 25 + Math.random() * 15;
                    
                    const particle = {
                        x: Math.random() * this.canvas.width,
                        y: this.canvas.height - Math.random() * 60,
                        size: baseSize,
                        baseSize: baseSize,
                        color: `hsl(${grassHue}, ${grassSat}%, ${grassLight}%)`,
                        type: 'undergrowth',
                        originalX: 0,
                        originalY: 0,
                        swayAmount: Math.random() * 2 + 1,
                        swaySpeed: Math.random() * 0.025 + 0.01,
                        swayPhase: Math.random() * Math.PI * 2,
                        breatheSpeed: Math.random() * 0.025 + 0.015,
                        breathePhase: Math.random() * Math.PI * 2,
                        breatheAmount: 0.4 + Math.random() * 0.5,
                        windSensitivity: Math.random() * 1 + 0.6,
                        cursorSensitivity: 0.6 + Math.random() * 0.4,
                        cursorOffset: { x: 0, y: 0 },
                        leafAnimation: {
                            bobSpeed: Math.random() * 0.025 + 0.008,
                            bobAmount: Math.random() * 1 + 0.5,
                            bobPhase: Math.random() * Math.PI * 2,
                            swaySpeed: Math.random() * 0.06 + 0.04,
                            swayAmount: Math.random() * 2.5 + 1.5,
                            swayPhase: Math.random() * Math.PI * 2,
                            shakeIntensity: Math.random() * 0.8 + 0.5,
                            shakeSpeed: Math.random() * 0.15 + 0.1
                        }
                    };
                    particle.originalX = particle.x;
                    particle.originalY = particle.y;
                    this.particles.push(particle);
                }
            }
            
            animate() {
                this.animationId = requestAnimationFrame(() => this.animate());
                
                this.time += 0.016;
                
                // Dynamic wind simulation
                this.windDirection = Math.sin(this.time * 0.01) * 0.5 + Math.sin(this.time * 0.003) * 0.3;
                this.windStrength = (Math.sin(this.time * 0.008) + 1) * 0.5 + 0.3;
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Draw single bright sun
                this.drawSun();
                
                this.animateParticles();
                this.animateAnimals();
                this.drawParticles();
                this.drawAnimals();
            }
            
            drawSun() {
                this.ctx.save();
                
                // Animate sun pulsing
                this.sun.pulsePhase += this.sun.pulseSpeed;
                this.sun.size = this.sun.baseSize * (1 + Math.sin(this.sun.pulsePhase) * 0.1);
                
                // Create intense glow effect
                const glowSize = this.sun.size * 4;
                const gradient = this.ctx.createRadialGradient(
                    this.sun.x, this.sun.y, 0,
                    this.sun.x, this.sun.y, glowSize
                );
                gradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
                gradient.addColorStop(0.2, 'rgba(255, 215, 0, 0.8)');
                gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.4)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                // Draw outer glow
                this.ctx.globalCompositeOperation = 'screen';
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(this.sun.x, this.sun.y, glowSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Draw bright core
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.globalAlpha = 1;
                this.ctx.fillStyle = this.sun.color;
                this.ctx.beginPath();
                this.ctx.arc(this.sun.x, this.sun.y, this.sun.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Add bright white center
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.beginPath();
                this.ctx.arc(this.sun.x, this.sun.y, this.sun.size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
            
            animateParticles() {
                this.particles.forEach(particle => {
                    // Apply breathing/growing effect to all particles
                    const breathe = Math.sin(this.time * particle.breatheSpeed + particle.breathePhase) * particle.breatheAmount;
                    particle.size = particle.baseSize * (1 + breathe);
                    
                    // Wind effect for all particles
                    const windEffect = this.windStrength * particle.windSensitivity;
                    const windSway = Math.sin(this.time * 0.02 + particle.swayPhase) * windEffect;
                    
                    // Smooth cursor interaction for all particles
                    const dx = this.mouseRef.current.x - particle.x;
                    const dy = this.mouseRef.current.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDistance = 150;
                    
                    // Smooth cursor offset animation
                    if (distance < maxDistance) {
                        const force = (1 - distance / maxDistance) * particle.cursorSensitivity;
                        const targetOffsetX = -dx / distance * force * 15;
                        const targetOffsetY = -dy / distance * force * 15;
                        
                        particle.cursorOffset.x += (targetOffsetX - particle.cursorOffset.x) * 0.1;
                        particle.cursorOffset.y += (targetOffsetY - particle.cursorOffset.y) * 0.1;
                    } else {
                        particle.cursorOffset.x *= 0.95;
                        particle.cursorOffset.y *= 0.95;
                    }
                    
                    switch (particle.type) {
                        case 'trunk':
                            const trunkWind = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount;
                            const heightMultiplier = particle.height * 2;
                            
                            const leafBob = Math.sin(this.time * particle.leafAnimation.bobSpeed + particle.leafAnimation.bobPhase) * particle.leafAnimation.bobAmount;
                            
                            particle.x = particle.originalX + (trunkWind + windSway * heightMultiplier) * this.windDirection + particle.cursorOffset.x;
                            particle.y = particle.originalY + leafBob * 0.3 + particle.cursorOffset.y * 0.3;
                            break;
                            
                        case 'foliage':
                            const foliageWind = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount;
                            const foliageWindEffect = windSway * 3;
                            
                            const shakeX = Math.sin(this.time * particle.leafAnimation.shakeSpeed + particle.leafAnimation.bobPhase) * 
                                          particle.leafAnimation.shakeIntensity * windEffect;
                            const shakeY = Math.cos(this.time * particle.leafAnimation.shakeSpeed * 1.3 + particle.leafAnimation.swayPhase) * 
                                          particle.leafAnimation.shakeIntensity * windEffect * 0.5;
                            
                            const microShakeX = Math.sin(this.time * particle.leafAnimation.shakeSpeed * 3) * windEffect * 0.5;
                            const microShakeY = Math.cos(this.time * particle.leafAnimation.shakeSpeed * 2.7) * windEffect * 0.3;
                            
                            const leafBobFoliage = Math.sin(this.time * particle.leafAnimation.bobSpeed + particle.leafAnimation.bobPhase) * particle.leafAnimation.bobAmount;
                            const leafSway = Math.cos(this.time * particle.leafAnimation.swaySpeed + particle.leafAnimation.swayPhase) * particle.leafAnimation.swayAmount;
                            
                            particle.x = particle.originalX + 
                                        (foliageWind + foliageWindEffect + leafSway + shakeX + microShakeX) * this.windDirection + 
                                        particle.cursorOffset.x;
                            particle.y = particle.originalY + 
                                        leafBobFoliage + shakeY + microShakeY +
                                        Math.sin(this.time * 0.02 + particle.swayPhase) * windEffect * 0.8 + 
                                        particle.cursorOffset.y * 0.7;
                            break;
                            
                        case 'leaf':
                            const windGust = Math.sin(this.time * 0.03 + particle.swayPhase) * windEffect * 3;
                            const windTurbulence = Math.sin(this.time * 0.05 + particle.x * 0.01) * windEffect * 2;
                            
                            particle.y += particle.fallSpeed + Math.sin(this.time * 0.02) * 0.5;
                            particle.x += windGust * this.windDirection + windTurbulence + particle.cursorOffset.x;
                            particle.rotation += particle.rotationSpeed + windEffect * 0.05;
                            
                            const leafSway2 = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount * windEffect;
                            particle.x += leafSway2 * this.windDirection;
                            particle.y += particle.cursorOffset.y;
                            
                            if (particle.y > this.canvas.height + 50) {
                                particle.y = -50;
                                particle.x = Math.random() * this.canvas.width;
                            }
                            if (particle.x < -100) particle.x = this.canvas.width + 100;
                            if (particle.x > this.canvas.width + 100) particle.x = -100;
                            break;
                            
                        case 'undergrowth':
                            const grassWind = Math.sin(this.time * particle.swaySpeed + particle.swayPhase) * particle.swayAmount;
                            const grassWindEffect = windSway * 2;
                            const grassTurbulence = Math.sin(this.time * 0.04 + particle.x * 0.02) * windEffect;
                            
                            const grassShakeX = Math.sin(this.time * particle.leafAnimation.shakeSpeed + particle.leafAnimation.bobPhase) * 
                                              particle.leafAnimation.shakeIntensity * windEffect;
                            const grassShakeY = Math.cos(this.time * particle.leafAnimation.shakeSpeed * 1.3 + particle.leafAnimation.swayPhase) * 
                                              particle.leafAnimation.shakeIntensity * windEffect * 0.3;
                            
                            const grassLeafBob = Math.sin(this.time * particle.leafAnimation.bobSpeed + particle.leafAnimation.bobPhase) * particle.leafAnimation.bobAmount;
                            const grassLeafSway = Math.cos(this.time * particle.leafAnimation.swaySpeed + particle.leafAnimation.swayPhase) * particle.leafAnimation.swayAmount;
                            
                            particle.x = particle.originalX + (grassWind + grassWindEffect + grassTurbulence + grassLeafSway + grassShakeX) * this.windDirection + particle.cursorOffset.x;
                            particle.y = particle.originalY + grassLeafBob + grassShakeY + Math.sin(this.time * particle.swaySpeed * 2 + particle.swayPhase) * windEffect * 0.5 + particle.cursorOffset.y * 0.2;
                            break;
                    }
                });
            }
            
            animateAnimals() {
                this.animals.forEach(animal => {
                    animal.breathePhase += 0.02;
                    
                    animal.idleTimer += 0.016;
                    
                    if (animal.idleTimer > animal.idleDuration) {
                        animal.idleTimer = 0;
                        animal.isWalking = !animal.isWalking;
                        animal.idleDuration = animal.isWalking ? 2 + Math.random() * 3 : 1.5 + Math.random() * 2.5;
                        
                        if (animal.isWalking) {
                            animal.wanderTarget.x = Math.random() * this.canvas.width;
                            animal.wanderTarget.y = animal.y + (Math.random() - 0.5) * 20;
                            animal.wanderTarget.y = Math.max(this.canvas.height - 80, Math.min(this.canvas.height - 50, animal.wanderTarget.y));
                        }
                    }
                    
                    if (animal.isWalking) {
                        const dx = animal.wanderTarget.x - animal.x;
                        const dy = animal.wanderTarget.y - animal.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance > 10) {
                            const speed = animal.type === 'pig' ? 0.3 : 0.2;
                            animal.vx = (dx / distance) * speed;
                            animal.vy = (dy / distance) * speed * 0.1;
                            
                            animal.direction = animal.vx > 0 ? -1 : 1;
                        } else {
                            animal.vx *= 0.9;
                            animal.vy *= 0.9;
                        }
                        
                        animal.x += animal.vx;
                        animal.y += animal.vy;
                        
                        animal.animPhase += 0.05;
                    } else {
                        animal.vx *= 0.8;
                        animal.vy *= 0.8;
                    }
                    
                    animal.x = Math.max(50, Math.min(this.canvas.width - 50, animal.x));
                    animal.y = Math.max(this.canvas.height - 80, Math.min(this.canvas.height - 50, animal.y));
                    
                    animal.parts.forEach(part => {
                        part.animPhase += part.animSpeed;
                        
                        const breathe = Math.sin(animal.breathePhase + part.animPhase) * part.breatheAmount;
                        part.size = part.baseSize * (1 + breathe);
                        
                        if ((part.type === 'leg' || part.type === 'hoof') && animal.isWalking) {
                            const walkBob = Math.sin(animal.animPhase * 2 + part.animPhase) * Math.abs(animal.vx) * 10;
                            part.y = part.originalY + walkBob;
                        } else if (part.type === 'leg' || part.type === 'hoof') {
                            part.y += (part.originalY - part.y) * 0.1;
                        }
                        
                        if (part.type === 'tail' || part.type === 'tail_tip') {
                            const tailWag = Math.sin(animal.animPhase * (animal.isWalking ? 3 : 1.5)) * (animal.isWalking ? 5 : 2);
                            part.x = part.originalX + tailWag * animal.direction;
                        }
                        
                        if (part.type === 'head' || part.type === 'ear' || part.type === 'eye' || part.type === 'snout' || part.type === 'snout_tip') {
                            const headBob = Math.sin(animal.animPhase * 1.5) * Math.abs(animal.vx) * (animal.isWalking ? 3 : 1);
                            part.y = part.originalY + headBob;
                        }
                    });
                });
            }
            
            drawParticles() {
                this.particles.forEach(particle => {
                    this.ctx.save();
                    
                    if (particle.type === 'leaf') {
                        this.ctx.translate(particle.x, particle.y);
                        this.ctx.rotate(particle.rotation);
                        this.ctx.globalAlpha = 0.6;
                    } else if (particle.type === 'trunk') {
                        this.ctx.globalAlpha = 0.8;
                    } else if (particle.type === 'foliage') {
                        this.ctx.globalAlpha = 0.7;
                    } else {
                        this.ctx.globalAlpha = 0.6;
                    }
                    
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    
                    if (particle.type === 'leaf') {
                        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                    } else {
                        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    }
                    
                    this.ctx.fill();
                    this.ctx.restore();
                });
            }
            
            drawAnimals() {
                this.animals.forEach(animal => {
                    this.ctx.save();
                    this.ctx.translate(animal.x, animal.y);
                    this.ctx.scale(animal.direction * animal.size, animal.size);
                    
                    animal.parts.forEach(part => {
                        this.ctx.save();
                        this.ctx.globalAlpha = 0.9;
                        this.ctx.fillStyle = part.color;
                        this.ctx.beginPath();
                        this.ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.restore();
                    });
                    
                    this.ctx.restore();
                });
            }
            
            onWindowResize() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                
                // Update sun position
                if (this.sun) {
                    this.sun.x = this.canvas.width * 0.85;
                    this.sun.y = this.canvas.height * 0.15;
                }
            }
        }

        forestInstanceRef.current = new Dense2DParticleForest(canvasRef.current, mouseRef);

        return () => {
            if (forestInstanceRef.current && forestInstanceRef.current.animationId) {
                cancelAnimationFrame(forestInstanceRef.current.animationId);
            }
            window.removeEventListener('resize', forestInstanceRef.current?.onWindowResize);
        };
    }, []);

    const handleMouseMove = (e) => {
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    return (
        <div 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, #87CEEB 0%, #87CEEB 60%, #98FB98 100%)',
                cursor: 'none',
                overflow: 'hidden'
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
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block'
                }}
            />
        </div>
    );
};

export default ForestBiome;