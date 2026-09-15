"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Color } from "@/types/catalog";
import { setCorAtiva, setCorSessao } from "@/lib/atmosphere";

interface ColorSelectorProps {
  colors: Color[];
  /** Código da cor ativa (controlado pelo pai). */
  value: string;
  onChange: (code: string) => void;
  /** Contexto para eventos/áreas de anúncio. */
  ariaLabel?: string;
}

/**
 * Seletor de cores:
 * - role="radiogroup" com navegação por setas (roving tabindex);
 * - painel com código, hexadecimal, LRV e referência;
 * - botão de copiar HEX com toast de confirmação;
 * - sincroniza o tom ativo em sessionStorage e na variável CSS global
 *   (--cor-ativa) que dirige a atmosfera cromática da página.
 */
export default function ColorSelector({
  colors,
  value,
  onChange,
  ariaLabel = "Cores disponíveis",
}: ColorSelectorProps) {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const refMap = useRef(new Map<string, HTMLButtonElement>());

  const active =
    colors.find((c) => c.code === value) ?? colors[0];

  // Sincronização da atmosfera cromática + sessão
  useEffect(() => {
    if (!active) return;
    setCorAtiva(active.hex);
    setCorSessao(active.code, active.hex);
  }, [active]);

  useEffect(
    () => () => {
      if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  if (!active) return null;

  const select = (code: string, focus = false) => {
    onChange(code);
    if (focus) {
      refMap.current.get(code)?.focus();
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = colors.findIndex((c) => c.code === value);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = (idx + 1) % colors.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = (idx - 1 + colors.length) % colors.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = colors.length - 1;
    }
    if (next >= 0) {
      e.preventDefault();
      select(colors[next].code, true);
    }
  };

  const copiarHex = async () => {
    try {
      await navigator.clipboard.writeText(active.hex.toUpperCase());
      setToast(`HEX ${active.hex.toUpperCase()} copiado`);
    } catch {
      setToast(`HEX ${active.hex.toUpperCase()}`);
    }
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2500);
  };

  return (
    <div>
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        onKeyDown={onKey}
        className="flex flex-wrap gap-3"
      >
        {colors.map((c) => {
          const checked = c.code === value;
          return (
            <button
              key={c.code}
              ref={(el) => {
                if (el) refMap.current.set(c.code, el);
                else refMap.current.delete(c.code);
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              aria-label={`${c.name}, código ${c.code}, hexadecimal ${c.hex}`}
              onClick={() => select(c.code)}
              className={`relative size-10 rounded-full border transition-transform duration-150 ${
                checked
                  ? "scale-105 ring-2 ring-slate-800 ring-offset-2 ring-offset-surface-bg"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: c.hex, borderColor: "rgba(16,24,40,0.15)" }}
            >
              {checked && (
                <Check
                  className={`absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 ${
                    c.lrv >= 50 ? "text-slate-800" : "text-white"
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-lg border border-slate-200 bg-surface-bg p-4">
        <span
          className="size-12 shrink-0 rounded-md border"
          style={{
            backgroundColor: active.hex,
            borderColor: "rgba(16,24,40,0.15)",
          }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-text-primary">
            {active.name}
          </p>
          <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-[0.12em] text-slate-400 tabular-nums">
            {active.code} · {active.hex.toUpperCase()} · LRV {active.lrv} ·{" "}
            {active.reference}
          </p>
        </div>
        <button
          type="button"
          onClick={copiarHex}
          aria-label={`Copiar hexadecimal da cor ${active.name}`}
          className="flex size-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-text-secondary transition-colors hover:border-primary-300 hover:text-primary-700"
        >
          <Copy className="size-4" aria-hidden="true" />
        </button>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-primary-950 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-white shadow-e3"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
