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
  const [isServing, setIsServing] = useState(false);
  const [currentServer, setCurrentServer] = useState<'user' | 'ai'>('user');
  const [showYellowCard, setShowYellowCard] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const canvasWidth = 400;
    const canvasHeight = 500;

    // Game state
    const paddleWidth = 80;
    const paddleHeight = 14;
    const ballRadius = 6;

    let userPaddle = {
      x: canvasWidth / 2 - paddleWidth / 2,
      y: canvasHeight - paddleHeight - 20,
      width: paddleWidth,
      height: paddleHeight,
      score: 0
    };

    let aiPaddle = {
      x: canvasWidth / 2 - paddleWidth / 2,
      y: 20,
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

    // Use refs for values needed in the animation loop to avoid dependency issues or stale state
    const gameStatus = {
      isServing: false,
      currentServer: 'user' as 'user' | 'ai',
      showYellowCard: false
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
    let isAimingServe = false;
    let serveTimeout: number;
    let serveStartTime = 0;

    const executeServe = (targetX?: number, targetY?: number) => {
      ball.speed = initialBallSpeed;
      if (gameStatus.currentServer === 'user') {
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
      gameStatus.isServing = false;
      setIsServing(false);
      gameStatus.showYellowCard = false;
      setShowYellowCard(false);
    };

    const serveBall = () => {
      gameStatus.isServing = true;
      setIsServing(true);
      ball.vx = 0;
      ball.vy = 0;
      gameStatus.showYellowCard = false;
      setShowYellowCard(false);

      if (userPaddle.score >= 10 && aiPaddle.score >= 10) {
        gameStatus.currentServer = (totalPoints % 2 === 0) ? 'user' : 'ai';
      } else {
        gameStatus.currentServer = (Math.floor(totalPoints / 2) % 2 === 0) ? 'user' : 'ai';
      }
      setCurrentServer(gameStatus.currentServer);

      if (gameStatus.currentServer === 'user') {
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

    const drawPaddle = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.save();
      
      // Draw paddle head (rounded rect)
      ctx.fillStyle = color;
      const radius = h / 2;
      
      ctx.beginPath();
      if ((ctx as any).roundRect) {
        (ctx as any).roundRect(x, y, w, h, radius);
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.fill();
      
      // Stronger outline for visibility
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add a subtle sheen to make it look like a paddle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(x, y, w, h / 2);
      
      ctx.restore();
    };

    const drawText = (text: string, x: number, y: number, color: string, align: CanvasTextAlign = 'center', baseline: CanvasTextBaseline = 'middle', fontSize: number = 36) => {
      ctx.fillStyle = color;
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = align;
      ctx.textBaseline = baseline;
      ctx.fillText(text, x, y);
    };

    const update = () => {
      if (gameStatus.isServing) {
        if (gameStatus.currentServer === 'user') {
          ball.x = userPaddle.x + userPaddle.width / 2;
          ball.y = userPaddle.y - ballRadius - 2;
          if (Date.now() - serveStartTime > 5000) {
            gameStatus.showYellowCard = true;
            setShowYellowCard(true);
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
      drawPaddle(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, '#3b82f6'); // blue-500
      drawPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, '#ef4444'); // red-500

      // Draw Ball
      drawCircle(ball.x, ball.y, ballRadius, ball.color);

      // Draw Scores faintly
      drawText(aiPaddle.score.toString(), canvasWidth / 2, canvasHeight / 4, 'rgba(255,255,255,0.1)');
      drawText(userPaddle.score.toString(), canvasWidth / 2, 3 * canvasHeight / 4, 'rgba(255,255,255,0.1)');

      // Draw Serve Prompt / Yellow Card
      if (gameStatus.isServing && gameStatus.currentServer === 'user') {
        if (gameStatus.showYellowCard) {
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
    const handlePointerMove = (e: PointerEvent) => {
      if (isAimingServe || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      let newX = (e.clientX - rect.left) * scaleX - userPaddle.width / 2;
      userPaddle.x = Math.max(0, Math.min(canvasWidth - userPaddle.width, newX));
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (gameStatus.isServing && gameStatus.currentServer === 'user') {
        isAimingServe = true;
      }
      // Enable global tracking during interaction
      window.addEventListener('pointermove', handlePointerMove);
    };

    const handlePointerUp = (e: PointerEvent) => {
      window.removeEventListener('pointermove', handlePointerMove);
      
      if (gameStatus.isServing && gameStatus.currentServer === 'user' && isAimingServe) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        let targetY = (e.clientY - rect.top) * scaleY;
        let targetX = (e.clientX - rect.left) * scaleX;

        executeServe(targetX, Math.min(targetY, userPaddle.y - ballRadius - 10));
      }
      isAimingServe = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown as EventListener);
    window.addEventListener('pointerup', handlePointerUp as EventListener);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(serveTimeout);
      canvas.removeEventListener('pointerdown', handlePointerDown as EventListener);
      window.removeEventListener('pointerup', handlePointerUp as EventListener);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [playerKey, gameOver, playerName]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020617]/98 flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-xl">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={onClose}
          className="p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full text-slate-200 transition-colors border border-white/10 shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center mb-4 sm:mb-6 w-full max-w-[400px] px-2">
        <h2 className="text-xl sm:text-2xl font-black italic tracking-wider text-white flex items-center justify-center gap-3">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-pulse" />
          切磋模式 vs {playerName}
        </h2>
        <div className="flex justify-between mt-3 sm:mt-4 text-slate-400 font-mono text-lg sm:text-xl bg-slate-900/80 p-2 sm:p-3 rounded-2xl border border-white/5 shadow-2xl">
          <div className="flex flex-col items-start px-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">AI Score</span>
            <span className="text-red-500 font-black">{score.ai}</span>
          </div>
          <div className="flex items-center text-slate-600 text-xs sm:text-sm">
            11 POINTS
          </div>
          <div className="flex flex-col items-end px-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Your Score</span>
            <span className="text-blue-500 font-black">{score.user}</span>
          </div>
        </div>
      </div>

      <div className="relative shadow-[0_0_50px_rgba(30,58,138,0.3)] rounded-2xl overflow-hidden border-2 border-slate-700/50 bg-black touch-none w-full max-w-[400px] aspect-[4/5] flex items-center justify-center">
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 flex items-center justify-center flex-col z-20 backdrop-blur-md p-6 text-center">
            <Trophy className={`w-16 h-16 mb-4 ${winner.includes('赢') ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'text-slate-500'}`} />
            <h3 className="text-3xl font-black bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-2 italic">
              {winner}
            </h3>
            <p className="text-slate-400 text-sm mb-8">
              {winner.includes('赢') ? `成功战胜了顶级国乒冠军 ${playerName}！` : `惜败于 ${playerName}，再接再厉！`}
            </p>
            <button
              onClick={() => {
                setScore({ user: 0, ai: 0 });
                setGameOver(false);
                setWinner('');
              }}
              className="w-full max-w-[200px] px-8 py-4 bg-white text-black hover:bg-blue-50 font-black rounded-xl transition-all shadow-xl active:scale-95"
            >
              继续切磋
            </button>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          className="w-full h-full block select-none touch-none"
        />
        {!gameOver && !isServing && (
          <div className="absolute top-4 left-0 w-full text-center pointer-events-none opacity-20 text-[10px] text-white tracking-[0.2em] font-mono">
            PONG MASTER AI SYSTEM v1.0
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-1 opacity-40 pointer-events-none">
        <p className="text-[10px] text-white font-medium">左右滑动底端控制球拍</p>
        <p className="text-[8px] text-slate-500 uppercase tracking-tighter">Mobile Optimized Interface</p>
      </div>
    </div>
  );
}
