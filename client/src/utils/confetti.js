// High-performance canvas confetti engine for Café Aroma celebrations
// Lightweight, responsive, and automatically cleans up after animation

export const createCelebrationConfetti = (canvas, options = {}) => {
  if (!canvas) return { stop: () => {} };

  const ctx = canvas.getContext('2d');
  if (!ctx) return { stop: () => {} };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return { stop: () => {} };
  }

  // Setup canvas dimensions
  const updateSize = () => {
    canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
  };
  updateSize();

  const colors = options.colors || [
    '#C99A5B', // Cafe Gold
    '#E5B869', // Bright Gold
    '#B8794A', // Caramel
    '#6F4532', // Rich Coffee
    '#F7F0E6', // Cream
    '#E8D8C3', // Warm Beige
    '#E15B64', // Rose Berry
    '#F47E60', // Tangerine
    '#F8B26A', // Peach Gold
    '#67B7A4', // Fresh Mint
  ];

  const count = options.count || 120;
  const particles = [];
  const originX = options.originX !== undefined ? options.originX : canvas.width / 2;
  const originY = options.originY !== undefined ? options.originY : canvas.height / 2;

  // Shapes: 'rect', 'circle', 'ribbon', 'star'
  const shapes = ['rect', 'rect', 'circle', 'ribbon', 'star'];

  for (let i = 0; i < count; i++) {
    const angle = options.isMini
      ? Math.random() * Math.PI * 2
      : (Math.random() * Math.PI) + Math.PI; // Upward blast for gift box
    const speed = options.isMini
      ? 2 + Math.random() * 6
      : 5 + Math.random() * 12;

    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
      vy: Math.sin(angle) * speed - (options.isMini ? 1 : 4),
      size: 4 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      gravity: 0.18 + Math.random() * 0.1,
      drag: 0.96 + Math.random() * 0.02,
      opacity: 1,
      fadeSpeed: 0.007 + Math.random() * 0.012,
      ribbonLength: 10 + Math.random() * 15,
    });
  }

  let animationFrameId;
  let active = true;

  const render = () => {
    if (!active) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let aliveCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity <= 0.01) continue;

      aliveCount++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.fadeSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'ribbon') {
        ctx.fillRect(-p.size / 3, -p.ribbonLength / 2, p.size / 1.5, p.ribbonLength);
      } else if (p.shape === 'star') {
        drawStar(ctx, 0, 0, 4, p.size, p.size / 2);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.75);
      }

      ctx.restore();
    }

    if (aliveCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      active = false;
    }
  };

  animationFrameId = requestAnimationFrame(render);

  return {
    stop: () => {
      active = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
};

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
