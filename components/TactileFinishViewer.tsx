"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

type FinishKey = "fosco" | "acetinado" | "semibrilho";

interface FinishDef {
  key: FinishKey;
  label: string;
  classe: string;
  reflexo: string;
  descricao: string;
}

const FINISHES: FinishDef[] = [
  {
    key: "fosco",
    label: "Fosco",
    classe: "luz-fosco",
    reflexo: "DIFUSÃO AMPLA",
    descricao:
      "Absorção suave da luz. Realça superfícies lisas sem evidenciar imperfeições.",
  },
  {
    key: "acetinado",
    label: "Acetinado",
    classe: "luz-acetinado",
    reflexo: "DIFUSÃO AVELUDADA",
    descricao:
      "Reflexo difuso e profundo. Equilibra limpeza visual e conforto de leitura da cor.",
  },
  {
    key: "semibrilho",
    label: "Semibrilho",
    classe: "luz-semibrilho",
    reflexo: "PONTO ESPECULAR NÍTIDO",
    descricao:
      "Ponto especular definido. Acentua textura e profundidade.",
  },
];

/**
 * Simulador tátil de acabamento ("Tactile Light Engine").
 * Mapeia o ponteiro para a posição de uma fonte de luz virtual e reage
 * fisicamente o reflexo de cada acabamento (CSS radial-gradients).
 */
export default function TactileFinishViewer() {
  const [finish, setFinish] = useState<FinishKey>("acetinado");
  const [light, setLight] = useState({ x: 50, y: 38 });
  const [moved, setMoved] = useState(false);
  const frame = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const el = areaRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      pending.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
      if (frame.current === null) {
        frame.current = requestAnimationFrame(() => {
          frame.current = null;
          if (pending.current) {
            setLight(pending.current);
            pending.current = null;
          }
        });
      }
      if (!moved) setMoved(true);
    },
    [moved],
  );

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const active = FINISHES.find((f) => f.key === finish) ?? FINISHES[1];
  const angulo = Math.abs(
    Math.round(Math.atan2(light.x - 50, 50 - light.y) * (180 / Math.PI)),
  );
  const luzVars = {
    "--lx": `${light.x}%`,
    "--ly": `${light.y}%`,
  } as CSSProperties;

  return (
    <div className="flex h-full flex-col gap-5">
      <div
        ref={areaRef}
        onPointerMove={onPointerMove}
        className="atmo relative aspect-[4/5] overflow-hidden rounded-lg border border-slate-200 shadow-e2 sm:aspect-[4/3.35]"
      >
        <img
          src="/images/textura-parede.jpg"
          alt="Parede texturizada pintada com sistema Maestria sob luz móvel"
          width={1200}
          height={900}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className={`luz-base ${active.classe}`}
          style={luzVars}
          aria-hidden="true"
        />
        <div className="vinheta-luz" style={luzVars} aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        {!moved && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-950/70 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white backdrop-blur">
            Mova o cursor sobre a superfície
          </span>
        )}
      </div>

      <div
        role="group"
        aria-label="Escolha o acabamento"
        className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200"
      >
        {FINISHES.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={finish === f.key}
            onClick={() => setFinish(f.key)}
            className={`px-3 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
              finish === f.key
                ? "bg-primary-950 text-white"
                : "bg-surface-bg text-text-secondary hover:bg-surface-alt"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <dl
        className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 font-mono sm:grid-cols-3"
        aria-live="polite"
      >
        <div className="bg-surface-bg p-4">
          <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Incidência
          </dt>
          <dd className="mt-1.5 text-sm text-text-primary tabular-nums">
            {angulo}°
          </dd>
        </div>
        <div className="bg-surface-bg p-4">
          <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Reflexo
          </dt>
          <dd className="mt-1.5 text-sm text-text-primary">{active.reflexo}</dd>
        </div>
        <div className="col-span-2 bg-surface-bg p-4 sm:col-span-1">
          <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
            Acabamento
          </dt>
          <dd className="mt-1.5 text-sm text-text-primary">{active.label}</dd>
        </div>
      </dl>

      <p className="text-sm leading-relaxed text-text-secondary">
        {active.descricao}
      </p>
    </div>
  );
}
