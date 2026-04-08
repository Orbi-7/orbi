"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

// One cube cut into 2x2x2 = 8 puzzle pieces - visible gaps + accent edges
const UNIT = 22;
const GAP = 8;

// 2x2x2 grid positions: (x,y,z) in 0..1, converted to translate3d with gap
const PUZZLE_PIECES = [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
  [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
];

// Dark teal palette: no black, varied face tints
const EDGE = "2px solid rgba(0, 211, 149, 0.9)";
const FACE_FRONT = "#0d1f1c";
const FACE_BACK = "#0f2522";
const FACE_SIDE = "#112a26";
const FACE_TOP = "#0e221f";
const FACE_BOTTOM = "#0b1c19";

function PuzzlePiece({ pos, scale }: { pos: [number, number, number]; scale: number }) {
  const s = UNIT * scale;
  const gap = GAP * scale;
  const [gx, gy, gz] = pos;
  const step = s + gap;
  const x = (gx - 0.5) * step;
  const y = (gy - 0.5) * step;
  const z = (gz - 0.5) * step;
  return (
    <div
      className="absolute"
      style={{
        width: s,
        height: s,
        left: "50%",
        top: "50%",
        marginLeft: -s / 2,
        marginTop: -s / 2,
        transformStyle: "preserve-3d",
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
      }}
    >
      <div className="absolute left-0 top-0" style={{ width: s, height: s, background: FACE_FRONT, border: EDGE, transform: `translateZ(${s / 2}px)` }} />
      <div className="absolute left-0 top-0" style={{ width: s, height: s, background: FACE_BACK, border: EDGE, transform: `rotateY(180deg) translateZ(${s / 2}px)` }} />
      <div className="absolute left-0 top-0" style={{ width: s, height: s, background: FACE_SIDE, border: EDGE, transform: `rotateY(90deg) translateZ(${s / 2}px)` }} />
      <div className="absolute left-0 top-0" style={{ width: s, height: s, background: FACE_SIDE, border: EDGE, transform: `rotateY(-90deg) translateZ(${s / 2}px)` }} />
      <div className="absolute left-0 top-0" style={{ width: s, height: s, background: FACE_TOP, border: EDGE, transform: `rotateX(90deg) translateZ(${s / 2}px)` }} />
      <div className="absolute left-0 top-0" style={{ width: s, height: s, background: FACE_BOTTOM, border: EDGE, transform: `rotateX(-90deg) translateZ(${s / 2}px)` }} />
    </div>
  );
}

interface BrokenCubeLogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  standalone?: boolean;
}

export function BrokenCubeLogo({ className = "", href = "/", size = "md", interactive, standalone }: BrokenCubeLogoProps) {
  const isInteractive = interactive ?? size === "lg";
  const [rotation, setRotation] = useState({ x: 18, y: 38 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const scaleMap = { sm: 0.4, md: 0.55, lg: 0.9 };
  const scale = scaleMap[size];
  const containerSize = (UNIT * 2 + GAP * 2) * scale * 1.5;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isInteractive || !isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      setRotation((r) => ({ x: r.x + dy * 0.5, y: r.y + dx * 0.5 }));
    },
    [isInteractive]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isInteractive) return;
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    },
    [isInteractive]
  );

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);
  const handleMouseLeave = useCallback(() => { isDragging.current = false; }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isInteractive || e.touches.length !== 1) return;
      isDragging.current = true;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    [isInteractive]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - lastMouse.current.x;
      const dy = e.touches[0].clientY - lastMouse.current.y;
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setRotation((r) => ({ x: r.x + dy * 0.5, y: r.y + dx * 0.5 }));
    },
    []
  );

  const handleTouchEnd = useCallback(() => { isDragging.current = false; }, []);

  const cube = (
    <div
      className={`inline-flex items-center ${standalone ? "flex-col gap-3" : "gap-2"} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`flex items-center justify-center ${isInteractive ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={{ width: containerSize, height: containerSize, perspective: "500px", perspectiveOrigin: "50% 50%" }}
      >
        <div
          style={{
            width: containerSize,
            height: containerSize,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {PUZZLE_PIECES.map((pos, i) => (
            <PuzzlePiece key={i} pos={pos as [number, number, number]} scale={scale} />
          ))}
        </div>
      </div>
      {!standalone && (
        <span className={cn(
          "font-serif font-bold tracking-tight text-[var(--foreground)]",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-lg"
        )}>
          ORBI
        </span>
      )}
    </div>
  );

  return href ? <Link href={href}>{cube}</Link> : cube;
}
