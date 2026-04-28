import React, { useRef, useEffect, useState } from 'react';
import { X, Trophy, Activity } from 'lucide-react';

interface PongGameProps {
  playerKey: string;
  playerName: string;
  onClose: () => void;
}

export default function PongGame({ playerKey, playerName, onClose }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ user: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Game state
    const paddleWidth = 80;
    const paddleHeight = 10;
    const ballRadius = 6;

    let userPaddle = {
      x: canvasWidth / 2 - paddleWidth / 2,
      y: canvasHeight - paddleHeight - 10,
      width: paddleWidth,
      height: paddleHeight,
      score: 0
    };

    let aiPaddle = {
      x: canvasWidth / 2 - paddleWidth / 2,
      y: 10,
      width: paddleWidth,
      height: paddleHeight,
      score: 0,
      speed: 4,
      errorMargin: 0
    };

    let ball = {
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      vx: 0,
      vy: 0,
      speed: 6,
      color: '#fff'
    };

    // Set AI characteristics based on playerKey
    switch (playerKey) {
      case 'ma_long': // Hexagon warrior: balanced, very fast, low error
        aiPaddle.speed = 5;
        aiPaddle.errorMargin = 10;
        ball.speed = 7;
        break;
      case 'fan_zhendong': // Power: High ball return speed
        aiPaddle.speed = 4.5;
        aiPaddle.errorMargin = 15;
        ball.speed = 9;
        break;
      case 'zhang_jike': // Aggressive: high speed, higher error
        aiPaddle.speed = 5.5;
        aiPaddle.errorMargin = 25;
        ball.speed = 8;
        break;
      case 'xu_xin': // Fast movement (X-man)
        aiPaddle.speed = 7;
        aiPaddle.errorMargin = 30;
        ball.speed = 7;
        break;
      case 'wang_chuqin': // Fast & balanced
        aiPaddle.speed = 5;
        aiPaddle.errorMargin = 20;
        ball.speed = 8;
        break;
      case 'sun_yingsha': // Quick reactions
        aiPaddle.speed = 6;
        aiPaddle.errorMargin = 15;
        ball.speed = 7;
        break;
      default:
        aiPaddle.speed = 4;
        aiPaddle.errorMargin = 20;
        ball.speed = 6;
    }

    const initialBallSpeed = ball.speed;

    let totalPoints = 0;
    let currentServer: 'user' | 'ai' = 'user';
    let isServing = false;
    let isAimingServe = false;
    let serveTimeout: number;
    let serveStartTime = 0;
    let showYellowCard = false;

    const executeServe = (targetX?: number, targetY?: number) => {
      ball.speed = initialBallSpeed;
      if (currentServer === 'user') {
        const tx = targetX !== undefined ? targetX : canvasWidth / 2;
        const ty = targetY !== undefined ? targetY : 0;
        
        let dx = tx - ball.x;
        let dy = ty - ball.y;
        let distance = Math.hypot(dx, dy);
        
        if (distance === 0) distance = 1;

        ball.vx = (dx / distance) * ball.speed;
        ball.vy = (dy / distance) * ball.speed;
      } else {
        const tx = Math.random() * canvasWidth;
        const ty = canvasHeight;
        
        let dx = tx - ball.x;
        let dy = ty - ball.y;
        let distance = Math.hypot(dx, dy);
        
        if (distance === 0) distance = 1;

        ball.vx = (dx / distance) * ball.speed;
        ball.vy = (dy / distance) * ball.speed;
      }
      isServing = false;
      showYellowCard = false;
    };

    const serveBall = () => {
      isServing = true;
      ball.vx = 0;
      ball.vy = 0;
      showYellowCard = false;

      if (userPaddle.score >= 10 && aiPaddle.score >= 10) {
        currentServer = (totalPoints % 2 === 0) ? 'user' : 'ai';
      } else {
        currentServer = (Math.floor(totalPoints / 2) % 2 === 0) ? 'user' : 'ai';
      }

      if (currentServer === 'user') {
        serveStartTime = Date.now();
      } else {
        const randomServeTime = 500 + Math.random() * 2000;
        serveTimeout = window.setTimeout(() => {
          executeServe();
        }, randomServeTime);
      }
    };

    serveBall();

    const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };

    const drawCircle = (x: number, y: number, r: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    };

    const drawText = (text: string, x: number, y: number, color: string, align: CanvasTextAlign = 'center', baseline: CanvasTextBaseline = 'middle', fontSize: number = 36) => {
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = baseline;
      ctx.fillText(text, x, y);
    };

    const update = () => {
      if (isServing) {
        if (currentServer === 'user') {
          ball.x = userPaddle.x + userPaddle.width / 2;
          ball.y = userPaddle.y - ballRadius - 2;
          if (Date.now() - serveStartTime > 5000) {
            showYellowCard = true;
          }
        } else {
          // AI paddle wanders side to side while holding ball
          let aiCenter = canvasWidth / 2 - aiPaddle.width / 2;
          let offset = Math.sin(Date.now() / 400) * (canvasWidth / 3);
          aiPaddle.x = aiCenter + offset;
          aiPaddle.x = Math.max(0, Math.min(canvasWidth - aiPaddle.width, aiPaddle.x));
          ball.x = aiPaddle.x + aiPaddle.width / 2;
          ball.y = aiPaddle.y + aiPaddle.height + ballRadius + 2;
        }
        return;
      }

      // Move ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // AI movement
      let targetX = ball.x - aiPaddle.width / 2 + (Math.random() * aiPaddle.errorMargin - aiPaddle.errorMargin / 2);
      if (aiPaddle.x < targetX) {
        aiPaddle.x += aiPaddle.speed;
      } else if (aiPaddle.x > targetX) {
        aiPaddle.x -= aiPaddle.speed;
      }

      // Constrain AI paddle
      aiPaddle.x = Math.max(0, Math.min(canvasWidth - aiPaddle.width, aiPaddle.x));

      // Wall collision
      if (ball.x - ballRadius <= 0) {
        ball.x = ballRadius;
        ball.vx = Math.abs(ball.vx);
      } else if (ball.x + ballRadius >= canvasWidth) {
        ball.x = canvasWidth - ballRadius;
        ball.vx = -Math.abs(ball.vx);
      }

      // Check paddle collision
      // User paddle
      if (ball.y + ballRadius >= userPaddle.y && ball.y - ballRadius <= userPaddle.y + userPaddle.height) {
        if (ball.x + ballRadius >= userPaddle.x && ball.x - ballRadius <= userPaddle.x + userPaddle.width) {
          if (ball.vy > 0) { // Only bounce if moving down
            let collidePoint = ball.x - (userPaddle.x + userPaddle.width / 2);
            collidePoint = Math.max(-0.95, Math.min(0.95, collidePoint / (userPaddle.width / 2)));
            let angleRad = (Math.PI / 3) * collidePoint; // Max angle is 60 deg
            let direction = -1; // Go up
            ball.vx = ball.speed * Math.sin(angleRad);
            ball.vy = direction * ball.speed * Math.cos(angleRad);
            ball.y = userPaddle.y - ballRadius; // pull it out of the paddle
            ball.speed += 0.2; // Increase speed hit by hit
          }
        }
      }

      // AI paddle
      if (ball.y - ballRadius <= aiPaddle.y + aiPaddle.height && ball.y + ballRadius >= aiPaddle.y) {
        if (ball.x + ballRadius >= aiPaddle.x && ball.x - ballRadius <= aiPaddle.x + aiPaddle.width) {
          if (ball.vy < 0) { // Only bounce if moving up
            let collidePoint = ball.x - (aiPaddle.x + aiPaddle.width / 2);
            collidePoint = Math.max(-0.95, Math.min(0.95, collidePoint / (aiPaddle.width / 2)));
            let angleRad = (Math.PI / 3) * collidePoint; // Max angle is 60 deg
            let direction = 1; // Go down
            ball.vx = ball.speed * Math.sin(angleRad);
            ball.vy = direction * ball.speed * Math.cos(angleRad);
            ball.y = aiPaddle.y + aiPaddle.height + ballRadius; // pull it out of the paddle
            ball.speed += 0.2; // Increase speed hit by hit
          }
        }
      }

      // Scoring
      if (ball.y < 0) {
        userPaddle.score++;
        totalPoints++;
        setScore({ user: userPaddle.score, ai: aiPaddle.score });
        serveBall();
      } else if (ball.y > canvasHeight) {
        aiPaddle.score++;
        totalPoints++;
        setScore({ user: userPaddle.score, ai: aiPaddle.score });
        serveBall();
      }

      // Win condition
      if (userPaddle.score >= 11 && userPaddle.score - aiPaddle.score >= 2) {
        setWinner('你赢了！');
        setGameOver(true);
      } else if (aiPaddle.score >= 11 && aiPaddle.score - userPaddle.score >= 2) {
        setWinner(`被${playerName}击败！`);
        setGameOver(true);
      }
    };

    const draw = () => {
      // Clear canvas
      drawRect(0, 0, canvasWidth, canvasHeight, 'rgba(2, 6, 23, 1)'); // slate-950

      // Draw net (dashed line horizontally)
      ctx.beginPath();
      ctx.setLineDash([10, 10]);
      ctx.moveTo(0, canvasHeight / 2);
      ctx.lineTo(canvasWidth, canvasHeight / 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();
      ctx.setLineDash([]); // Reset dashed line

      // Draw Paddles
      drawRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, '#3b82f6'); // blue-500
      drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, '#ef4444'); // red-500

      // Draw Ball
      drawCircle(ball.x, ball.y, ballRadius, ball.color);

      // Draw Scores faintly
      drawText(aiPaddle.score.toString(), canvasWidth / 2, canvasHeight / 4, 'rgba(255,255,255,0.1)');
      drawText(userPaddle.score.toString(), canvasWidth / 2, 3 * canvasHeight / 4, 'rgba(255,255,255,0.1)');

      // Draw Serve Prompt / Yellow Card
      if (isServing && currentServer === 'user') {
        if (showYellowCard) {
          drawText('🟨 黄牌警告: 发球超时', canvasWidth / 2, canvasHeight / 2 - 20, '#eab308', 'center', 'middle', 24);
        }
        drawText('按住屏幕瞄准，松开发球', canvasWidth / 2, canvasHeight / 2 + 30, 'rgba(255,255,255,0.7)', 'center', 'middle', 18);
      }
    };

    const loop = () => {
      if (!gameOver) {
        update();
      }
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    // Event listeners for paddle movement
    const handleMouseMove = (e: MouseEvent) => {
      if (isAimingServe || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      let newX = (e.clientX - rect.left) * scaleX - userPaddle.width / 2;
      userPaddle.x = Math.max(0, Math.min(canvasWidth - userPaddle.width, newX));
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default scrolling only if touch is on canvas
      if (e.target === canvas) {
        e.preventDefault();
        if (isAimingServe || !canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        let newX = (e.touches[0].clientX - rect.left) * scaleX - userPaddle.width / 2;
        userPaddle.x = Math.max(0, Math.min(canvasWidth - userPaddle.width, newX));
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (isServing && currentServer === 'user') {
        isAimingServe = true;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isServing && currentServer === 'user' && isAimingServe) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        let targetY = (e.clientY - rect.top) * scaleY;
        let targetX = (e.clientX - rect.left) * scaleX;

        // Note: they can serve backwards if they target bottom half, 
        // to prevent this we can enforce targetY to be < user paddle y (or just anything, ping pong mechanics allow it).
        // Let's just execute serve directly
        executeServe(targetX, Math.min(targetY, userPaddle.y - ballRadius - 10));
      }
      isAimingServe = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('pointerdown', handlePointerDown as EventListener);
    window.addEventListener('pointerup', handlePointerUp as EventListener);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(serveTimeout);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('pointerdown', handlePointerDown as EventListener);
      window.removeEventListener('pointerup', handlePointerUp as EventListener);
    };
  }, [playerKey, gameOver, playerName]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020617]/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
      <div className="absolute top-6 right-6">
        <button
          onClick={onClose}
          className="p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full text-slate-300 transition-colors border border-white/10"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center mb-6 w-full max-w-[400px]">
        <h2 className="text-2xl font-black italic tracking-wider text-white flex items-center justify-center gap-3">
          <Activity className="w-6 h-6 text-red-500" />
          切磋模式 vs {playerName}
        </h2>
        <div className="flex justify-between mt-4 text-slate-400 font-mono text-xl bg-slate-900/50 p-3 rounded-2xl border border-white/5 shadow-inner">
          <span className="text-red-400 font-bold">AI: {score.ai}</span>
          <span className="text-slate-600">11分制</span>
          <span className="text-blue-400 font-bold">You: {score.user}</span>
        </div>
      </div>

      <div className="relative shadow-2xl rounded-lg overflow-hidden border-2 border-slate-700/50 bg-slate-900 touch-none">
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center flex-col z-10 backdrop-blur-sm">
            <Trophy className={`w-16 h-16 mb-4 ${winner.includes('赢') ? 'text-amber-400' : 'text-slate-500'}`} />
            <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-6">
              {winner}
            </h3>
            <button
              onClick={() => {
                setScore({ user: 0, ai: 0 });
                setGameOver(false);
                setWinner('');
              }}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors shadow-lg shadow-blue-500/20"
            >
              再来一局
            </button>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="w-full max-w-[400px] h-auto block select-none"
          style={{ touchAction: 'none' }}
        />
        <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none opacity-30 text-xs text-white">
          拖动或滑动控制底侧球拍 / 11分制
        </div>
      </div>
    </div>
  );
}
