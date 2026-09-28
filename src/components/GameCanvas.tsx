import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Character } from '../data/characters';
import { GameTheme } from '../data/themes';
import { PoopStyle } from '../data/poopStyles';
import { GameRank } from '../data/ranks';
import { GameDifficulty } from '../utils/auth';
import { sound } from '../utils/audio';

interface PoopItem {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  wobblePhase: number;
  rotation: number;
  rotationSpeed: number;
  isSpecialBonus?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
}

interface GameCanvasProps {
  character: Character;
  theme: GameTheme;
  poopStyle: PoopStyle;
  rank: GameRank;
  currentStage: number;
  stageRequiredTime: number;
  difficulty: GameDifficulty;
  highScore: number;
  volume: number;
  isMuted: boolean;
  onChangeVolume: (newVol: number) => void;
  onToggleSound: () => void;
  onGameOver: (finalScore: number, survivalSeconds: number, poopsDodged: number) => void;
  onStageCleared: (finalScore: number, survivalSeconds: number, poopsDodged: number) => void;
  onExitHome: () => void;
  onOpenSettings: () => void;
}

// Helper to draw a cute cartoon spiral eye on 2D Canvas
function drawSpiralEye(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, angleOffset: number) {
  ctx.save();
  ctx.translate(cx, cy);

  // White eye background circle
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#4A2511';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Rotating spiral inside eye
  ctx.rotate(angleOffset);
  ctx.strokeStyle = '#4A2511';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const turns = 2.4;
  const maxTheta = turns * Math.PI * 2;
  for (let theta = 0; theta <= maxTheta; theta += 0.2) {
    const r = (theta / maxTheta) * (radius - 2);
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;
    if (theta === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  character,
  theme,
  poopStyle,
  rank,
  currentStage,
  stageRequiredTime,
  difficulty,
  volume,
  isMuted,
  onChangeVolume,
  onToggleSound,
  onGameOver,
  onStageCleared,
  onExitHome,
  onOpenSettings
}) => {
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerDomRef = useRef<HTMLDivElement>(null);
  const volumePopoverRef = useRef<HTMLDivElement>(null);

  // Game reactive states for HUD
  const [score, setScore] = useState<number>(0);
  const [survivalSeconds, setSurvivalSeconds] = useState<number>(0);
  const [bonusAlert, setBonusAlert] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHitState, setIsHitState] = useState<boolean>(false);
  const [showVolumePopover, setShowVolumePopover] = useState<boolean>(false);

  const displayVolume = isMuted ? 0 : volume;

  // Close volume popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumePopoverRef.current && !volumePopoverRef.current.contains(e.target as Node)) {
        setShowVolumePopover(false);
      }
    };
    if (showVolumePopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVolumePopover]);

  // Store latest props & callbacks in a ref so the 60FPS loop NEVER resets mid-game!
  const livePropsRef = useRef({
    character,
    theme,
    poopStyle,
    currentStage,
    stageRequiredTime,
    difficulty,
    onGameOver,
    onStageCleared,
  });

  useEffect(() => {
    livePropsRef.current = {
      character,
      theme,
      poopStyle,
      currentStage,
      stageRequiredTime,
      difficulty,
      onGameOver,
      onStageCleared,
    };
  }, [character, theme, poopStyle, currentStage, stageRequiredTime, difficulty, onGameOver, onStageCleared]);

  // Internal mutable refs for 60FPS loop
  const gameStateRef = useRef({
    score: 0,
    startTime: 0,
    pausedAccumulatedMs: 0,
    pauseStartMs: 0,
    elapsedSeconds: 0,
    lastBonusMilestone: 0,
    poopsDodged: 0,
    isRunning: true,
    isPaused: false,
    isHit: false,
    isGameOverFinished: false,
    hitTime: 0,
    stuckPoopY: 0,
    stuckPoopX: 0,
    stuckPoopEmoji: '💩',
    stuckPoopFilter: '' as string | undefined,
    speedFactor: 1.0,
    playerX: 200,
    playerY: 400,
    playerSize: 56,
    playerFacing: 1,
    isMoving: false,
    poops: [] as PoopItem[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    keys: { left: false, right: false },
    touchTargetX: null as number | null,
    nextPoopId: 1,
    nextSpawnTime: 0,
    canvasWidth: 600,
    canvasHeight: 600,
  });

  // Helper to add floating animated text
  const addFloatingText = useCallback((x: number, y: number, text: string, color = '#fbbf24') => {
    gameStateRef.current.floatingTexts.push({
      id: Math.random(),
      x,
      y,
      text,
      color,
      alpha: 1.0,
      scale: 1.0
    });
  }, []);

  // Helper to spawn ground splat particles
  const addSplatParticles = useCallback((x: number, y: number, customColor?: string) => {
    const defaultColor = customColor || livePropsRef.current.poopStyle.splatColor;
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI * 0.8 + Math.random() * Math.PI * 0.4;
      const speed = 1.6 + Math.random() * 3.6;
      gameStateRef.current.particles.push({
        x,
        y: y - 4,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.sin(angle) * speed,
        size: 3.5 + Math.random() * 4,
        color: defaultColor,
        alpha: 1,
        life: 0,
        maxLife: 22 + Math.random() * 14
      });
    }
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keys.right = true;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
      if (e.key === 'Escape') {
        onOpenSettings();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onOpenSettings]);

  // Track pause time accurately so poops and timers resume smoothly
  useEffect(() => {
    const state = gameStateRef.current;
    if (isPaused && !state.isPaused) {
      state.isPaused = true;
      state.pauseStartMs = Date.now();
    } else if (!isPaused && state.isPaused) {
      state.isPaused = false;
      if (state.pauseStartMs > 0) {
        const pausedDelta = Date.now() - state.pauseStartMs;
        state.pausedAccumulatedMs += pausedDelta;
        state.nextSpawnTime += pausedDelta;
        state.pauseStartMs = 0;
      }
    }
  }, [isPaused]);

  // Main 60FPS Game Loop - Only initializes ONCE per stage/game mount!
  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasArea = canvasAreaRef.current;
    if (!canvas || !canvasArea) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvasArea.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(280, rect.width);
      const height = Math.max(300, rect.height);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Reset transform before scaling so repeated resizes don't compound scale
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      gameStateRef.current.canvasWidth = width;
      gameStateRef.current.canvasHeight = height;
      gameStateRef.current.playerY = height - 48;

      if (!gameStateRef.current.playerX || gameStateRef.current.playerX <= 0) {
        gameStateRef.current.playerX = width / 2;
      } else {
        gameStateRef.current.playerX = Math.max(34, Math.min(width - 34, gameStateRef.current.playerX));
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize game state cleanly once at game start
    const now = Date.now();
    const state = gameStateRef.current;
    state.startTime = now;
    state.pausedAccumulatedMs = 0;
    state.pauseStartMs = 0;
    state.isRunning = true;
    state.isHit = false;
    state.isGameOverFinished = false;
    state.hitTime = 0;
    state.stuckPoopY = 0;
    state.stuckPoopX = 0;
    state.score = 0;
    state.elapsedSeconds = 0;
    state.lastBonusMilestone = 0;
    state.poopsDodged = 0;
    state.speedFactor = 1.0;
    state.poops = [];
    state.particles = [];
    state.floatingTexts = [];
    state.playerX = state.canvasWidth / 2;
    state.playerY = state.canvasHeight - 48;
    state.nextSpawnTime = now + 350;
    setIsHitState(false);

    let animFrameId: number;
    let lastTime = performance.now();

    const getDifficultyConfig = () => {
      const { currentStage: stg, difficulty: diff } = livePropsRef.current;
      const stageSpeedMult = 1 + (stg - 1) * 0.015;
      if (diff === 'easy') {
        return {
          baseSpeed: 2.5 * stageSpeedMult,
          spawnInterval: Math.max(460, 900 - stg * 8),
          speedIncrement: 0.08
        };
      }
      if (diff === 'hard') {
        return {
          baseSpeed: 4.7 * stageSpeedMult,
          spawnInterval: Math.max(240, 440 - stg * 5),
          speedIncrement: 0.16
        };
      }
      return {
        baseSpeed: 3.4 * stageSpeedMult,
        spawnInterval: Math.max(340, 660 - stg * 7),
        speedIncrement: 0.12
      };
    };

    const spawnPoop = (currentTime: number) => {
      const { canvasWidth, speedFactor } = gameStateRef.current;
      const diffConfig = getDifficultyConfig();
      const margin = 30;
      const x = margin + Math.random() * Math.max(40, canvasWidth - margin * 2);

      const size = 36 + Math.random() * 8;
      const speedVar = 0.92 + Math.random() * 0.24;
      const isBonus = Math.random() < 0.15;

      const totalSpeed = diffConfig.baseSpeed * speedFactor * speedVar * (isBonus ? 1.12 : 1.0);

      gameStateRef.current.poops.push({
        id: gameStateRef.current.nextPoopId++,
        x,
        y: -28, // Starts just above the top edge and falls smoothly all the way to the bottom floor
        size,
        speed: totalSpeed,
        wobblePhase: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.25,
        rotationSpeed: (Math.random() - 0.5) * 0.035,
        isSpecialBonus: isBonus
      });

      const isHard = livePropsRef.current.difficulty === 'hard';
      const currentInterval = Math.max(
        160,
        diffConfig.spawnInterval / (speedFactor * (isHard ? 1.2 : 1))
      );
      gameStateRef.current.nextSpawnTime = currentTime + currentInterval * (0.82 + Math.random() * 0.36);
    };

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      const s = gameStateRef.current;
      const { canvasWidth, canvasHeight, isPaused: paused, isRunning, isHit } = s;
      const live = livePropsRef.current;
      const groundHeight = 34;

      // Keep player firmly positioned on the floor
      s.playerY = canvasHeight - 48;

      if (isRunning && !paused && !isHit) {
        const currentNow = Date.now();
        const activeElapsedMs = currentNow - s.startTime - s.pausedAccumulatedMs;
        const currentElapsed = Math.max(0, Math.floor(activeElapsedMs / 1000));

        if (currentElapsed !== s.elapsedSeconds) {
          s.elapsedSeconds = currentElapsed;
          setSurvivalSeconds(currentElapsed);

          // Check Stage Clear
          if (currentElapsed >= live.stageRequiredTime) {
            s.isRunning = false;
            live.onStageCleared(s.score + 50, currentElapsed, s.poopsDodged);
            return;
          }

          // Milestone bonus every 20s
          const milestone = Math.floor(currentElapsed / 20);
          if (milestone > s.lastBonusMilestone && milestone > 0) {
            s.lastBonusMilestone = milestone;
            s.score += 20;
            s.speedFactor += getDifficultyConfig().speedIncrement;
            setScore(s.score);

            sound.playBonusSound();
            setBonusAlert(`🎉 SỐNG SÓT ${milestone * 20}S! THƯỞNG +20 ĐIỂM! 🎉`);
            setTimeout(() => setBonusAlert(null), 3000);

            addFloatingText(s.playerX, s.playerY - 48, '+20 ĐIỂM THƯỞNG!', '#fbbf24');
          }
        }

        // Player Horizontal Movement
        const moveSpeed = 390 * live.character.speedMultiplier;
        let dx = 0;

        if (s.keys.left) {
          dx -= 1;
          s.playerFacing = -1;
        }
        if (s.keys.right) {
          dx += 1;
          s.playerFacing = 1;
        }

        if (s.touchTargetX !== null) {
          const diff = s.touchTargetX - s.playerX;
          if (Math.abs(diff) > 4) {
            const step = Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed * dt * 1.45);
            s.playerX += step;
            s.playerFacing = diff > 0 ? 1 : -1;
            s.isMoving = true;
          } else {
            s.touchTargetX = null;
          }
        } else if (dx !== 0) {
          s.isMoving = true;
          s.playerX += dx * moveSpeed * dt;
        } else {
          s.isMoving = false;
        }

        const halfSize = s.playerSize / 2;
        s.playerX = Math.max(halfSize + 6, Math.min(canvasWidth - halfSize - 6, s.playerX));

        // Spawn falling poops
        if (currentNow >= s.nextSpawnTime) {
          spawnPoop(currentNow);
          if (live.difficulty === 'hard' && Math.random() < 0.32) {
            spawnPoop(currentNow + 80);
          }
        }
      }

      // Sync HTML DOM Player Overlay position smoothly every frame
      if (playerDomRef.current) {
        const bob = (!s.isHit && s.isMoving)
          ? Math.sin(timestamp * 0.016) * 3
          : (!s.isHit ? Math.sin(timestamp * 0.005) * 1.5 : 0);
        playerDomRef.current.style.transform = `translate3d(${s.playerX - 30}px, ${s.playerY - 30 + bob}px, 0)`;
      }

      // Update falling poops - smooth continuous fall from top edge to bottom ground floor!
      if (!paused) {
        const playerRadius = s.playerSize * 0.40;
        const playerCenterY = s.playerY;
        const playerCenterX = s.playerX;

        // Floor landing Y is right on top of the bottom ground bar so poops fall ALL THE WAY down!
        const floorLandingY = canvasHeight - groundHeight + 8;

        const remainingPoops: PoopItem[] = [];

        for (const poop of s.poops) {
          // Smooth 60fps vertical movement
          poop.y += poop.speed * (dt * 60);
          poop.rotation += poop.rotationSpeed * (dt * 60);

          // Check collision with player head/body
          if (!s.isHit) {
            const poopRadius = poop.size * 0.38;
            const distSq =
              (poop.x - playerCenterX) * (poop.x - playerCenterX) +
              (poop.y - playerCenterY) * (poop.y - playerCenterY);
            const collisionDist = playerRadius + poopRadius;

            if (distSq < collisionDist * collisionDist) {
              // HIT! Poop lands on character's head -> Cute spiral eyes & tongue out!
              s.isHit = true;
              s.hitTime = performance.now();
              s.stuckPoopY = playerCenterY - 28;
              s.stuckPoopX = playerCenterX;
              s.stuckPoopEmoji = live.poopStyle.emoji;
              s.stuckPoopFilter = live.poopStyle.filterStyle;
              s.isRunning = false;
              setIsHitState(true);

              sound.playGameOverSound();
              addSplatParticles(playerCenterX, s.stuckPoopY + 6, poop.isSpecialBonus ? '#f59e0b' : live.poopStyle.color);
              addFloatingText(playerCenterX, playerCenterY - 72, '💩 TRÚNG CỤC CỨT THÚI HOẮC!', '#dc2626');

              setTimeout(() => {
                s.isGameOverFinished = true;
                live.onGameOver(s.score, s.elapsedSeconds, s.poopsDodged);
              }, 1500);

              continue;
            }
          }

          // Only remove poop when it reaches the VERY BOTTOM GROUND FLOOR!
          if (poop.y >= floorLandingY) {
            if (!s.isHit) {
              s.poopsDodged += 1;
              const pointsGained = poop.isSpecialBonus ? 2 : 1;
              s.score += pointsGained;
              setScore(s.score);

              sound.playDodgeSound();
              addSplatParticles(poop.x, floorLandingY, poop.isSpecialBonus ? '#f59e0b' : live.poopStyle.color);
              addFloatingText(poop.x, floorLandingY - 16, `+${pointsGained}`, poop.isSpecialBonus ? '#f59e0b' : '#10b981');
            } else {
              addSplatParticles(poop.x, floorLandingY, live.poopStyle.color);
            }
          } else {
            remainingPoops.push(poop);
          }
        }

        s.poops = remainingPoops;

        // Update Splat Particles
        s.particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18;
          p.life++;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        });
        s.particles = s.particles.filter(p => p.life < p.maxLife);

        // Update Floating Texts
        s.floatingTexts.forEach(ft => {
          ft.y -= 1.2;
          ft.alpha -= 0.024;
          ft.scale = Math.min(1.3, ft.scale + 0.014);
        });
        s.floatingTexts = s.floatingTexts.filter(ft => ft.alpha > 0);
      }

      // --- RENDERING PHASE ---
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 1. Draw decorative ground floor at the very bottom of the screen
      ctx.fillStyle = live.theme.accentColor;
      ctx.beginPath();
      ctx.roundRect(0, canvasHeight - groundHeight, canvasWidth, groundHeight, [14, 14, 0, 0]);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.fillRect(0, canvasHeight - groundHeight, canvasWidth, 4);

      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      const stickerSpacing = canvasWidth / (live.theme.decorations.length + 1);
      live.theme.decorations.forEach((dec, idx) => {
        ctx.fillText(dec, stickerSpacing * (idx + 1), canvasHeight - 10);
      });

      // 2. Draw Ground Splat Particles
      s.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Draw Falling Poops Smoothly
      s.poops.forEach(poop => {
        ctx.save();
        ctx.translate(poop.x, poop.y);
        ctx.rotate(poop.rotation);

        if (poop.isSpecialBonus) {
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 12;
        }

        ctx.font = `${Math.round(poop.size)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (live.poopStyle.filterStyle && ctx.filter) {
          ctx.filter = live.poopStyle.filterStyle;
        }

        ctx.fillText(live.poopStyle.emoji, 0, 0);
        ctx.restore();
      });

      // 4. Draw Character Shadow & Pedestal on Canvas
      const pX = s.playerX;
      const pY = s.playerY;
      const pSize = s.playerSize;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(pX, canvasHeight - groundHeight + 4, pSize * 0.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Canvas backup character rendering (with cute spinning spiral eyes & pink tongue when hit!)
      if (s.isHit) {
        const spinAngle = timestamp * 0.012;
        // Cute knocked-out head circle
        ctx.fillStyle = '#FFE8CC';
        ctx.strokeStyle = '#6B3E26';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pX, pY, pSize * 0.48, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rosy cheeks
        ctx.fillStyle = '#FF8FA3';
        ctx.beginPath();
        ctx.arc(pX - 14, pY + 5, 5, 0, Math.PI * 2);
        ctx.arc(pX + 14, pY + 5, 5, 0, Math.PI * 2);
        ctx.fill();

        // 2 Spinning Spiral Eyes
        drawSpiralEye(ctx, pX - 10, pY - 4, 8, spinAngle);
        drawSpiralEye(ctx, pX + 10, pY - 4, 8, -spinAngle);

        // Cute mouth with pink tongue sticking out!
        ctx.strokeStyle = '#4A2511';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pX - 8, pY + 10);
        ctx.quadraticCurveTo(pX, pY + 7, pX + 8, pY + 10);
        ctx.stroke();

        // Pink tongue sticking out
        ctx.fillStyle = '#FF5D8F';
        ctx.strokeStyle = '#4A2511';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(pX - 2, pY + 9, 9, 12, [2, 2, 6, 6]);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();

      // 5. Draw Floating Texts
      s.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = `bold ${Math.round(18 * ft.scale)}px 'Fredoka', 'Nunito', sans-serif`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillStyle = ft.color;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      if (s.isRunning || (s.isHit && !s.isGameOverFinished)) {
        animFrameId = requestAnimationFrame(loop);
      }
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentStage, addFloatingText, addSplatParticles]);

  // Pointer controls
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    gameStateRef.current.touchTargetX = e.clientX - rect.left;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    gameStateRef.current.touchTargetX = e.clientX - rect.left;
  };

  const handlePointerUp = () => {
    // Keep last target smooth
  };

  // Virtual mobile buttons
  const handlePressLeft = () => {
    gameStateRef.current.keys.left = true;
  };
  const handleReleaseLeft = () => {
    gameStateRef.current.keys.left = false;
  };
  const handlePressRight = () => {
    gameStateRef.current.keys.right = true;
  };
  const handleReleaseRight = () => {
    gameStateRef.current.keys.right = false;
  };

  const difficultyBadge = {
    easy: { text: '🟢 Dễ', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    normal: { text: '🟡 Bình thường', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    hard: { text: '🔴 Khó', color: 'bg-rose-100 text-rose-800 border-rose-300' }
  }[difficulty];

  const stageProgressPercent = Math.min(100, Math.floor((survivalSeconds / stageRequiredTime) * 100));

  const getVolumeIcon = () => {
    if (isMuted || displayVolume === 0) return '🔇';
    if (displayVolume < 45) return '🔉';
    return '🔊';
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between select-none overflow-hidden bg-gradient-to-b ${theme.bgGradient}`}
    >
      {/* Top HUD Bar */}
      <div className="w-full max-w-3xl px-3 pt-2 pb-1 z-30 shrink-0">
        <div className="flex items-center justify-between gap-2 bg-[#FFFDF9]/95 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-md border-2 border-[#8B4513]">
          {/* LEFT: Settings + Rank */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClickSound();
                onOpenSettings();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-[#D27D2D] to-[#9A4E14] text-white font-black text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer border border-[#5C2C0C]"
              title="Cài đặt trò chơi"
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Cài đặt</span>
            </button>

            <span className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-[#FFF3DF] border border-[#D4A373] text-xs font-black text-[#4A2511]">
              <span>{rank.icon}</span>
              <span className="hidden sm:inline">{rank.name.split(' ')[0]}</span>
            </span>
          </div>

          {/* CENTER: Stage & Score */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#4A2511] bg-[#FFE8CC] px-2 py-0.5 rounded-md border border-[#D4A373]">
                MÀN {currentStage}/50
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-[#6B3E26]">Điểm:</span>
                <span className="text-base sm:text-lg font-black text-[#4A2511] tabular-nums">{score}</span>
              </div>
            </div>

            <div className="mt-1 w-28 sm:w-36 h-2 bg-stone-200 rounded-full overflow-hidden border border-[#D4A373]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-300 rounded-full"
                style={{ width: `${stageProgressPercent}%` }}
              />
            </div>
          </div>

          {/* RIGHT: Survival Goal + Volume 0-100 + Pause + Home */}
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-end text-right mr-1">
              <span className="text-[10px] font-bold text-[#8C583A]">Qua màn:</span>
              <span className="text-xs sm:text-sm font-black text-blue-900 tabular-nums">
                {survivalSeconds}s/{stageRequiredTime}s
              </span>
            </div>

            {/* Volume 0-100 Button in HUD */}
            <div className="relative" ref={volumePopoverRef}>
              <button
                onClick={() => {
                  sound.playClickSound();
                  setShowVolumePopover(prev => !prev);
                }}
                className="p-1.5 rounded-xl bg-[#FFF3DF] hover:bg-[#FDE4BE] active:scale-95 text-[#4A2511] border border-[#D4A373] transition-all font-black text-xs cursor-pointer"
                title="Chỉnh âm lượng (0 - 100)"
              >
                {getVolumeIcon()}
              </button>

              {showVolumePopover && (
                <div className="absolute right-0 mt-2 w-56 p-3 rounded-2xl bg-[#FFFDF9] border-3 border-[#7A4419] shadow-2xl z-50">
                  <div className="flex items-center justify-between text-xs font-black text-[#4A2511] mb-1.5">
                    <span>Âm lượng</span>
                    <span>{displayVolume}/100</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={displayVolume}
                    onChange={e => onChangeVolume(Number(e.target.value))}
                    className="w-full h-2 bg-[#E6C7A6] rounded-lg appearance-none cursor-pointer accent-[#8B4513]"
                  />
                  <div className="mt-2 flex justify-between gap-1">
                    {[0, 50, 100].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => onChangeVolume(v)}
                        className="flex-1 py-1 rounded-lg bg-[#FFF3DF] hover:bg-[#FDE4BE] text-[10px] font-black text-[#4A2511] border border-[#D4A373] cursor-pointer"
                      >
                        {v}%
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-xl bg-[#FFF3DF] hover:bg-[#FDE4BE] active:scale-95 text-[#4A2511] border border-[#D4A373] transition-all font-black text-xs cursor-pointer"
              title={isPaused ? 'Tiếp tục (Space)' : 'Tạm dừng (Space)'}
            >
              {isPaused ? '▶' : '⏸'}
            </button>

            <button
              onClick={onExitHome}
              className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-700 border border-rose-300 transition-all font-black text-xs cursor-pointer"
              title="Về trang chủ"
            >
              🏠
            </button>
          </div>
        </div>

        {/* Stage Sub-bar */}
        <div className="mt-1 px-1 flex items-center justify-between text-[11px] font-semibold text-[#4A2511]/90">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">{theme.name}</span>
            <span className="hidden sm:inline">• {character.emoji} {character.name}</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${difficultyBadge.color}`}>
            {difficultyBadge.text}
          </span>
        </div>
      </div>

      {/* 20s Bonus Alert */}
      {bonusAlert && (
        <div className="absolute top-16 z-30 px-5 py-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 font-black text-sm rounded-2xl shadow-xl border-2 border-yellow-200 animate-bounce">
          {bonusAlert}
        </div>
      )}

      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-40 bg-black/45 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl p-5 shadow-2xl border-4 border-[#7A4419] text-center max-w-xs w-full">
            <div className="text-3xl mb-1">⏸️</div>
            <h3 className="text-xl font-black text-[#4A2511] mb-1">ĐANG TẠM DỪNG</h3>
            <p className="text-xs text-[#8C583A] font-bold mb-4">
              Màn {currentStage} / 50 • Mục tiêu: {stageRequiredTime}s
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black rounded-xl shadow active:scale-95 transition-all text-sm mb-2 cursor-pointer"
            >
              ▶ TIẾP TỤC CHƠI (SPACE)
            </button>
            <button
              onClick={onOpenSettings}
              className="w-full py-2 bg-[#FFF3DF] hover:bg-[#FDE4BE] text-[#4A2511] font-bold rounded-xl text-xs mb-2 border border-[#D4A373] cursor-pointer"
            >
              ⚙️ MỞ CÀI ĐẶT
            </button>
            <button
              onClick={onExitHome}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              🏠 VỀ TRANG CHỦ
            </button>
          </div>
        </div>
      )}

      {/* Play Area Container - Measured directly by canvasAreaRef so poops fall 100% to the bottom */}
      <div
        ref={canvasAreaRef}
        className="relative flex-1 w-full h-full max-w-3xl flex items-center justify-center touch-none overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none block"
        />

        {/* VISIBLE PLAYER CHARACTER DOM OVERLAY */}
        <div
          ref={playerDomRef}
          className="absolute top-0 left-0 pointer-events-none z-20 flex flex-col items-center justify-center"
          style={{
            width: '60px',
            height: '60px',
            willChange: 'transform'
          }}
        >
          {!isHitState ? (
            /* ALIVE CHARACTER BUBBLE */
            <div className="relative w-14 h-14 rounded-full bg-[#FFFDF9]/95 border-3 border-[#8B4513] shadow-xl flex items-center justify-center text-3xl select-none">
              <span>{character.emoji}</span>
            </div>
          ) : (
            /* HIT BY POOP: CUTE KNOCKED-OUT FACE WITH 2 SPINNING SPIRAL EYES & TONGUE STICKING OUT! */
            <div className="relative w-15 h-15 rounded-full bg-[#FFE8CC] border-3 border-[#6B3E26] shadow-2xl flex flex-col items-center justify-center select-none">
              {/* Poop splatted right on top of character's head */}
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce z-30 drop-shadow"
                style={{ filter: poopStyle.filterStyle }}
              >
                {poopStyle.emoji}
              </div>

              {/* Stink lines & dizzy stars above poop */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-black text-emerald-700 animate-pulse whitespace-nowrap">
                💫 〰️ 🪰
              </div>

              {/* 2 Spinning Spiral Eyes (2 mắt xoay tròn dễ thương) */}
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-[#4A2511] flex items-center justify-center overflow-hidden">
                  <svg className="w-4 h-4 animate-spin text-[#4A2511]" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12c0-1.5 1.2-2.5 2.5-2.5S17 10.8 17 12.5c0 2.5-2 4.5-4.8 4.5-3.5 0-6.2-2.8-6.2-6.5C6 6 9.5 3 13.5 3c4.8 0 8.5 3.8 8.5 9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="w-5 h-5 rounded-full bg-white border-2 border-[#4A2511] flex items-center justify-center overflow-hidden">
                  <svg
                    className="w-4 h-4 animate-spin text-[#4A2511]"
                    style={{ animationDirection: 'reverse' }}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 12c0-1.5 1.2-2.5 2.5-2.5S17 10.8 17 12.5c0 2.5-2 4.5-4.8 4.5-3.5 0-6.2-2.8-6.2-6.5C6 6 9.5 3 13.5 3c4.8 0 8.5 3.8 8.5 9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Rosy Cheeks & Cute Pink Tongue Sticking Out (le lưỡi dễ thương) */}
              <div className="relative w-full flex items-center justify-center mt-0.5">
                <span className="w-2.5 h-1.5 rounded-full bg-pink-400/80 mr-2" />
                {/* Mouth & Pink Tongue */}
                <div className="relative flex flex-col items-center">
                  <div className="w-4 h-1 bg-[#4A2511] rounded-full" />
                  <div className="w-3 h-3.5 -mt-0.5 bg-[#FF5D8F] border-2 border-[#4A2511] rounded-b-full shadow-2xs animate-bounce">
                    <div className="w-0.5 h-2 bg-[#D6336C] mx-auto mt-0.5 rounded-full" />
                  </div>
                </div>
                <span className="w-2.5 h-1.5 rounded-full bg-pink-400/80 ml-2" />
              </div>
            </div>
          )}

          {/* Character Name Tag */}
          <span
            className={`mt-0.5 px-2 py-0.2 rounded-md text-[9px] font-black tracking-tight whitespace-nowrap shadow-xs ${
              isHitState ? 'bg-rose-600 text-white animate-bounce' : 'bg-[#4A2511]/90 text-white'
            }`}
          >
            {isHitState ? '😵 Thúi Hoắc!' : character.name.split(' ')[0]}
          </span>
        </div>

        {/* Floating Mobile Left/Right Controls */}
        <div className="sm:hidden absolute bottom-2.5 left-2.5 right-2.5 z-30 flex items-center justify-between pointer-events-none">
          <button
            onPointerDown={handlePressLeft}
            onPointerUp={handleReleaseLeft}
            onPointerLeave={handleReleaseLeft}
            className="w-13 h-13 bg-[#FFFDF9]/90 active:bg-amber-400 text-[#4A2511] rounded-2xl shadow-xl border-2 border-[#8B4513] font-black text-2xl flex items-center justify-center active:scale-90 transition-transform pointer-events-auto"
            title="Sang trái"
          >
            ⬅️
          </button>

          <button
            onPointerDown={handlePressRight}
            onPointerUp={handleReleaseRight}
            onPointerLeave={handleReleaseRight}
            className="w-13 h-13 bg-[#FFFDF9]/90 active:bg-amber-400 text-[#4A2511] rounded-2xl shadow-xl border-2 border-[#8B4513] font-black text-2xl flex items-center justify-center active:scale-90 transition-transform pointer-events-auto"
            title="Sang phải"
          >
            ➡️
          </button>
        </div>
      </div>
    </div>
  );
};
