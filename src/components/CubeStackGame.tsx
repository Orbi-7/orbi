"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const LANES = 3;
const LANE_KEYS = ["a", "s", "d"];
const HIT_ZONE = 0.88;
const HIT_WINDOW = 0.05; // symmetric precision window around hit zone
const SPAWN_INTERVAL = 800;
const MIN_SPAWN_GAP = 600; // min ms between spawns
const BASE_SPEED = 0.4;

interface Cube {
  id: number;
  lane: number;
  progress: number;
}

export function CubeStackGame() {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [speed, setSpeed] = useState(BASE_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const nextId = useRef(0);
  const lastSpawn = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTick = useRef(0);
  const scoreRef = useRef(score);
  const speedRef = useRef(speed);
  scoreRef.current = score;
  speedRef.current = speed;

  const restart = useCallback(() => {
    setCubes([]);
    setScore(0);
    setCombo(0);
    setSpeed(BASE_SPEED);
    setGameOver(false);
    setStarted(false);
    lastSpawn.current = 0;
  }, []);

  const startGame = useCallback(() => {
    setStarted(true);
    setGameOver(false);
    lastSpawn.current = 0;
  }, []);

  const cubesRef = useRef<Cube[]>([]);
  cubesRef.current = cubes;

  const spawnCube = useCallback(() => {
    const lane = Math.floor(Math.random() * LANES);
    setCubes((c) => [...c, { id: nextId.current++, lane, progress: 0 }]);
    lastSpawn.current = Date.now();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key.toLowerCase() === "enter") {
        e.preventDefault();
        if (gameOver) {
          restart();
          startGame();
          return;
        }
        if (!started) {
          startGame();
          return;
        }
      }
      if (gameOver || !started) return;
      const key = e.key.toLowerCase();
      const laneIdx = LANE_KEYS.indexOf(key);
      if (laneIdx === -1) return;
      e.preventDefault();

      setCubes((cubes) => {
        const hit = cubes.find(
          (cb) =>
            cb.lane === laneIdx &&
            cb.progress >= HIT_ZONE - HIT_WINDOW &&
            cb.progress <= HIT_ZONE + HIT_WINDOW
        );
        if (hit) {
          setScore((s) => s + 1 + Math.min(combo, 5));
          setCombo((c) => c + 1);
          const remaining = cubes.filter((cb) => cb.id !== hit.id);
          const newLane = Math.floor(Math.random() * LANES);
          const newCube: Cube = { id: nextId.current++, lane: newLane, progress: 0 };
          lastSpawn.current = Date.now();
          return [...remaining, newCube];
        }
        setCombo(0);
        return cubes;
      });
    },
    [gameOver, combo, started, startGame]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || !started) return undefined;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTick.current) / 1000, 0.1);
      lastTick.current = now;

      const currentCubes = cubesRef.current;
      const currentScore = scoreRef.current;
      const currentSpeed = speedRef.current;
      const anyCubePastHalf = currentCubes.some((c) => c.progress > 0.4);
      const spawnInterval = Math.max(MIN_SPAWN_GAP, SPAWN_INTERVAL / (1 + currentScore * 0.015));
      const canSpawn =
        (currentCubes.length === 0 || anyCubePastHalf) &&
        now - lastSpawn.current > spawnInterval;
      if (canSpawn) {
        spawnCube();
      }

      setSpeed((s) => Math.min(BASE_SPEED + currentScore * 0.008, 1.2));
      setCubes((cubes) => {
        const updated = cubes
          .map((c) => ({ ...c, progress: c.progress + currentSpeed * dt }))
          .filter((c) => {
            if (c.progress > 1.1) {
              setGameOver(true);
              return false;
            }
            return true;
          });
        return updated;
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame((now) => {
      lastTick.current = now;
      // leave lastSpawn at 0 so first cube spawns right away
      tick(now);
    });
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [gameOver, started, spawnCube]);

  return (
    <div className="mt-16 flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-[var(--accent)]/20 px-4 py-2 font-bold text-[var(--accent)]">
          Score: {score}
        </span>
        {combo > 0 && started && (
          <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-medium text-[var(--accent)]">
            Combo x{combo}
          </span>
        )}
        <span className="text-sm text-[var(--muted-foreground)]">
          Press <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-xs">A</kbd>{" "}
          <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-xs">S</kbd>{" "}
          <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-xs">D</kbd> when cubes hit the line
        </span>
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)]/30"
        style={{ width: 320, height: 320 }}
        role="button"
        tabIndex={0}
        onClick={() => !started && !gameOver && startGame()}
        onKeyDown={(e) => { if (!started && !gameOver && e.key === "Enter") { e.preventDefault(); startGame(); } }}
      >
        {/* Hit zone line */}
        <div
          className="absolute left-0 right-0 h-1 bg-[var(--accent)]/70"
          style={{ top: `${HIT_ZONE * 100}%`, transform: "translateY(-50%)" }}
        />

        {/* 3 lanes */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: LANES }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-[var(--border)]/50 last:border-r-0"
              style={{ minWidth: 0 }}
            />
          ))}
        </div>

        {/* Cubes */}
        {cubes.map((c) => (
          <div
            key={c.id}
            className="absolute rounded transition-none"
            style={{
              width: 80,
              height: 36,
              left: (c.lane + 0.5) * (320 / LANES),
              top: `${c.progress * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="h-full w-full rounded bg-[#0a0a0a] shadow-lg" style={{ border: "2px solid #1a1a1a" }} />
          </div>
        ))}

        {/* Start / Play again overlay */}
        {(!started || gameOver) && (
          <div
            role="button"
            tabIndex={0}
            className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-xl bg-[var(--background)]/95"
            onClick={() => { if (gameOver) { restart(); startGame(); } else { startGame(); } }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (gameOver) { restart(); startGame(); } else { startGame(); } } }}
          >
            {gameOver ? (
              <>
                <p className="font-semibold text-[var(--foreground)]">Game over!</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">Final score: {score}</p>
                <p className="mt-3 text-sm font-medium text-[var(--foreground)]">Press Enter to play again</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium text-[var(--foreground)]">Press Enter to start</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">or click the card</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
