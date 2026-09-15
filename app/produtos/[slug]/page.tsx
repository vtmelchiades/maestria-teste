import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ProductConfigurator from "@/components/ProductConfigurator";
import YieldCalculator from "@/components/YieldCalculator";
import {
  coresDoProduto,
  linhaPorSlug,
  products,
} from "@/lib/mock-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: product.metaTitle,
    description: product.metaDescription,
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      type: "website",
      images: [{ url: product.images.lata, width: 1200, height: 900 }],
    },
  };
}

const BASE_LABEL: Record<string, string> = {
  agua: "Base água",
  solvente: "Base solvente",
};

export default async function PdpPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const linha = linhaPorSlug(product.line);
  const cores = coresDoProduto(product.colors);

  const specs: [string, string][] = [
    ["Base", BASE_LABEL[product.base]],
    ["Acabamentos", product.finishes.join(" / ")],
    ["Ambientes", product.environments.join(" / ")],
    ["Superfícies", product.surfaces.join(" / ")],
    [
      "Rendimento",
      `${product.consumoM2PorLDemao.toLocaleString("pt-BR")} m²/L/demão`,
    ],
    ["Demãos recomendadas", String(product.demaoPadrao)],
    ["Diluição", product.diluir],
    ["Secagem — ao toque", `${product.secagem.aoToqueH} h`],
    ["Secagem — entre demãos", `${product.secagem.entreDemaoH} h`],
    ["Secagem — total", `${product.secagem.totalH} h`],
    ["Litragens", product.formats.map((f) => f.size).join(" · ")],
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-24 sm:px-8 sm:pt-28">
      {/* Breadcrumb */}
      <nav aria-label="Trilha de navegação" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
          <li>
            <Link href="/" className="transition-colors hover:text-primary-700">
              Início
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/#linha-${product.line}`}
              className="transition-colors hover:text-primary-700"
            >
              {linha?.name ?? product.line}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-text-secondary">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Cabeçalho do produto */}
      <header className="mb-10 max-w-3xl border-b border-slate-200 pb-10">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
          {product.name}
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            BASE_LABEL[product.base],
            ...product.finishes,
            ...product.environments,
            ...product.surfaces,
          ].map((chip) => (
            <span
              key={chip}
              className="rounded border border-slate-200 bg-surface-bg px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary"
            >
              {chip}
            </span>
          ))}
        </div>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400 tabular-nums">
          SKU {product.sku} · Rendimento{" "}
          {product.consumoM2PorLDemao.toLocaleString("pt-BR")} m²/L/demão ·
          Secagem ao toque {product.secagem.aoToqueH} h
        </p>
      </header>

      {/* Configuração + galeria */}
      <ProductConfigurator product={product} colors={cores} />

      {/* Especificações técnicas — estilo suíço/industrial */}
      <section id="especificacoes" className="mt-20 scroll-mt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
          01 — Especificação técnica
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Ficha técnica
        </h2>
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full">
            <caption className="sr-only">
              Especificações técnicas de {product.name}
            </caption>
            <tbody>
              {specs.map(([label, value]) => (
                <tr key={label} className="border-b border-slate-100 last:border-b-0">
                  <th
                    scope="row"
                    className="w-48 bg-surface-alt px-5 py-3.5 text-left align-top font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400 sm:w-56"
                  >
                    {label}
                  </th>
                  <td className="px-5 py-3.5 text-sm text-text-primary tabular-nums">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modo de aplicação */}
      <section className="mt-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
          02 — Modo de aplicação
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Do preparo à entrega
        </h2>
        <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2">
          {product.applicationSteps.map((passo, i) => (
            <li key={passo} className="bg-surface-bg p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-700">
                Passo 0{i + 1}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {passo}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Calculadora inline pré-alimentada */}
      <section className="mt-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-400">
          03 — Simulador
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Dimensione o volume
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary">
          Rendimento, demãos padrão e litragens já carregados da ficha técnica
          de {product.name}. Informe a área do projeto.
        </p>
        <div className="mt-8">
          <YieldCalculator produto={product} />
        </div>
      </section>
    </div>
  );
}
