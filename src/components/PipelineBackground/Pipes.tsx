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

      function draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // background fade
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "rgba(0, 200, 255, 0.5)";
        ctx.beginPath();

        for (let x = 0; x < width; x += 10) {
          const y = height / 2 + noise2D(x / 200, time / 200) * 100; // noisy line

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
        time += 2;
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
