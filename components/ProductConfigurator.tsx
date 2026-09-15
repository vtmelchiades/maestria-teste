"use client";

import { useState } from "react";
import { FileDown, MessageCircle, Timer } from "lucide-react";
import type { Color, Finish, Product } from "@/types/catalog";
import {
  formatarLitros,
  mensagemOrcamento,
  urlWhatsApp,
} from "@/lib/conversion";
import { lerCorSessao } from "@/lib/atmosphere";
import ColorSelector from "./ColorSelector";

type Vista = "lata" | "aplicacao" | "textura";

const VISTAS: { key: Vista; label: string }[] = [
  { key: "lata", label: "Lata" },
  { key: "aplicacao", label: "Aplicação" },
  { key: "textura", label: "Textura" },
];

/** Escala visual da lata conforme a litragem (zoom sobre a mesma base fotográfica). */
const ESCALA_LITRAGEM: Record<string, number> = {
  "1L": 0.82,
  "3.6L": 0.92,
  "18L": 1,
  "200L": 1.08,
};

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ProductConfiguratorProps {
  product: Product;
  colors: Color[];
}

/**
 * Núcleo interativo da PDP: galeria com troca de litragem + painel de
 * compra (acabamento, cor, litragem), downloads imediatos de BT/FISPQ e
 * conversão direta para WhatsApp com SKU, cor, acabamento e litragem.
 */
export default function ProductConfigurator({
  product,
  colors,
}: ProductConfiguratorProps) {
  const [formato, setFormato] = useState<string>(
    product.formats[0]?.size ?? "18L",
  );
  const [acabamento, setAcabamento] = useState<Finish>(
    product.finishes[0] ?? "fosco",
  );
  const [vista, setVista] = useState<Vista>("lata");
  const [cor, setCor] = useState<string>(() => {
    const sessao = lerCorSessao();
    return sessao && product.colors.includes(sessao.code)
      ? sessao.code
      : (product.colors[0] ?? colors[0]?.code ?? "");
  });

  const corAtiva = colors.find((c) => c.code === cor);
  const escala = ESCALA_LITRAGEM[formato] ?? 1;
  const preco = product.formats.find((f) => f.size === formato)?.priceBRL;

  const waHref = urlWhatsApp(
    mensagemOrcamento({
      produto: product.name,
      sku: product.sku,
      detalhe: `Litragem ${formato} · acabamento ${acabamento} · cor ${
        corAtiva ? `${corAtiva.name} (${corAtiva.code})` : cor
      }.`,
    }),
  );

  const altGaleria =
    vista === "lata"
      ? `Lata ${formato} de ${product.name}, linha ${product.subline}`
      : vista === "aplicacao"
        ? `Aplicação de ${product.name} em obra real`
        : `Textura de acabamento ${acabamento} de ${product.name}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
      {/* ------------------------------ Galeria ------------------------------ */}
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-surface-inset">
          {vista === "lata" ? (
            <div className="atmo relative h-full w-full">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div
                  className="sombra-contato relative rounded-md transition-transform duration-300"
                  style={{ transform: `scale(${escala})` }}
                >
                  <img
                    src={product.images.lata}
                    alt={altGaleria}
                    width={1200}
                    height={900}
                    className="h-64 w-auto object-contain sm:h-80"
                  />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-slate-200 bg-surface-bg px-2.5 py-1 font-mono text-xs tabular-nums text-text-primary">
                    {formato}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <img
                src={product.images[vista]}
                alt={altGaleria}
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              {vista === "textura" && (
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-25 transition-colors duration-300"
                  style={{ backgroundColor: corAtiva?.hex ?? "transparent" }}
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </div>

        {/* Miniaturas */}
        <div
          role="group"
          aria-label="Mudar visualização"
          className="mt-4 grid grid-cols-3 gap-3"
        >
          {VISTAS.map((v) => (
            <button
              key={v.key}
              type="button"
              aria-pressed={vista === v.key}
              onClick={() => setVista(v.key)}
              className={`overflow-hidden rounded-md border-2 transition-colors ${
                vista === v.key
                  ? "border-primary-500"
                  : "border-transparent hover:border-slate-300"
              }`}
            >
              <img
                src={
                  v.key === "lata"
                    ? product.images.lata
                    : product.images[v.key]
                }
                alt=""
                width={240}
                height={180}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
              <span
                className={`block py-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] ${
                  vista === v.key
                    ? "bg-primary-950 text-white"
                    : "bg-surface-alt text-text-secondary"
                }`}
              >
                {v.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------- Painel de compra -------------------------- */}
      <div id="comprar" className="scroll-mt-24">
        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-primary-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-700">
            {product.subline}
          </span>
          <span className="rounded bg-surface-inset px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
            {product.sku}
          </span>
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-text-primary">
          Configuração
        </h2>

        {/* Acabamento */}
        <fieldset className="mt-6">
          <legend className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Acabamento
          </legend>
          <div
            role="group"
            aria-label="Acabamento"
            className="mt-2.5 flex flex-wrap gap-2"
          >
            {product.finishes.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={acabamento === f}
                onClick={() => setAcabamento(f)}
                className={`rounded-md border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                  acabamento === f
                    ? "border-primary-700 bg-primary-700 text-white"
                    : "border-slate-200 bg-surface-bg text-text-secondary hover:border-primary-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Cor */}
        <div className="mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Cor
          </p>
          <div className="mt-2.5">
            <ColorSelector
              colors={colors}
              value={cor}
              onChange={setCor}
              ariaLabel="Cores disponíveis para este produto"
            />
          </div>
        </div>

        {/* Litragem */}
        <fieldset className="mt-6">
          <legend className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Litragem
          </legend>
          <div
            role="radiogroup"
            aria-label="Litragem"
            className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3"
          >
            {product.formats.map((f) => {
              const checked = f.size === formato;
              return (
                <button
                  key={f.code}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  onClick={() => setFormato(f.size)}
                  className={`rounded-md border p-3 text-left transition-colors ${
                    checked
                      ? "border-primary-700 bg-primary-50"
                      : "border-slate-200 bg-surface-bg hover:border-primary-300"
                  }`}
                >
                  <span className="block font-display text-base font-semibold text-text-primary tabular-nums">
                    {f.size}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] text-slate-400 tabular-nums">
                    {f.priceBRL !== undefined
                      ? BRL.format(f.priceBRL)
                      : "Sob consulta"}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* CTAs de conversão */}
        <div className="mt-8 space-y-3">
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-700"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Solicitar orçamento
          </a>
          <a
            href={urlWhatsApp(
              mensagemOrcamento({
                produto: product.name,
                sku: product.sku,
                detalhe: `Litragem ${formato} · acabamento ${acabamento}.`,
              }),
            )}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-6 py-4 text-sm font-semibold text-text-primary transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            Chamar no WhatsApp
          </a>
          <p className="flex items-center justify-center gap-2 pt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
            <Timer className="size-3.5" aria-hidden="true" />
            Resposta em até 1 dia útil
          </p>
        </div>

        {/* Downloads imediatos — sem barreiras de formulário */}
        <div className="mt-8 rounded-lg border border-slate-200 bg-surface-alt p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Documentos técnicos
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={product.btPdf}
                download
                className="group flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-surface-bg px-4 py-3 transition-colors hover:border-primary-300"
              >
                <span className="flex items-center gap-3">
                  <FileDown className="size-4 text-primary-700" aria-hidden="true" />
                  <span className="text-sm font-medium text-text-primary group-hover:text-primary-700">
                    Boletim Técnico
                  </span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  PDF
                </span>
              </a>
            </li>
            <li>
              <a
                href={product.fisqpPdf}
                download
                className="group flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-surface-bg px-4 py-3 transition-colors hover:border-primary-300"
              >
                <span className="flex items-center gap-3">
                  <FileDown className="size-4 text-primary-700" aria-hidden="true" />
                  <span className="text-sm font-medium text-text-primary group-hover:text-primary-700">
                    FISPQ
                  </span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  PDF
                </span>
              </a>
            </li>
          </ul>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Download imediato — sem cadastro
          </p>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-text-secondary">
          {product.description}
        </p>
      </div>
    </div>
  );
}
