import React, { useEffect, useRef } from 'react';

interface GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isHub: boolean;
  label?: string;
  color: string;
  glowColor: string;
  pulse: number;
  pulseSpeed: number;
}

interface MousePosition {
  x: number | null;
  y: number | null;
  active: boolean;
}

const HUB_LABELS: readonly string[] = [
  'Vault',
  'REST API',
  'Whisper',
  'ReAct',
  'Agent',
  'Canvas',
];

export const ObsidianGraphBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const mouse: MousePosition = {
      x: null,
      y: null,
      active: false,
    };

    const getTargetCounts = (w: number) => {
      const isMobile = w < 768;
      return {
        nodeCount: isMobile ? 70 : 100,
        hubCount: isMobile ? 5 : 8,
      };
    };

    const createNodes = (w: number, h: number): GraphNode[] => {
      const { nodeCount, hubCount } = getTargetCounts(w);
      const newNodes: GraphNode[] = [];

      for (let i = 0; i < nodeCount; i++) {
        const isHub = i < hubCount;
        const angle = Math.random() * Math.PI * 2;
        // Slow, smooth drift with micro-velocities 0.15–0.4 px/frame
        const speed = 0.15 + Math.random() * 0.25;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        const isPurple = Math.random() > 0.45;
        const glowColor = isPurple ? '#a855f7' : '#06b6d4';
        const color = isHub ? glowColor : 'rgba(148, 163, 184, 0.8)'; // slate-400 / zinc-500, alpha ~ 0.4

        newNodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx,
          vy,
          // Hubs: 3.5–4.5px, normal nodes: 1.5–2px
          radius: isHub ? 5.5 + Math.random() * 1.0 : 2.5 + Math.random() * 0.5,
          isHub,
          label: isHub ? HUB_LABELS[i % HUB_LABELS.length] : undefined,
          color,
          glowColor,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.015,
        });
      }

      return newNodes;
    };

    let nodes = createNodes(width, height);

    const resizeCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      const wasMobile = width < 768;
      const isMobile = newWidth < 768;

      width = newWidth;
      height = newHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Re-initialize nodes on desktop/mobile breakpoint transition
      if (wasMobile !== isMobile || nodes.length === 0) {
        nodes = createNodes(width, height);
      } else {
        // Keep existing nodes within bounds
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          if (n.x > width) n.x = Math.random() * width;
          if (n.y > height) n.y = Math.random() * height;
        }
      }
    };

    resizeCanvas();

    const CONNECTION_DIST = 130; // 120–140px
    const MOUSE_REPULSION_RADIUS = 130;
    const MOUSE_THREAD_DIST = 160;

    const render = () => {
      // Отключать вычисления при скрытии вкладки (document.hidden)
      if (!document.hidden) {
        ctx.clearRect(0, 0, width, height);

        // 1. Update nodes position & mouse repulsion
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          node.x += node.vx;
          node.y += node.vy;

          // Boundary bounce
          if (node.x < 10) {
            node.x = 10;
            node.vx *= -1;
          } else if (node.x > width - 10) {
            node.x = width - 10;
            node.vx *= -1;
          }

          if (node.y < 10) {
            node.y = 10;
            node.vy *= -1;
          } else if (node.y > height - 10) {
            node.y = height - 10;
            node.vy *= -1;
          }

          node.pulse += node.pulseSpeed;

          // Mouse repulsion in radius 130px
          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.hypot(dx, dy);

            if (dist < MOUSE_REPULSION_RADIUS && dist > 0) {
              const force = (MOUSE_REPULSION_RADIUS - dist) / MOUSE_REPULSION_RADIUS;
              node.x -= (dx / dist) * force * 1.5;
              node.y -= (dy / dist) * force * 1.5;
            }
          }
        }

        // 2. Draw connections between nodes (Edges)
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.hypot(dx, dy);

            if (dist < CONNECTION_DIST) {
              // Smooth falloff to 0, max opacity <= 0.22
              const alpha = (1 - dist / CONNECTION_DIST) * 1;
              const isHubConnection = nodes[i].isHub || nodes[j].isHub;

              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);

              if (isHubConnection) {
                ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                ctx.lineWidth = 1.0;
              } else {
                ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.8})`;
                ctx.lineWidth = 0.7;
              }
              ctx.stroke();
            }
          }
        }

        // 3. Draw mouse threads to 2–4 nearest nodes
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const mx = mouse.x;
          const my = mouse.y;

          interface NearbyNode {
            node: GraphNode;
            dist: number;
          }

          const nearbyNodes: NearbyNode[] = [];
          for (let i = 0; i < nodes.length; i++) {
            const d = Math.hypot(nodes[i].x - mx, nodes[i].y - my);
            if (d < MOUSE_THREAD_DIST) {
              nearbyNodes.push({ node: nodes[i], dist: d });
            }
          }

          nearbyNodes.sort((a, b) => a.dist - b.dist);
          const threadCount = Math.min(nearbyNodes.length, 5); // 2–4 nearest nodes

          for (let k = 0; k < threadCount; k++) {
            const { node, dist } = nearbyNodes[k];
            const mAlpha = (1 - dist / MOUSE_THREAD_DIST) * 0.8;

            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${mAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // 4. Draw nodes (hubs and regular dots)
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const pulseFactor = Math.sin(node.pulse) * 0.15 + 0.95;
          const currentRadius = node.radius * pulseFactor;

          if (node.isHub) {
            // Ambient soft halo
            ctx.beginPath();
            ctx.arc(node.x, node.y, currentRadius * 2.8, 0, Math.PI * 2);
            ctx.fillStyle =
              node.glowColor === '#a855f7'
                ? 'rgba(168, 85, 247, 0.08)'
                : 'rgba(6, 182, 212, 0.08)';
            ctx.fill();

            // Neon glowing hub body
            ctx.save();
            ctx.beginPath();
            ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.shadowColor = node.glowColor;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();

            // Text label near hub
            if (node.label) {
              ctx.font = '10px "JetBrains Mono", monospace';
              ctx.fillStyle = 'rgba(203, 213, 225, 0.90)';
              ctx.fillText(node.label, node.x + currentRadius + 5, node.y + 3);
            }
          } else {
            // Normal small dot
            ctx.beginPath();
            ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      resizeCanvas();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = null;
      mouse.y = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#09090b]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#09090b_85%)] pointer-events-none" />
    </div>
  );
};

export default ObsidianGraphBackground;
