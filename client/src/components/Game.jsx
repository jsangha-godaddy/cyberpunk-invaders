import { useEffect, useRef, useCallback } from 'react';

const W = 800;
const H = 600;
const PLAYER_W = 40;
const PLAYER_H = 20;
const PLAYER_SPEED = 4;
const BULLET_SPEED = 7;
const ALIEN_BULLET_SPEED = 3;
const ALIEN_COLS = 11;
const ALIEN_ROWS = 5;
const ALIEN_W = 36;
const ALIEN_H = 24;
const ALIEN_GAP_X = 12;
const ALIEN_GAP_Y = 14;
const SHIELD_COUNT = 4;

const COLORS = {
  player: '#00ffff',
  alien0: '#ff00ff',
  alien1: '#ff44ff',
  alien2: '#aa00ff',
  bullet: '#aaff00',
  alienBullet: '#ff4400',
  shield: '#00ff88',
  hud: '#00ffff',
};

function makeAliens(wave) {
  const aliens = [];
  const startX = 60;
  const startY = 80;
  for (let r = 0; r < ALIEN_ROWS; r++) {
    for (let c = 0; c < ALIEN_COLS; c++) {
      aliens.push({
        x: startX + c * (ALIEN_W + ALIEN_GAP_X),
        y: startY + r * (ALIEN_H + ALIEN_GAP_Y),
        row: r,
        alive: true,
      });
    }
  }
  return aliens;
}

function makeShields() {
  const shields = [];
  const totalW = W - 120;
  const gap = totalW / SHIELD_COUNT;
  for (let i = 0; i < SHIELD_COUNT; i++) {
    const sx = 60 + gap * i + gap / 2 - 24;
    const sy = H - 120;
    // 6x4 grid of blocks
    const blocks = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        blocks.push({ x: sx + c * 9, y: sy + r * 9, hp: 3 });
      }
    }
    shields.push(blocks);
  }
  return shields;
}

function drawPlayer(ctx, x, y) {
  ctx.shadowColor = COLORS.player;
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.player;
  // Body
  ctx.fillRect(x + 10, y + 8, PLAYER_W - 20, PLAYER_H - 8);
  // Nose
  ctx.fillRect(x + 18, y, 4, 10);
  // Wings
  ctx.fillRect(x, y + 12, 12, 8);
  ctx.fillRect(x + PLAYER_W - 12, y + 12, 12, 8);
  ctx.shadowBlur = 0;
}

function drawAlien(ctx, x, y, row, tick) {
  const frame = Math.floor(tick / 20) % 2;
  const color = row < 1 ? COLORS.alien2 : row < 3 ? COLORS.alien0 : COLORS.alien1;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  if (frame === 0) {
    // Pose A
    ctx.fillRect(x + 8, y, ALIEN_W - 16, ALIEN_H - 6);
    ctx.fillRect(x + 4, y + 4, 6, 8);
    ctx.fillRect(x + ALIEN_W - 10, y + 4, 6, 8);
    ctx.fillRect(x, y + 12, 6, 6);
    ctx.fillRect(x + ALIEN_W - 6, y + 12, 6, 6);
    ctx.fillRect(x + 10, y + ALIEN_H - 6, 5, 6);
    ctx.fillRect(x + ALIEN_W - 15, y + ALIEN_H - 6, 5, 6);
    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 11, y + 6, 4, 4);
    ctx.fillRect(x + ALIEN_W - 15, y + 6, 4, 4);
  } else {
    // Pose B
    ctx.fillRect(x + 8, y, ALIEN_W - 16, ALIEN_H - 6);
    ctx.fillRect(x + 2, y + 8, 8, 6);
    ctx.fillRect(x + ALIEN_W - 10, y + 8, 8, 6);
    ctx.fillRect(x + 6, y + ALIEN_H - 6, 5, 6);
    ctx.fillRect(x + ALIEN_W - 11, y + ALIEN_H - 6, 5, 6);
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 11, y + 6, 4, 4);
    ctx.fillRect(x + ALIEN_W - 15, y + 6, 4, 4);
  }
  ctx.shadowBlur = 0;
}

function drawBullet(ctx, x, y) {
  ctx.shadowColor = COLORS.bullet;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.bullet;
  ctx.fillRect(x - 2, y, 4, 12);
  ctx.shadowBlur = 0;
}

function drawAlienBullet(ctx, x, y) {
  ctx.shadowColor = COLORS.alienBullet;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLORS.alienBullet;
  ctx.fillRect(x - 2, y, 4, 10);
  ctx.shadowBlur = 0;
}

function drawShields(ctx, shields) {
  shields.forEach(blocks => {
    blocks.forEach(b => {
      if (b.hp <= 0) return;
      const alpha = b.hp / 3;
      ctx.shadowColor = COLORS.shield;
      ctx.shadowBlur = 4;
      ctx.fillStyle = `rgba(0,255,136,${alpha})`;
      ctx.fillRect(b.x, b.y, 8, 8);
    });
  });
  ctx.shadowBlur = 0;
}

function drawHUD(ctx, score, wave, lives) {
  ctx.font = '14px Share Tech Mono, monospace';
  ctx.fillStyle = COLORS.hud;
  ctx.shadowColor = COLORS.hud;
  ctx.shadowBlur = 6;
  ctx.fillText(`SCORE: ${score}`, 20, 30);
  ctx.fillText(`WAVE: ${wave}`, W / 2 - 40, 30);
  ctx.fillText(`LIVES: ${'▮'.repeat(lives)}`, W - 120, 30);
  ctx.shadowBlur = 0;

  // Bottom border line
  ctx.strokeStyle = 'rgba(0,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, H - 40);
  ctx.lineTo(W, H - 40);
  ctx.stroke();
}

export default function Game({ onGameOver }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const keysRef = useRef({});

  const initState = useCallback((wave = 1, score = 0) => ({
    player: { x: W / 2 - PLAYER_W / 2, y: H - 60 },
    aliens: makeAliens(wave),
    alienDir: 1,
    alienSpeedX: 0.6 + wave * 0.15,
    bullets: [],
    alienBullets: [],
    shields: makeShields(),
    score,
    wave,
    lives: 3,
    tick: 0,
    alienFireTimer: 0,
    alienFireInterval: Math.max(40, 100 - wave * 8),
    gameOver: false,
    won: false,
  }), []);

  const resetGame = useCallback(() => {
    stateRef.current = initState(1, 0);
  }, [initState]);

  useEffect(() => {
    resetGame();

    const onKey = (e) => {
      keysRef.current[e.code] = e.type === 'keydown';
      if (e.code === 'Space') e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let lastBulletTime = 0;

    function loop(ts) {
      const s = stateRef.current;
      if (!s || s.gameOver) return;

      const keys = keysRef.current;
      s.tick++;

      // Player movement
      if (keys['ArrowLeft'] || keys['KeyA']) s.player.x = Math.max(0, s.player.x - PLAYER_SPEED);
      if (keys['ArrowRight'] || keys['KeyD']) s.player.x = Math.min(W - PLAYER_W, s.player.x + PLAYER_SPEED);

      // Player shoot
      if ((keys['Space'] || keys['ArrowUp']) && ts - lastBulletTime > 300 && s.bullets.length < 3) {
        s.bullets.push({ x: s.player.x + PLAYER_W / 2, y: s.player.y });
        lastBulletTime = ts;
      }

      // Move player bullets
      s.bullets = s.bullets.filter(b => b.y > 0);
      s.bullets.forEach(b => b.y -= BULLET_SPEED);

      // Alien movement
      const alive = s.aliens.filter(a => a.alive);
      if (alive.length === 0) {
        // Next wave
        stateRef.current = initState(s.wave + 1, s.score);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const leftmost = Math.min(...alive.map(a => a.x));
      const rightmost = Math.max(...alive.map(a => a.x + ALIEN_W));

      s.aliens.forEach(a => a.alive && (a.x += s.alienDir * s.alienSpeedX));
      if (rightmost >= W - 10 && s.alienDir > 0) {
        s.alienDir = -1;
      } else if (leftmost <= 10 && s.alienDir < 0) {
        s.alienDir = 1;
      }

      // Alien fire
      s.alienFireTimer++;
      if (s.alienFireTimer >= s.alienFireInterval) {
        s.alienFireTimer = 0;
        const shooters = alive.filter(a => {
          const col = s.aliens.indexOf(a) % ALIEN_COLS;
          const colAliens = s.aliens.filter((x, i) => i % ALIEN_COLS === col && x.alive);
          return colAliens[colAliens.length - 1] === a;
        });
        if (shooters.length > 0) {
          const shooter = shooters[Math.floor(Math.random() * shooters.length)];
          s.alienBullets.push({ x: shooter.x + ALIEN_W / 2, y: shooter.y + ALIEN_H });
        }
      }

      // Move alien bullets
      s.alienBullets = s.alienBullets.filter(b => b.y < H);
      s.alienBullets.forEach(b => b.y += ALIEN_BULLET_SPEED);

      // Collision: player bullets vs aliens
      s.bullets = s.bullets.filter(bullet => {
        for (const alien of s.aliens) {
          if (!alien.alive) continue;
          if (bullet.x >= alien.x && bullet.x <= alien.x + ALIEN_W &&
              bullet.y >= alien.y && bullet.y <= alien.y + ALIEN_H) {
            alien.alive = false;
            const rowScore = alien.row < 1 ? 30 : alien.row < 3 ? 20 : 10;
            s.score += rowScore;
            return false;
          }
        }
        return true;
      });

      // Collision: player bullets vs shields
      s.bullets = s.bullets.filter(bullet => {
        for (const blocks of s.shields) {
          for (const b of blocks) {
            if (b.hp <= 0) continue;
            if (bullet.x >= b.x && bullet.x <= b.x + 8 &&
                bullet.y >= b.y && bullet.y <= b.y + 8) {
              b.hp--;
              return false;
            }
          }
        }
        return true;
      });

      // Collision: alien bullets vs shields
      s.alienBullets = s.alienBullets.filter(bullet => {
        for (const blocks of s.shields) {
          for (const b of blocks) {
            if (b.hp <= 0) continue;
            if (bullet.x >= b.x && bullet.x <= b.x + 8 &&
                bullet.y >= b.y && bullet.y <= b.y + 8) {
              b.hp--;
              return false;
            }
          }
        }
        return true;
      });

      // Collision: alien bullets vs player
      s.alienBullets = s.alienBullets.filter(bullet => {
        const px = s.player.x, py = s.player.y;
        if (bullet.x >= px && bullet.x <= px + PLAYER_W &&
            bullet.y >= py && bullet.y <= py + PLAYER_H) {
          s.lives--;
          if (s.lives <= 0) {
            s.gameOver = true;
            onGameOver(s.score);
            return false;
          }
          s.player.x = W / 2 - PLAYER_W / 2;
          return false;
        }
        return true;
      });

      // Draw
      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#0a0a1a');
      grad.addColorStop(1, '#050510');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137 + s.tick * 0.3) % W);
        const sy = ((i * 97) % (H - 60)) + 40;
        ctx.fillRect(sx, sy, 1, 1);
      }

      drawHUD(ctx, s.score, s.wave, s.lives);
      drawShields(ctx, s.shields);
      drawPlayer(ctx, s.player.x, s.player.y);
      s.aliens.forEach(a => { if (a.alive) drawAlien(ctx, a.x, a.y, a.row, s.tick); });
      s.bullets.forEach(b => drawBullet(ctx, b.x, b.y));
      s.alienBullets.forEach(b => drawAlienBullet(ctx, b.x, b.y));

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, [initState, onGameOver, resetGame]);

  return (
    <div className="game-wrapper">
      <canvas ref={canvasRef} width={W} height={H} />
    </div>
  );
}
