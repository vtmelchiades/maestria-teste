"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Minus, Plus } from "lucide-react";
import type { Product, Surface } from "@/types/catalog";
import {
  calcular,
  validarInput,
  LIMITES,
  PERDA_PADRAO,
} from "@/lib/calculator";
import { formatarLitros, mensagemOrcamento, urlWhatsApp } from "@/lib/conversion";

const SURFACES: { value: Surface; label: string }[] = [
  { value: "alvenaria", label: "Alvenaria" },
  { value: "concreto", label: "Concreto" },
  { value: "gesso", label: "Gesso" },
  { value: "madeira", label: "Madeira" },
  { value: "metal", label: "Metal" },
  { value: "asfalto", label: "Asfalto" },
];

type CalcOutput =
  | { estado: "vazio" }
  | { estado: "erro"; mensagem: string }
  | {
      estado: "ok";
      litros: number;
      embalagens: { size: string; count: number }[];
      fornecido: number;
      sobra: number;
    };

interface YieldCalculatorProps {
  /** Produto fixo (PDP): trava consumo, demãos padrão e formatos. */
  produto?: Product;
  /** Seletor de produto (home): calcula para a linha escolhida. */
  produtos?: Product[];
  /** Modo compacto (home): esconde seletor de superfície e rótulos auxiliares. */
  compact?: boolean;
  /** Tema visual: console claro (PDP) ou sobre banda escura (home). */
  tema?: "claro" | "escuro";
}

export default function YieldCalculator({
  produto,
  produtos,
  compact = false,
  tema = "claro",
}: YieldCalculatorProps) {
  const [area, setArea] = useState("");
  const [demaos, setDemaos] = useState<number>(produto?.demaoPadrao ?? 2);
  const [superficie, setSuperficie] = useState<Surface>(
    produto?.surfaces[0] ?? "alvenaria",
  );
  const [produtoSlug, setProdutoSlug] = useState<string>(
    produtos?.[0]?.slug ?? "",
  );

  const prod =
    produto ??
    produtos?.find((p) => p.slug === produtoSlug) ??
    produtos?.[0];

  const resultado: CalcOutput = useMemo(() => {
    if (!prod) return { estado: "vazio" };
    if (area.trim() === "") return { estado: "vazio" };
    const areaNum = Number.parseFloat(area.replace(",", "."));
    const input = {
      areaM2: areaNum,
      demaos,
      consumoM2PorLDemao: prod.consumoM2PorLDemao,
    };
    if (!Number.isFinite(areaNum) || areaNum <= 0) {
      return { estado: "erro", mensagem: "Informe a área em m²." };
    }
    const erros = validarInput(input);
    if (erros.length > 0) return { estado: "erro", mensagem: erros[0] };
    const r = calcular(input, prod.formats);
    return {
      estado: "ok",
      litros: r.litrosNecessarios,
      embalagens: r.embalagensRecomendadas,
      fornecido: r.volumeTotalFornecido,
      sobra: r.sobraLitros,
    };
  }, [area, demaos, prod]);

  const superficieForaDaFicha =
    prod !== undefined && !prod.surfaces.includes(superficie);

  const waHrefs =
    resultado.estado === "ok" && prod
      ? urlWhatsApp(
          mensagemOrcamento({
            produto: prod.name,
            sku: prod.sku,
            litros: resultado.litros,
            detalhe: `Embalagens sugeridas: ${resultado.embalagens
              .map((e) => `${e.count}× ${e.size}`)
              .join(" + ")}.`,
          }),
        )
      : "";

  const escuro = tema === "escuro";
  const frameCls = escuro
    ? "border-white/10 bg-primary-900"
    : "border-slate-200 bg-surface-alt";
  const labelCls = escuro
    ? "text-slate-300"
    : "text-slate-400";
  const inputCls = escuro
    ? "border-white/15 bg-primary-950/60 text-white placeholder:text-slate-400"
    : "border-slate-200 bg-surface-bg text-text-primary placeholder:text-slate-400";
  const valueCls = escuro ? "text-white" : "text-text-primary";

  return (
    <div
      className={`rounded-lg border ${frameCls} p-6 shadow-e2 sm:p-8`}
      id={compact ? undefined : "calculadora"}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-inherit pb-4">
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.24em] ${labelCls}`}
        >
          Simulador de rendimento
        </p>
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.18em] tabular-nums ${labelCls}`}
        >
          Perda {Math.round(PERDA_PADRAO * 100)}% inclusa
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <label
            htmlFor="calc-area"
            className={`block font-mono text-[11px] uppercase tracking-[0.18em] ${labelCls}`}
          >
            Área (m²)
          </label>
          <input
            id="calc-area"
            inputMode="decimal"
            autoComplete="off"
            placeholder="84"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={`mt-2 w-full rounded-md border px-3 py-2.5 font-mono text-sm tabular-nums outline-none transition-colors focus-visible:border-primary-500 ${inputCls}`}
          />
        </div>

        <div>
          <span
            id="calc-demoes-label"
            className={`block font-mono text-[11px] uppercase tracking-[0.18em] ${labelCls}`}
          >
            Demãos
          </span>
          <div
            className="mt-2 flex items-center gap-1"
            role="group"
            aria-labelledby="calc-demoes-label"
          >
            <button
              type="button"
              aria-label="Diminuir demãos"
              onClick={() => setDemaos((v) => Math.max(LIMITES.demaoMin, v - 1))}
              className={`flex size-10 items-center justify-center rounded-md border transition-colors ${inputCls} hover:opacity-80`}
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <output
              aria-live="polite"
              className={`flex h-10 min-w-14 items-center justify-center rounded-md border px-3 font-mono text-sm tabular-nums ${inputCls} ${valueCls}`}
            >
              {demaos}
            </output>
            <button
              type="button"
              aria-label="Aumentar demãos"
              onClick={() => setDemaos((v) => Math.min(LIMITES.demaoMax, v + 1))}
              className={`flex size-10 items-center justify-center rounded-md border transition-colors ${inputCls} hover:opacity-80`}
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {prod && !compact && (
          <div>
            <label
              htmlFor="calc-superficie"
              className={`block font-mono text-[11px] uppercase tracking-[0.18em] ${labelCls}`}
            >
              Superfície
            </label>
            <select
              id="calc-superficie"
              value={superficie}
              onChange={(e) => setSuperficie(e.target.value as Surface)}
              className={`mt-2 w-full rounded-md border px-3 py-2.5 text-sm ${inputCls}`}
            >
              {SURFACES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {produtos && produtos.length > 1 && !produto && (
          <div>
            <label
              htmlFor="calc-produto"
              className={`block font-mono text-[11px] uppercase tracking-[0.18em] ${labelCls}`}
            >
              Produto
            </label>
            <select
              id="calc-produto"
              value={prod?.slug ?? ""}
              onChange={(e) => setProdutoSlug(e.target.value)}
              className={`mt-2 w-full rounded-md border px-3 py-2.5 text-sm ${inputCls}`}
            >
              {produtos.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {superficieForaDaFicha && (
        <p
          className="mt-4 inline-block rounded bg-accent-50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-700"
          role="status"
        >
          Superfície fora da ficha técnica — consulte o time técnico
        </p>
      )}

      {/* Saída — anunciada a leitores de tela */}
      <div
        aria-live="polite"
        className={`mt-6 rounded-lg border p-6 ${
          escuro ? "border-white/10 bg-primary-950/50" : "border-slate-200 bg-surface-bg"
        }`}
      >
        {resultado.estado === "vazio" && (
          <p
            className={`font-mono text-sm ${escuro ? "text-slate-300" : "text-text-secondary"}`}
          >
            Informe a área para calcular volume e embalagens.
          </p>
        )}

        {resultado.estado === "erro" && (
          <p className="font-mono text-sm text-danger-700" role="alert">
            {resultado.mensagem}
          </p>
        )}

        {resultado.estado === "ok" && prod && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p
                  className={`font-mono text-[11px] uppercase tracking-[0.2em] ${labelCls}`}
                >
                  Volume necessário
                </p>
                <p
                  className={`mt-2 font-display text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl ${valueCls}`}
                >
                  {resultado.litros.toLocaleString("pt-BR", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 2,
                  })}
                  <span className="ml-2 font-mono text-lg font-medium">L</span>
                </p>
              </div>
              <div
                className={`text-right font-mono text-[11px] uppercase tracking-[0.14em] tabular-nums ${labelCls}`}
              >
                <p>{prod.name}</p>
                <p className="mt-1">
                  Rendimento {prod.consumoM2PorLDemao.toLocaleString("pt-BR")}{" "}
                  m²/L/demão
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {resultado.embalagens.map((e) => (
                <span
                  key={e.size}
                  className={`rounded-md border px-3 py-1.5 font-mono text-sm tabular-nums ${
                    escuro
                      ? "border-white/15 text-white"
                      : "border-slate-200 bg-surface-alt text-text-primary"
                  }`}
                >
                  {e.count}× {e.size}
                </span>
              ))}
            </div>

            <p
              className={`mt-4 font-mono text-xs tabular-nums ${labelCls}`}
            >
              Fornecido {formatarLitros(resultado.fornecido)} · sobra{" "}
              {formatarLitros(Math.max(0, resultado.sobra))}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waHrefs}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-success-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Orçar no WhatsApp
              </a>
              {produto && (
                <a
                  href="#especificacoes"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-5 py-3 text-sm font-semibold text-text-secondary transition-colors hover:border-primary-300 hover:text-primary-700"
                >
                  Ver ficha técnica
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
