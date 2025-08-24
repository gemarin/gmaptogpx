import React, { useRef, useEffect } from "react";

// Simplex noise is used in the original Codrops demo
import { createNoise2D } from "simplex-noise";

export default function PipelineBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const noise2D = createNoise2D();
      let time = 0;

      function resize() {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
      window.addEventListener("resize", resize);

      // Initialize particles
      const PARTICLE_COUNT = 200;
      const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 100 + 50,
        vx: 0,
        vy: 0,
        hue: Math.random() * 60 + 200, // Range from 200-260 (blues)
      }));

      function draw() {
        if (!ctx) return;

        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, width, height);

        // Update and draw particles
        particles.forEach((p) => {
          // Use noise to create flowing movement
          const angle =
            noise2D(p.x / 1000, p.y / 1000 + time / 1500) * Math.PI * 2;
          const speed = 0.15;

          // Update velocity with smooth acceleration
          p.vx = p.vx * 0.95 + Math.cos(angle) * speed;
          p.vy = p.vy * 0.95 + Math.sin(angle) * speed;

          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Wrap around edges
          if (p.x < -p.radius) p.x = width + p.radius;
          if (p.x > width + p.radius) p.x = -p.radius;
          if (p.y < -p.radius) p.y = height + p.radius;
          if (p.y > height + p.radius) p.y = -p.radius;

          // Draw coalescing particle with shifted gradient
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            p.radius * 0.25, // Inner radius at 25% of particle radius
            p.x,
            p.y,
            p.radius
          );
          gradient.addColorStop(0, `hsla(${p.hue}, 100%, 20%, 0.4)`);
          gradient.addColorStop(0.1, `hsla(${p.hue}, 100%, 17%, 0.3)`);
          gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 12%, 0.2)`);
          gradient.addColorStop(1, `hsla(${p.hue}, 100%, 10%, 0)`);

          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        time += 1;
        requestAnimationFrame(draw);
      }

      draw();

      return () => {
        window.removeEventListener("resize", resize);
      };
    } else {
      console.error("Canvas not found");
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
