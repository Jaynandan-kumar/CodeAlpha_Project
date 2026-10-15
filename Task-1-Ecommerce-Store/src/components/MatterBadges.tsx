import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const BADGES = [
  { text: '📱 iPhone 15', color: '#6c5ce7' },
  { text: '🎧 Sony XM5', color: '#00cec9' },
  { text: '💻 MacBook', color: '#a29bfe' },
  { text: '⌚ Watch S9', color: '#fd79a8' },
  { text: '📷 Canon R50', color: '#00b894' },
  { text: '🖱️ MX Master', color: '#e17055' },
  { text: '🔊 Bose Flex', color: '#0984e3' },
  { text: '📚 Kindle', color: '#fdcb6e' },
];

export default function MatterBadges() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    // Disable on mobile or reduced motion
    if (window.innerWidth < 768 || motionQuery.matches) {
      setIsEnabled(false);
      return;
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsEnabled(false);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    const handleResize = () => {
      if (window.innerWidth < 768) setIsEnabled(false);
    };
    window.addEventListener('resize', handleResize);

    if (!canvasRef.current || !isEnabled) return;

    const canvas = canvasRef.current;
    const width = canvas.parentElement?.clientWidth || 800;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    // Engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.3, scale: 0.001 },
    });
    engineRef.current = engine;

    // Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Boundaries
    const wallThickness = 50;
    const walls = [
      Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
      Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, { isStatic: true }),
    ];
    Matter.World.add(engine.world, walls);

    // Badge bodies
    const bodies = BADGES.map((badge, i) => {
      const x = 80 + (i % 4) * (width / 5);
      const y = 30 + Math.floor(i / 4) * 60;
      const size = 40 + Math.random() * 15;
      const body = Matter.Bodies.circle(x, y, size / 2, {
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.02,
        render: { fillStyle: badge.color },
      });
      (body as any).badgeData = badge;
      (body as any).radius = size / 2;
      return body;
    });
    Matter.World.add(engine.world, bodies);

    // Mouse interaction
    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.World.add(engine.world, mouseConstraint);

    // Custom renderer (canvas 2D)
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      bodies.forEach((body) => {
        const data = (body as any).badgeData;
        const radius = (body as any).radius;
        const pos = body.position;

        // Draw circle background
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = data.color + '22';
        ctx.fill();
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.fillStyle = data.color;
        ctx.font = 'bold 11px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(data.text, pos.x, pos.y);
      });

      requestAnimationFrame(render);
    };
    render();

    // Cleanup
    return () => {
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      // Matter.js cleanup - remove event listeners
      try {
        Matter.Events.off(engine, 'beforeUpdate');
      } catch (e) { /* ignore */ }
      handleResize && window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
      engineRef.current = null;
      runnerRef.current = null;
    };
  }, [isEnabled]);

  if (!isEnabled || prefersReducedMotion) {
    // Fallback: static grid
    return (
      <div className="matter-fallback">
        {BADGES.map((badge, i) => (
          <div key={i} className="badge-static" style={{ borderColor: badge.color, color: badge.color }}>
            {badge.text}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="matter-container">
      <canvas
        ref={canvasRef}
        className="matter-canvas"
        aria-label="Interactive product badges with physics"
        role="img"
      />
      <p className="matter-hint">✨ Drag the badges around!</p>
    </div>
  );
}
