import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Lightbulb, 
  Sparkles,
  Gamepad2,
  Mail,
  Lock,
  Clock,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoyalPalaceBDProps {
  currentUser?: any;
  t?: any;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

export const RoyalPalaceBD: React.FC<RoyalPalaceBDProps> = ({ 
  currentUser, 
  t, 
  onProfileClick,
  onLogout 
}) => {
  // Navigation / Interface states
  // 'dashboard' | 'clockInterface' | 'gamesDashboard' | 'fullscreenGameZone'
  const [activeInterface, setActiveInterface] = useState<'dashboard' | 'clockInterface' | 'gamesDashboard' | 'fullscreenGameZone'>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<'bearGame' | 'tentacle' | 'heart' | null>(null);

  // Clock variables
  const [currentTime, setCurrentTime] = useState(new Date());

  // Impossible bear variables (Plabon Trusted Shop Edition)
  const [isLightOn, setIsLightOn] = useState(false);
  const [pullCount, setPullCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBearHouseOpen, setIsBearHouseOpen] = useState(false);
  const [isBearShowHead, setIsBearShowHead] = useState(false);
  const [isBearAngry, setIsBearAngry] = useState(false);
  const [isBearReach, setIsBearReach] = useState(false);

  const bearTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // References for canvases
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gamePlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spiderClockCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ropeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physics rope state references
  const ropePhysRef = useRef({
    ropeLength: 210,
    ropeX: 50,
    ropeY: 0,
    currentX: 50,
    targetX: 50
  });

  // Animation frame IDs for cleanup
  const matrixIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameAnimationIdRef = useRef<number | null>(null);
  const clockAnimationFrameRef = useRef<number | null>(null);
  const ropeAnimationIdRef = useRef<number | null>(null);

  // Menu Toggle handler
  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  // Click outside to close dropdown menu effect
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const menu = document.getElementById('dropdownMenu');
      const menuBtn = document.getElementById('menuBtn');
      if (menu && menuBtn && !menu.contains(event.target as Node) && !menuBtn.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Update Spider Clock time every second (backup clock sync)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeInterface === 'clockInterface') {
      timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeInterface]);

  // Interactive Spider Clock animation loop
  useEffect(() => {
    if (activeInterface === 'clockInterface' && spiderClockCanvasRef.current) {
      const canvas = spiderClockCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const handleResize = () => {
        if (spiderClockCanvasRef.current) {
          const rect = spiderClockCanvasRef.current.parentElement?.getBoundingClientRect();
          spiderClockCanvasRef.current.width = rect?.width || 450;
          spiderClockCanvasRef.current.height = rect?.height || 450;
        }
      };
      
      handleResize();
      window.addEventListener('resize', handleResize);

      const drawSpiderLogo = (cx: number, cy: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';

        // Spider body part 1 & 2
        ctx.beginPath();
        ctx.ellipse(0, -5, 8, 12, 0, 0, Math.PI * 2); // head
        ctx.ellipse(0, 12, 12, 16, 0, 0, Math.PI * 2); // belly
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#050505';
        ctx.beginPath();
        ctx.arc(-3, -8, 2, 0, Math.PI * 2);
        ctx.arc(3, -8, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      const drawSpiderHand = (cx: number, cy: number, angle: number, length: number, jointsCount: number, color: string, width: number, isSecondHand: boolean) => {
        let points = [{ x: cx, y: cy }];
        const jointLength = length / jointsCount;
        let currentAngle = angle;

        if (isSecondHand) {
          const sec = new Date().getSeconds();
          if (sec > 0 && sec < 30) {
            currentAngle += Math.sin(angle * 2) * 0.2; 
          } else {
            currentAngle -= Math.cos(angle * 2) * 0.1;
          }
        }

        for (let i = 1; i <= jointsCount; i++) {
          const t = i / jointsCount;
          // Bend current angle with joint index logic making it uniquely organic and jointed
          const jointAngle = currentAngle + Math.sin(t * Math.PI) * 0.45 + Math.sin(Date.now() * 0.003 + t * 4) * 0.03;
          const x = points[i - 1].x + Math.cos(jointAngle) * jointLength;
          const y = points[i - 1].y + Math.sin(jointAngle) * jointLength;
          points.push({ x, y });
        }

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(points[points.length - 1].x, points[points.length - 1].y, width + 1, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      };

      const drawWebGears = (cx: number, cy: number, radius: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        const time = Date.now() * 0.0005;
        ctx.rotate(time);

        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, radius - 50, 0, Math.PI * 2);
          ctx.stroke();
          ctx.rotate(Math.PI / 6);
        }
        ctx.restore();
      };

      const updateClock = () => {
        if (!spiderClockCanvasRef.current) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = Math.min(cx, cy) - 40;

        // Draw rotating background Web Gears
        drawWebGears(cx, cy, radius);

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        const secAngle = ((seconds + milliseconds / 1000) * 6 - 90) * (Math.PI / 180);
        const minAngle = ((minutes * 6 + seconds * 0.1) - 90) * (Math.PI / 180);
        const hourAngle = (((hours % 12) * 30 + minutes * 0.5) - 90) * (Math.PI / 180);

        // 1. Hour Leg (4 joints, white)
        drawSpiderHand(cx, cy, hourAngle, radius * 0.55, 4, 'rgba(255, 255, 255, 0.9)', 5, false);

        // 2. Minute Leg (5 joints, white-opaque)
        drawSpiderHand(cx, cy, minAngle, radius * 0.8, 5, 'rgba(255, 255, 255, 0.7)', 3.5, false);

        // 3. Second Leg (6 joints, red, with wave trigger)
        drawSpiderHand(cx, cy, secAngle, radius * 0.95, 6, '#ff2424', 2, true);

        // Web brand/spider logo in center
        drawSpiderLogo(cx, cy);

        clockAnimationFrameRef.current = requestAnimationFrame(updateClock);
      };

      updateClock();

      return () => {
        window.removeEventListener('resize', handleResize);
        if (clockAnimationFrameRef.current) cancelAnimationFrame(clockAnimationFrameRef.current);
      };
    }
  }, [activeInterface]);

  // Matrix Background Loop inside Games Dashboard
  useEffect(() => {
    if (activeInterface === 'gamesDashboard' && matrixCanvasRef.current) {
      const canvas = matrixCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle responsive sizes
      const handleResize = () => {
        if (matrixCanvasRef.current) {
          matrixCanvasRef.current.width = matrixCanvasRef.current.parentElement?.clientWidth || window.innerWidth;
          matrixCanvasRef.current.height = matrixCanvasRef.current.parentElement?.clientHeight || window.innerHeight;
        }
      };
      
      handleResize();
      window.addEventListener('resize', handleResize);

      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
      const alphabet = characters.split("");
      const fontSize = 16;
      let columns = canvas.width / fontSize;
      let rainDrops: number[] = [];

      const initDrops = () => {
        columns = canvas.width / fontSize;
        rainDrops = [];
        for (let x = 0; x < columns; x++) {
          rainDrops[x] = 1;
        }
      };
      initDrops();

      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);

      matrixIntervalRef.current = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#10b981';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
          const text = alphabet[Math.floor(Math.random() * alphabet.length)];
          ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

          if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
          }
          rainDrops[i]++;
        }
      }, 30);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
      };
    }
  }, [activeInterface]);

  // Flexible rope physics animation loop for Plabon Trusted Shop
  useEffect(() => {
    if (activeInterface === 'fullscreenGameZone' && activeGame === 'bearGame' && ropeCanvasRef.current) {
      const canvas = ropeCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = 2; // Fixed crisp clear coordinate scale
      canvas.width = 100 * scale;
      canvas.height = 250 * scale;
      ctx.scale(scale, scale);

      const phys = ropePhysRef.current;
      phys.currentX = 50;
      phys.targetX = 50;

      const drawRopeLoop = () => {
        if (!ropeCanvasRef.current || !ctx) return;
        ctx.clearRect(0, 0, 100, 250);
        ctx.beginPath();
        ctx.moveTo(phys.ropeX, phys.ropeY);
        
        // Realistic quad bezier curve curve
        ctx.quadraticCurveTo(phys.currentX, phys.ropeLength / 2, 50, phys.ropeLength);
        
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 3;
        ctx.stroke();

        phys.currentX += (phys.targetX - phys.currentX) * 0.1;

        // Position the handle to align dynamically with rope length
        const handleEl = document.getElementById('pullHandle');
        if (handleEl) {
          handleEl.style.top = `${phys.ropeLength}px`;
        }

        ropeAnimationIdRef.current = requestAnimationFrame(drawRopeLoop);
      };

      drawRopeLoop();

      return () => {
        if (ropeAnimationIdRef.current) {
          cancelAnimationFrame(ropeAnimationIdRef.current);
          ropeAnimationIdRef.current = null;
        }
      };
    }
  }, [activeInterface, activeGame]);

  // Canvas Games Control
  useEffect(() => {
    if (activeInterface === 'fullscreenGameZone' && activeGame && activeGame !== 'bearGame' && gamePlayCanvasRef.current) {
      const canvas = gamePlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const handleResize = () => {
        if (gamePlayCanvasRef.current) {
          gamePlayCanvasRef.current.width = gamePlayCanvasRef.current.parentElement?.clientWidth || window.innerWidth;
          gamePlayCanvasRef.current.height = gamePlayCanvasRef.current.parentElement?.clientHeight || window.innerHeight;
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      let mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        targetX: canvas.width / 2,
        targetY: canvas.height / 2
      };
      let mouseListener = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
        if (activeGame !== 'tentacle') {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        }
      };
      let touchListener = (e: TouchEvent) => {
        if (e.touches[0]) {
          const rect = canvas.getBoundingClientRect();
          mouse.targetX = e.touches[0].clientX - rect.left;
          mouse.targetY = e.touches[0].clientY - rect.top;
          if (activeGame !== 'tentacle') {
            mouse.x = mouse.targetX;
            mouse.y = mouse.targetY;
          }
        }
      };

      canvas.addEventListener('mousemove', mouseListener);
      canvas.addEventListener('touchmove', touchListener);

      if (activeGame === 'tentacle') {
        class Particle {
          x: number;
          y: number;
          size: number;
          speedX: number;
          speedY: number;
          alpha: number;
          decay: number;

          constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.alpha = 1;
            this.decay = 0.015;
          }

          update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= this.decay;
          }

          draw() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#00a2ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        const particlesArray: Particle[] = [];
        const numTentacles = 25;
        const tentacleLength = 15;

        let tentacles: { x: number; y: number }[][] = [];
        for (let i = 0; i < numTentacles; i++) {
          let points: { x: number; y: number }[] = [];
          for (let j = 0; j < tentacleLength; j++) {
            points.push({ x: mouse.x, y: mouse.y });
          }
          tentacles.push(points);
        }

        const animateTentacle = () => {
          if (!ctx) return;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          mouse.x += (mouse.targetX - mouse.x) * 0.15;
          mouse.y += (mouse.targetY - mouse.y) * 0.15;

          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
          ctx.fillStyle = '#00c3ff';
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#00a2ff';
          ctx.fill();
          ctx.shadowBlur = 0;

          tentacles.forEach((points, index) => {
            let head = points[0];
            let angleOffset = (Math.PI * 2 / numTentacles) * index;
            let time = Date.now() * 0.005;

            head.x = mouse.x + Math.cos(time + angleOffset) * 5;
            head.y = mouse.y + Math.sin(time + angleOffset) * 5;

            for (let j = 1; j < points.length; j++) {
              let p1 = points[j - 1];
              let p2 = points[j];

              let dx = p1.x - p2.x;
              let dy = p1.y - p2.y;
              let distance = Math.sqrt(dx * dx + dy * dy);
              let targetDist = 12;

              if (distance > targetDist) {
                let missing = distance - targetDist;
                p2.x += (dx / distance) * missing * 0.5;
                p2.y += (dy / distance) * missing * 0.5;
              }
            }

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let j = 1; j < points.length; j++) {
              ctx.lineTo(points[j].x, points[j].y);
            }
            ctx.strokeStyle = `rgba(0, 162, 255, ${1 - (index % 5) * 0.15})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            let tail = points[points.length - 1];
            if (Math.random() > 0.7) {
              particlesArray.push(new Particle(tail.x, tail.y));
            }
          });

          for (let i = particlesArray.length - 1; i >= 0; i--) {
            particlesArray[i].update();
            particlesArray[i].draw();
            if (particlesArray[i].alpha <= 0) {
              particlesArray.splice(i, 1);
            }
          }

          gameAnimationIdRef.current = requestAnimationFrame(animateTentacle);
        };
        animateTentacle();

      } else if (activeGame === 'heart') {
        let particles: any[] = [];

        class HeartParticle {
          x: number; y: number; tx: number; ty: number;
          speed: number; color: string; size: number;
          constructor(x: number, y: number, tx: number, ty: number) {
            this.x = x; this.y = y; this.tx = tx; this.ty = ty;
            this.speed = Math.random() * 0.06 + 0.02;
            this.color = `hsl(${Math.random() * 25 + 345}, 100%, 60%)`;
            this.size = Math.random() * 2.5 + 1;
          }
          update() {
            this.x += (this.tx - this.x) * this.speed;
            this.y += (this.ty - this.y) * this.speed;
          }
          draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
          }
        }

        const getHeartCoords = (t: number) => {
          let x = 16 * Math.pow(Math.sin(t), 3);
          let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
          return { x: x * 11, y: -y * 11 };
        };

        const createHeartAt = (cx: number, cy: number) => {
          for (let i = 0; i < Math.PI * 2; i += 0.06) {
            let pos = getHeartCoords(i);
            let startX = Math.random() * canvas.width;
            let startY = Math.random() * canvas.height;
            particles.push(new HeartParticle(startX, startY, cx + pos.x, cy + pos.y));
          }
        };

        // Create initial center heart
        createHeartAt(canvas.width / 2, canvas.height / 2);

        const clickListener = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          createHeartAt(e.clientX - rect.left, e.clientY - rect.top);
        };

        const touchStartListener = (e: TouchEvent) => {
          if (e.touches[0]) {
            const rect = canvas.getBoundingClientRect();
            createHeartAt(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
          }
        };

        canvas.addEventListener('click', clickListener);
        canvas.addEventListener('touchstart', touchStartListener);

        const animateHeart = () => {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          particles.forEach(p => { p.update(); p.draw(); });
          if (particles.length > 700) {
            particles.splice(0, 100);
          }

          gameAnimationIdRef.current = requestAnimationFrame(animateHeart);
        };
        animateHeart();

        return () => {
          window.removeEventListener('resize', handleResize);
          canvas.removeEventListener('mousemove', mouseListener);
          canvas.removeEventListener('touchmove', touchListener);
          canvas.removeEventListener('click', clickListener);
          canvas.removeEventListener('touchstart', touchStartListener);
          if (gameAnimationIdRef.current) cancelAnimationFrame(gameAnimationIdRef.current);
        };
      }

      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.removeEventListener('mousemove', mouseListener);
        canvas.removeEventListener('touchmove', touchListener);
        if (gameAnimationIdRef.current) cancelAnimationFrame(gameAnimationIdRef.current);
      };
    }
  }, [activeInterface, activeGame]);

  // Stop all animations when transitioning or backing
  const stopAllAnimations = () => {
    if (gameAnimationIdRef.current) {
      cancelAnimationFrame(gameAnimationIdRef.current);
      gameAnimationIdRef.current = null;
    }
    if (clockAnimationFrameRef.current) {
      cancelAnimationFrame(clockAnimationFrameRef.current);
      clockAnimationFrameRef.current = null;
    }
    if (matrixIntervalRef.current) {
      clearInterval(matrixIntervalRef.current);
      matrixIntervalRef.current = null;
    }
    if (ropeAnimationIdRef.current) {
      cancelAnimationFrame(ropeAnimationIdRef.current);
      ropeAnimationIdRef.current = null;
    }
    
    // Clear all bear timeouts
    bearTimeoutsRef.current.forEach(clearTimeout);
    bearTimeoutsRef.current = [];

    // Reset impossible bear light states
    setIsLightOn(false);
    setPullCount(0);
    setIsAnimating(false);
    setIsBearHouseOpen(false);
    setIsBearShowHead(false);
    setIsBearAngry(false);
    setIsBearReach(false);
  };

  const handleOpenInterface = (id: 'dashboard' | 'clockInterface' | 'gamesDashboard' | 'fullscreenGameZone') => {
    stopAllAnimations();
    setActiveInterface(id);
    setIsMenuOpen(false);
  };

  const handleGoHome = () => {
    stopAllAnimations();
    setActiveInterface('dashboard');
  };

  const handleStartFullscreenGame = (gameType: 'bearGame' | 'tentacle' | 'heart') => {
    stopAllAnimations();
    setActiveInterface('fullscreenGameZone');
    setActiveGame(gameType);
  };

  const handleExitFullscreenGame = () => {
    stopAllAnimations();
    setActiveInterface('gamesDashboard');
    setActiveGame(null);
  };

  // Shuts off light and triggers string snapping jerk
  const turnOffLight = () => {
    setIsLightOn(false);
    ropePhysRef.current.targetX = 80;
    const t = setTimeout(() => {
      ropePhysRef.current.targetX = 50;
    }, 150);
    bearTimeoutsRef.current.push(t);
  };

  // Triggers modern bear sequence action
  const triggerBearAction = (currentPullCount: number) => {
    setIsAnimating(true);

    // 1. Open Bear door
    const t1 = setTimeout(() => {
      setIsBearHouseOpen(true);

      // 2. Head up or Reach arm
      const t2 = setTimeout(() => {
        if (currentPullCount % 3 === 0) {
          // *** Special Action: Angry face pops up ***
          setIsBearShowHead(true);
          setIsBearAngry(true);

          // Stare down furiously
          const t3 = setTimeout(() => {
            setIsBearReach(true);

            // Shuts off light and retreats
            const t4 = setTimeout(() => {
              turnOffLight();
              setIsBearReach(false);
              setIsBearShowHead(false);

              // Close house doors & reset anger
              const t5 = setTimeout(() => {
                setIsBearHouseOpen(false);
                setIsBearAngry(false);
                setIsAnimating(false);
              }, 400);
              bearTimeoutsRef.current.push(t5);

            }, 600);
            bearTimeoutsRef.current.push(t4);

          }, 1200);
          bearTimeoutsRef.current.push(t3);

        } else {
          // *** Normal Action: Fast swat ***
          setIsBearReach(true);

          const t3 = setTimeout(() => {
            turnOffLight();
            setIsBearReach(false);

            const t4 = setTimeout(() => {
              setIsBearHouseOpen(false);
              setIsAnimating(false);
            }, 300);
            bearTimeoutsRef.current.push(t4);

          }, 500);
          bearTimeoutsRef.current.push(t3);
        }

      }, 300);
      bearTimeoutsRef.current.push(t2);

    }, 400);
    bearTimeoutsRef.current.push(t1);
  };

  // Trigger switch drawstring interaction
  const handleFixtureMouseDownOrTouchStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimating) return;

    // String flex bend direction
    ropePhysRef.current.targetX = 20;

    const nextLightState = !isLightOn;
    setIsLightOn(nextLightState);

    if (nextLightState) {
      setPullCount(prev => {
        const nextPullCount = prev + 1;
        triggerBearAction(nextPullCount);
        return nextPullCount;
      });
    }
  };

  const handleFixtureMouseUpOrTouchEnd = () => {
    ropePhysRef.current.targetX = 50;
  };

  // Clock angle logic values
  const nowSecs = currentTime.getSeconds();
  const nowMins = currentTime.getMinutes();
  const nowHours = currentTime.getHours();

  const secDeg = nowSecs * 6;
  const minDeg = nowMins * 6 + nowSecs * 0.1;
  const hourDeg = nowHours * 30 + nowMins * 0.5;

  return (
    <div className="bg-[#0f172a] text-[#f8fafc] w-full min-h-[500px] flex flex-col relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl font-sans select-none">
      
      {/* 1. Main Dashboard Interface */}
      {activeInterface === 'dashboard' && (
        <div id="mainDashboard" className="app-interface active-interface flex-1 flex flex-col">
          <header className="main-header flex justify-between items-center bg-[#1e293b] p-4 border-b border-[#334155]">
            <div className="header-left flex items-center gap-4">
              <div 
                className="menu-dots flex flex-col gap-1 cursor-pointer z-[1000]" 
                id="menuBtn" 
                onClick={handleToggleMenu}
              >
                <div className="line w-[22px] h-[3px] bg-[#f8fafc] rounded-[2px]" />
                <div className="line w-[22px] h-[3px] bg-[#f8fafc] rounded-[2px]" />
                <div className="line w-[22px] h-[3px] bg-[#f8fafc] rounded-[2px]" />
              </div>
              <h1 className="brand-title text-[1.2rem] font-bold text-[#38bdf8]">Royal Palace BD</h1>
            </div>
          </header>

          {/* Brand Dropdown Menu */}
          <div 
            id="dropdownMenu" 
            className={`dropdown-menu absolute top-[60px] left-[20px] w-[250px] bg-[#1e293b] border border-[#334155] rounded-lg p-2.5 flex-col gap-2 z-[100] shadow-2xl transition duration-150 ${isMenuOpen ? 'flex' : 'hidden'}`}
          >
            <div className="menu-item disabled-item flex items-center p-3 bg-[#0f172a] rounded-md opacity-50 cursor-default">
              <div className="item-left flex items-center gap-3">
                <Mail size={16} />
                <span className="text-xs font-mono">{currentUser?.email || 'user@email.com'}</span>
              </div>
            </div>
            
            <div className="menu-item disabled-item flex items-center p-3 bg-[#0f172a] rounded-md opacity-50 cursor-default">
              <div className="item-left flex items-center gap-3">
                <span className="danger-icon text-red-500 font-bold">⚠️</span>
                <span className="text-xs">Privacy Policy</span>
              </div>
            </div>

            <div 
              className="menu-item flex items-center p-3 bg-[#0f172a] rounded-md cursor-pointer hover:bg-[#334155] transition text-sm text-[#f8fafc]"
              onClick={() => handleOpenInterface('clockInterface')}
            >
              <div className="item-left flex items-center gap-3">
                <Clock size={16} className="text-[#38bdf8]" />
                <span>Clock</span>
              </div>
            </div>

            <div 
              className="menu-item flex items-center p-3 bg-[#0f172a] rounded-md cursor-pointer hover:bg-[#334155] transition text-sm text-[#f8fafc]"
              onClick={() => handleOpenInterface('gamesDashboard')}
            >
              <div className="item-left flex items-center gap-3">
                <Gamepad2 size={16} className="text-green-450" />
                <span>Games & Magic</span>
              </div>
            </div>
          </div>

          <main className="content-area flex-grow flex items-center justify-center p-5 select-none">
            <div className="text-center">
              <p className="text-[#64748b] text-sm py-8 font-medium">মূল ড্যাশবোর্ড কন্টেন্ট এখানে থাকবে</p>
              
              <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-2xl max-w-sm mx-auto shadow-md">
                <Sparkles className="mx-auto text-[#38bdf8] mb-2" size={24} />
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest mb-1.5">আপনার স্বাগতম</h4>
                <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                  রয়াল প্যালেস বিডি অ্যাপ্লিকেশনে যোগ দেওয়ার জন্য আপনাকে ধন্যবাদ। ফিচার তালিকা দেখতে উপরের বাম দিকের মেনুবার ক্লিক করুন।
                </p>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* 2. Clock Interface Cover */}
      {activeInterface === 'clockInterface' && (
        <div id="clockInterface" className="app-interface flex-1 flex flex-col p-5 bg-[#0f172a]">
          <button className="back-btn text-xs font-bold leading-none flex items-center gap-1.5 self-start bg-[#1e293b] border border-[#334155] p-2 px-4 rounded-md text-slate-200 hover:bg-[#334155]" onClick={handleGoHome}>
            <ArrowLeft size={14} /> Home
          </button>
          
          <div className="clock-container flex-grow flex flex-col justify-center items-center py-6">
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] flex justify-center items-center bg-transparent">
              
              {/* Clock Outer Dial */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/5 pointer-events-none" />

              {/* Dial number markings */}
              {Array.from({ length: 12 }, (_, idx) => {
                const i = idx + 1;
                const angle = (i * 30 - 90) * (Math.PI / 180);
                return (
                  <div 
                    key={i} 
                    className="absolute font-bold text-white/30 hover:text-white/60 drop-shadow-md select-none transform -translate-x-1/2 -translate-y-1/2 pointer-events-none font-mono text-xl md:text-2xl transition duration-150"
                    style={{ 
                      left: `calc(50% + ${Math.cos(angle) * 115}px)`, 
                      top: `calc(50% + ${Math.sin(angle) * 115}px)` 
                    }}
                  >
                    {i}
                  </div>
                );
              })}

              <canvas ref={spiderClockCanvasRef} id="spiderClockCanvas" className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none" />
            </div>
            
            <div className="location-text mt-8 text-[#38bdf8] font-bold text-sm tracking-wide">
              লোকেশন: ঢাকা, বাংলাদেশ (GMT+6)
            </div>
          </div>
        </div>
      )}

      {/* 3. Games Dashboard (Matrix rain live coding list) */}
      {activeInterface === 'gamesDashboard' && (
        <div id="gamesDashboard" className="app-interface flex-grow flex relative h-full min-h-[450px]">
          <canvas ref={matrixCanvasRef} id="matrixCanvas" className="absolute inset-0 w-full h-full object-cover z-1" />
          
          <button className="back-btn absolute-back absolute top-[10px] right-[20px] z-50 text-xs font-bold bg-[#1e293b] border border-[#334155] p-2 px-4 rounded-md text-slate-200 hover:bg-[#334155]" onClick={handleGoHome}>
            <ArrowLeft size={14} /> Home
          </button>
          
          <div className="sidebar-menu z-10 w-[260px] h-full bg-slate-950/80 backdrop-blur-md border-r border-[#10b981] p-6 pt-16 flex flex-col gap-4">
            <h3 className="text-[#10b981] font-bold tracking-widest text-[1rem] border-b border-emerald-900/30 pb-2 mb-2 uppercase">GAMES LIST</h3>
            
            <div 
              className="sidebar-item flex items-center gap-3.0 p-3 bg-slate-900/60 border border-white/5 rounded-lg cursor-pointer text-slate-200 hover:bg-emerald-550/20 hover:border-[#10b981] transition duration-200 font-semibold"
              onClick={() => handleStartFullscreenGame('bearGame')}
            >
              <Lightbulb size={16} className="text-[#10b981]" />
              <span className="text-xs">Impossible Light Off Button</span>
            </div>

            <div 
              className="sidebar-item flex items-center gap-3.0 p-3 bg-slate-900/60 border border-white/5 rounded-lg cursor-pointer text-slate-200 hover:bg-emerald-550/20 hover:border-[#10b981] transition duration-200 font-semibold"
              onClick={() => handleStartFullscreenGame('tentacle')}
            >
              <Sparkles size={16} className="text-[#10b981]" />
              <span className="text-xs">Tentacle Cursor</span>
            </div>

            <div 
              className="sidebar-item flex items-center gap-3.0 p-3 bg-slate-900/60 border border-white/5 rounded-lg cursor-pointer text-slate-200 hover:bg-emerald-550/20 hover:border-[#10b981] transition duration-200 font-semibold"
              onClick={() => handleStartFullscreenGame('heart')}
            >
              <span className="text-[#10b981] text-xs font-black">❤️</span>
              <span className="text-xs">Live Heart</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Fullscreen Game Zone Areas */}
      {activeInterface === 'fullscreenGameZone' && (
        <div id="fullscreenGameZone" className="app-interface flex-1 flex flex-col bg-black z-[100] relative min-h-[450px]">
          <button className="back-btn absolute-back absolute top-[10px] right-[20px] z-50 text-xs font-bold bg-[#1e293b] border border-[#334155] p-2 px-4 rounded-md text-slate-200 hover:bg-[#334155]" onClick={handleExitFullscreenGame}>
            <ArrowLeft size={14} /> Back to Menu
          </button>

          {/* Case A: Impossible Bear Game View */}
          {activeGame === 'bearGame' && (
            <div id="bearGameView" className="game-view flex-grow relative w-full h-full">
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes neonPulse {
                  0% { transform: scale(1); }
                  100% { transform: scale(1.02); }
                }
                .neon-glow-title {
                  animation: neonPulse 1.5s infinite alternate ease-in-out;
                }
              ` }} />
              
              <div className={`room w-full h-full flex flex-col justify-end items-center relative overflow-hidden transition-all duration-300 pb-12 ${isLightOn ? 'bg-[#1a1c23]' : 'bg-[#111216]'}`}>
                
                {/* Title branding (Plabon Trusted Shop) */}
                <div 
                  className={`absolute top-6 md:top-10 text-2xl md:text-3xl font-extrabold text-center uppercase tracking-widest select-none transition-all duration-500 pointer-events-none ${isLightOn ? 'text-white opacity-100 neon-glow-title' : 'text-[#0b111e] opacity-10'}`}
                  style={isLightOn ? {
                    textShadow: '0 0 5px #00f3ff, 0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 40px #00f3ff, 0 0 80px #0055ff'
                  } : {}}
                >
                  Plabon Trusted Shop
                </div>

                {/* Light fixture pull-switch block */}
                <div 
                  className="light-fixture absolute top-0 left-1/2 -translate-x-[150px] w-[100px] h-[300px] z-20 flex flex-col items-center select-none cursor-pointer"
                  onMouseDown={handleFixtureMouseDownOrTouchStart}
                  onTouchStart={handleFixtureMouseDownOrTouchStart}
                  onMouseUp={handleFixtureMouseUpOrTouchEnd}
                  onTouchEnd={handleFixtureMouseUpOrTouchEnd}
                >
                  {/* Flexible string vector line */}
                  <canvas ref={ropeCanvasRef} className="absolute top-0 pointer-events-none" style={{ width: '100px', height: '250px' }} />
                  
                  {/* Glowing Light bulb */}
                  <div className={`absolute w-10 h-10 rounded-full top-[140px] transition-all duration-200 ${isLightOn ? 'bg-white shadow-[0_0_40px_20px_rgba(255,255,255,0.6),0_0_100px_50px_#00f3ff]' : 'bg-[#444444] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'}`} />
                  
                  {/* Pull handler point */}
                  <div 
                    id="pullHandle" 
                    className="absolute w-4 h-4 bg-[#ff3366] rounded-full left-1/2 -translate-x-1/2 transition-shadow duration-300 shadow-[0_2px_5px_rgba(0,0,0,0.3)] hover:shadow-[0_0_12px_#ff3366]"
                  />
                </div>

                {/* Bear house with 3D details */}
                <div className="bear-house relative w-[220px] h-[280px] bg-[#2c1d11] border-8 border-[#19100a] border-b-0 rounded-t-[100px] overflow-hidden flex justify-center items-end shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-10 mb-4" style={{ perspective: '600px' }}>
                  
                  {/* Left Door */}
                  <div 
                    className="door absolute left-0 w-1/2 h-full bg-[#4a3321] border-2 border-[#2c1d11] rounded-tl-[90px] origin-left duration-300 transition-transform z-[15] flex items-center"
                    style={{ transform: isBearHouseOpen ? 'rotateY(-90deg)' : 'rotateY(0deg)' }}
                  >
                    <div className="w-3 h-3 bg-[#d4af37] rounded-full ml-auto mr-[10px]" />
                  </div>

                  {/* Right Door */}
                  <div 
                    className="door absolute right-0 w-1/2 h-full bg-[#4a3321] border-2 border-[#2c1d11] rounded-tr-[90px] origin-right duration-300 transition-transform z-[15] flex items-center justify-end"
                    style={{ transform: isBearHouseOpen ? 'rotateY(90deg)' : 'rotateY(0deg)' }}
                  >
                    <div className="w-3 h-3 bg-[#d4af37] rounded-full mr-auto ml-[10px]" />
                  </div>

                  {/* Animated Bear Character (SVG) */}
                  <div 
                    className="bear absolute w-[140px] h-[180px] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] z-10"
                    style={{ bottom: isBearShowHead ? '0px' : '-185px' }}
                  >
                    <svg viewBox="0 0 100 120" className="w-full h-full">
                      <circle cx="25" cy="25" r="12" fill="#5c3a21" />
                      <circle cx="25" cy="25" r="6" fill="#422814" />
                      <circle cx="75" cy="25" r="12" fill="#5c3a21" />
                      <circle cx="75" cy="25" r="6" fill="#422814" />
                      <ellipse cx="50" cy="70" rx="45" ry="40" fill="#5c3a21" />
                      <circle cx="50" cy="45" r="32" fill="#5c3a21" />
                      <ellipse cx="50" cy="55" rx="14" ry="10" fill="#d9a066" />
                      <polygon points="46,50 54,50 50,55" fill="#2c1d11" />
                      {/* Eyes */}
                      <circle cx="38" cy="38" r="5" fill={isBearAngry ? "#ff003c" : "#ffffff"} />
                      <circle cx="38" cy="38" r="2" fill="#000" />
                      <circle cx="62" cy="38" r="5" fill={isBearAngry ? "#ff003c" : "#ffffff"} />
                      <circle cx="62" cy="38" r="2" fill="#000" />
                      {/* Eyebrows */}
                      <path d="M30,30 L44,35" stroke="#2c1d11" strokeWidth="3" strokeLinecap="round" />
                      <path d="M70,30 L56,35" stroke="#2c1d11" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Reach Arm Hand mechanism */}
                  <div 
                    className="bear-hand absolute w-[35px] h-[100px] bg-[#5c3a21] rounded-[20px] z-[16] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.15)] origin-top-right"
                    style={{
                      top: isBearReach ? '-20px' : '50px',
                      left: isBearReach ? '-40px' : '-100px',
                      opacity: isBearReach ? 1 : 0,
                      transform: isBearReach ? 'rotate(-40deg)' : 'rotate(0deg)',
                    }}
                  />
                  
                </div>

                {/* Subtitle helper */}
                <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none select-none z-10 px-4">
                  <p className={`text-xs md:text-sm font-bold tracking-wider transition-colors duration-300 ${isLightOn ? 'text-white/80' : 'text-white/40'}`}>
                    {isLightOn ? "অরে বাবা! ভাল্লুক এসে বন্ধ করে দেবে!" : "লাইটটি জ্বালাইতে সুইচ টানুন (দড়িতে ক্লিক করুন)"}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Case B: Tentacle Canvas / Heart Particle Canvas Game View */}
          {(activeGame === 'tentacle' || activeGame === 'heart') && (
            <div id="canvasGameView" className="game-view flex-grow relative w-full h-full">
              <canvas ref={gamePlayCanvasRef} id="gamePlayCanvas" className="absolute inset-0 w-full h-full object-cover" />
              <div className="instruction absolute bottom-[30px] left-0 w-full text-center text-slate-500 font-bold tracking-wider text-xs pointer-events-none z-10" id="gameInstruction">
                {activeGame === 'tentacle' ? "স্ক্রিনে আঙুল বা মাউস নাড়াচড়া করুন" : "লাইভ হার্ট ইফেক্ট দেখতে স্ক্রিনে টাচ/ক্লিক করুন"}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
