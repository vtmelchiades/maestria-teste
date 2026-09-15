import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Timer,
  Truck,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import TactileFinishViewer from "@/components/TactileFinishViewer";
import YieldCalculator from "@/components/YieldCalculator";
import {
  contarPorLinha,
  lines,
  produtos,
  produtosPorLinha,
} from "@/lib/mock-data";
import { mensagemOrcamento, urlWhatsApp } from "@/lib/conversion";

function SectionHeader({
  index,
  titulo,
  sub,
  escuro = false,
}: {
  index: string;
  titulo: string;
  sub?: string;
  escuro?: boolean;
}) {
  return (
    <div
      className={`mb-10 flex flex-wrap items-end justify-between gap-4 border-b pb-6 ${
        escuro ? "border-white/10" : "border-slate-200"
      }`}
    >
      <div>
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.3em] ${
            escuro ? "text-primary-300" : "text-slate-400"
          }`}
        >
          {index}
        </p>
        <h2
          className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl ${
            escuro ? "text-white" : "text-text-primary"
          }`}
        >
          {titulo}
        </h2>
      </div>
      {sub && (
        <p
          className={`max-w-sm text-sm leading-relaxed ${
            escuro ? "text-slate-300" : "text-text-secondary"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-primary-950">
        <img
          src="/images/hero.jpg"
          alt="Parede texturizada pintada com sistema Maestria sob luz dramática"
          width={1600}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/55 to-primary-950/15"
          aria-hidden="true"
        />
        <div className="grain" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[1200px] px-6 pb-16 pt-36 sm:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary-300">
            Tintas &amp; Sistemas — desde 2009
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl">
            A precisão de um laboratório.{" "}
            <span className="text-primary-300">A cor de uma obra.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Catálogo técnico com cálculo de rendimento em segundos, fichas
            BT/FISPQ em um clique e a cor exata para a sua superfície.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#calculadora"
              className="inline-flex items-center gap-2 rounded-md bg-accent-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-700"
            >
              Calcular rendimento
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#linhas"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-4 text-sm font-semibold text-white transition-colors hover:border-white/60"
            >
              Explorar o catálogo
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 font-mono text-white sm:grid-cols-4">
            {[
              ["06", "linhas de produto"],
              ["40+", "SKUs técnicos"],
              ["15", "anos de ateliê"],
              ["20+", "países atendidos"],
            ].map(([n, label]) => (
              <div key={label} className="bg-primary-950/40 p-4 backdrop-blur-sm">
                <dt className="order-2 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                  {label}
                </dt>
                <dd className="order-1 text-2xl font-semibold tabular-nums">
                  {n}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============================ LINHAS ============================ */}
      <section id="linhas" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-20 sm:px-8 sm:py-24">
        <SectionHeader
          index="01 — Catálogo"
          titulo="Seis linhas, um padrão."
          sub="Cada linha segue o mesmo rigor de ficha técnica: rendimento, secagem, diluição e documentos para download."
        />

        <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
          {lines.map((linha, i) => {
            const prods = produtosPorLinha(linha.slug);
            return (
              <article
                id={`linha-${linha.slug}`}
                key={linha.slug}
                className="group scroll-mt-24 bg-surface-bg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={linha.image}
                    alt={`Linha ${linha.name}`}
                    width={640}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 rounded bg-primary-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur">
                    L.0{i + 1}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                    {linha.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {linha.description}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      {prods.length > 0
                        ? `${prods.length} produto${prods.length > 1 ? "s" : ""}`
                        : "Linha completa"}
                    </span>
                    {prods.length > 0 ? (
                      prods.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/produtos/${p.slug}`}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-primary-300 hover:text-primary-700"
                        >
                          {p.name}
                          <ArrowUpRight className="size-3" aria-hidden="true" />
                        </Link>
                      ))
                    ) : (
                      <a
                        href={urlWhatsApp(
                          mensagemOrcamento({
                            detalhe: `Quero o catálogo completo da linha ${linha.name}.`,
                          }),
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-primary-300 hover:text-primary-700"
                      >
                        Sob consulta
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================== DESTAQUES =========================== */}
      <section id="destaques" className="scroll-mt-24 bg-surface-alt py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <SectionHeader
            index="02 — Destaques técnicos"
            titulo="O catálogo em primeiro plano."
            sub="Cards com dados de ficha: base, acabamento, litragens e preço — antes de você clicar."
          />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {produtos.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================= SIMULADOR TÁTIL ========================= */}
      <section id="acabamento" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-20 sm:px-8 sm:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
              03 — Simulador tátil
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Toque a parede.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
              A mesma superfície, o mesmo tom — três físicos de luz. Mova o
              cursor e observe como cada acabamento reflete: absorção,
              difusão aveludada ou ponto especular.
            </p>
            <ul className="mt-8 space-y-3 border-l border-slate-200 pl-5">
              {[
                ["Fosco", "absorção suave — esconde imperfeições"],
                ["Acetinado", "difusão profunda — leitura de cor fiel"],
                ["Semibrilho", "especular nítido — acentua textura"],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3 text-sm">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-700">
                    {k}
                  </span>
                  <span className="text-text-secondary">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <TactileFinishViewer />
        </div>
      </section>

      {/* ========================== CALCULADORA ========================== */}
      <section
        id="calculadora"
        className="relative scroll-mt-24 overflow-hidden bg-primary-950 py-20 sm:py-24"
      >
        <div className="grain" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8">
          <SectionHeader
            escuro
            index="04 — Console de cálculo"
            titulo="Quanto o seu projeto consome?"
            sub="Área, demãos e o rendimento real da ficha técnica. O volume e as embalagens saem na hora."
          />
          <div className="max-w-4xl">
            <YieldCalculator produtos={produtos} compact tema="escuro" />
          </div>
        </div>
      </section>

      {/* ============================== B2B ============================== */}
      <section id="b2b" className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-20 sm:px-8 sm:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
              05 — Canal B2B
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              Atacado, representação e assistência técnica.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
              Revendas, construtoras e industriais com condições comerciais,
              amostras e suporte de formulação — do orçamento à entrega em
              obra.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                [Timer, "Resposta comercial em até 1 dia útil"],
                [Truck, "Logística para todo o Brasil e exportação"],
                [ShieldCheck, "Assistência técnica de formulação inclusa"],
              ].map(([Icon, label]) => {
                const Ico = Icon as typeof Timer;
                return (
                  <li
                    key={label as string}
                    className="flex items-center gap-3 rounded-md border border-slate-200 bg-surface-alt px-4 py-3 text-sm font-medium text-text-primary"
                  >
                    <Ico className="size-4 shrink-0 text-primary-700" aria-hidden="true" />
                    {label as string}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-200 bg-surface-alt p-8 shadow-e1">
            <h3 className="font-display text-xl font-semibold tracking-tight text-text-primary">
              Fale com o time comercial
            </h3>
            <dl className="mt-5 space-y-2 font-mono text-sm text-text-secondary tabular-nums">
              <div className="flex justify-between gap-4">
                <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-400">E-mail</dt>
                <dd>comercial@tintasmaestria.com.br</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Telefone</dt>
                <dd>+55 14 99835-1483</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-400">SLA</dt>
                <dd>1 dia útil</dd>
              </div>
            </dl>
            <div className="mt-8 space-y-3">
              <a
                href={urlWhatsApp(
                  mensagemOrcamento({
                    detalhe: "Solicito cotação de atacado (B2B).",
                  }),
                )}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-accent-700"
              >
                Solicitar cotação de atacado
              </a>
              <a
                href={urlWhatsApp(
                  mensagemOrcamento({
                    detalhe: "Tenho interesse em representar a Maestria.",
                  }),
                )}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-6 py-4 text-sm font-semibold text-text-primary transition-colors hover:border-primary-300 hover:text-primary-700"
              >
                Quero representar a Maestria
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
